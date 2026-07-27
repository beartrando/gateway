import * as grpc from "@grpc/grpc-js";
import {HealthService} from '../grpc/generated/common/health';
import * as healthHandler from "../grpc/handlers/health.handler";
import logger from "@shared/logger";
import config from "../config/config";

export class GrpcService {
    private readonly server: grpc.Server;

    constructor(private readonly grpcPort: number) {
        this.server = new grpc.Server();
    }

    async init(): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.addServices();
                this.server.bindAsync(
                    `0.0.0.0:${this.grpcPort}`,
                    grpc.ServerCredentials.createInsecure(),
                    (err, port) => {
                        if (err) {
                            logger.error(
                                {err},
                                '❌ Failed to start gRPC',
                            );

                            return reject(err);
                        }
                        this.server.start();
                        logger.info(
                            `🟢 gRPC server started on port ${port}`,
                        );
                        resolve();
                    },
                );
            },
        );
    }

    private registerHealthService() {
        this.server.addService(HealthService, {
            check: healthHandler.check,
            status: healthHandler.status,
            livez: healthHandler.livez,
            readyz: healthHandler.readyz,
        });
    }

    private addServices() {
        this.registerHealthService();
    }

    stop() {
        this.server.forceShutdown();
    }
}

export const grpcService = new GrpcService(config.grpcPort);

export default grpcService;

