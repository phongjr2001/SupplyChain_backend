import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import initRoutes from './routes';
import database from './config/database';
import checkToken from './authentication/auth';

const port = process.env.PORT || 8000;
const app: Express = express();

app.use(checkToken);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
   origin: ['http://localhost:3000', 'http://localhost:3001'],
   methods: ['POST', 'DELETE', 'PUT', 'GET']
}));

initRoutes(app);
app.use(express.static('./public'));

/* create table to database */
// (async () => {
//    await database.sync();
// })();

declare global {
   namespace Express {
      interface Request {
         user: any
      }
   }
}

app.listen(port, () => { console.log(`Server running at http://localhost:${port}`) });