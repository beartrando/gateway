import express, {Express} from 'express';
import morgan from 'morgan';
import gatewayRoutes from './routes/gateway.routes';
import * as orchestrationController from './controllers/orchestration.controller';
import cors from 'cors'
import cookieParser from "cookie-parser";

const app: Express = express();
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors({
    origin: '*', // ['http://localhost:8080']
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.use(cookieParser());


app.use('/gateway', gatewayRoutes);
app.use(orchestrationController.proxy);


export default app;


