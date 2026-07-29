import * as grpc from "@grpc/grpc-js";
import * as healthProto from '../../contracts/proto/common/health';
import logger from "@shared/logger";
import config from "./config/config";
import HealthHandler from "./handlers/health.handler";

export class GrpcService {
    private readonly server: grpc.Server;

    constructor(private readonly grpcPort: number, private readonly healthHandler: HealthHandler) {
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
        this.server.addService(healthProto.HealthService, {
            check: this.healthHandler.check,
            status: this.healthHandler.status,
            livez: this.healthHandler.livez,
            readyz: this.healthHandler.readyz,
        });
    }

    private addServices() {
        this.registerHealthService();
    }

    stop() {
        this.server.forceShutdown();
    }
}

export default GrpcService;

