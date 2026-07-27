import logger from "@shared/logger";
import config from "../config/config";
import express, {Express} from 'express';
import morgan from 'morgan';
import gatewayRoutes from '../http/routes/gateway.routes';
import * as orchestrationController from '../http/controllers/orchestration.controller';
import cors from 'cors'
// import cookieParser from "cookie-parser";
import {Server} from "http";

export class HttpService {
    private readonly app: Express;
    private server?: Server;

    constructor(private readonly httpPort: number) {

        this.app = express();
        this.app.use(express.json());
        this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
        this.app.use(cors({
            origin: '*', // ['http://localhost:8080']
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        // this.app.use(cookieParser());


        this.app.use('/gateway', gatewayRoutes);
        this.app.use(orchestrationController.proxy);
    }

    async init(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.server = this.app.listen(this.httpPort, "0.0.0.0", () => {
                logger.info(`🌐 HTTP started on port ${this.httpPort}`);
                resolve();
            });
        });
    }

    async stop(): Promise<void> {
        if (!this.server) return;

        await new Promise<void>((resolve, reject) => {
            this.server!.close(err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

export const httpService = new HttpService(config.httpPort);

export default httpService;

