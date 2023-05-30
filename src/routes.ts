import * as express from 'express';
import { userRoutes } from './components/users/usersRoutes';
import { tagsRoutes } from './components/tags/tagsRoutes';
import { productsRoutes } from './components/products/productsRoutes';

export function registerRoutes(app: express.Express): any {
    const router: any = express.Router();
    app.use('/api', router);
    userRoutes(app, router);
    tagsRoutes(app, router);
    productsRoutes(app, router)
}
