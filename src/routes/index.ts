import { Express } from "express";
import routerUser from './userRoute';
import routerAdmin from './adminRoute';

const initRoutes = (app: Express) => {
   app.use('/api/v1/user', routerUser);
   app.use('/api/v1/admin', routerAdmin);
}

export default initRoutes;