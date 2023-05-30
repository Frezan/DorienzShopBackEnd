import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as httpContext from 'express-http-context';
import * as session from 'express-session';
import * as http from 'http';
import { connect } from 'mongoose';
import * as path from 'path';
import { registerRoutes } from './routes';
const cookieParser = require('cookie-parser');

interface ISessionObject {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    store: session.MemoryStore;
}

// tslint:disable-next-line:completed-docs
export class App {
    public express: express.Express;
    public httpServer: http.Server;
    public async init(environment?: string): Promise<void> {
        try {
            this.express = express();
            this.httpServer = http.createServer(this.express);
            this.express.use(this.setupCors);
            this.setupMiddleware();
            await this.dbConnection();
           registerRoutes(this.express);
        } catch (err) {
            console.log(err);
        }
    }

    private async dbConnection(): Promise<typeof import('mongoose')> {
        const url: string = process.env.MONGODB_URL;

        const config: Object = {
            useNewUrlParser: true,
            synchronize: true,
            useUnifiedTopology: true,
            logging: true,
        };
        const con = await connect(url, config);
        return con;
    }

    private setupMiddleware(): void {
        const memoryStore: session.MemoryStore = new session.MemoryStore();
        const sessionObj: ISessionObject = {
            secret: 'mySecret',
            resave: false,
            saveUninitialized: true,
            store: memoryStore,
        };
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
        this.express.use(cookieParser())
        this.express.use(express.static('public'));
        this.express.use(express.static(path.join(__dirname, 'public')));
        this.express.use(httpContext.middleware);
    }


    private setupCors(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): void {
        let origin: any = req.header('Origin');
        if (!origin) {
            origin = '*';
        }
        origin = 'http://localhost:3000';

        console.log("origin ====>",origin)
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        );
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Authorization,X-Requested-With,content-type'
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    }
}
