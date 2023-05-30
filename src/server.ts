// istanbul ignore file
import * as dotenv from 'dotenv';
const path = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path });

import * as http from 'http';
import { AddressInfo } from 'net';
import { App } from './App';

const port: string | undefined | number = process.env.PORT || 3146;
export const app: App = new App();
export let server: http.Server;

app.init()
    .then(() => {
        app.express.set('port', port);

        server = app.httpServer; //http.createServer(App);
        server.on('error', serverError);
        server.on('listening', serverListening);
        server.listen(port);
    })
    .catch((err: Error) => {
        console.log('app.init error', err.message);
        process.exit(1);
    });

function serverError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    //handle specific error codes here.
    throw error;
}

function serverListening(): void {
    const addressInfo: AddressInfo = <AddressInfo>server.address();
    console.log(`Listening on ${addressInfo.address}:${port}`);
}

process.on('unhandledRejection', (reason: Error) => {
    console.log(
        `Unhandled Promise Rejection: reason: ${JSON.stringify(reason.message)}`
    );
    console.log(reason.stack);
    // application specific logging, throwing an error, or other logic here
});
