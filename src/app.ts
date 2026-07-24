import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import httpApp from "./http/server";
import config from "./config/config";

const GRPC_PORT =
    process.env.GRPC_PORT ?? '50051';

async function startGrpc(): Promise<void> {
    return new Promise<void>(
        (resolve, reject) => {
            grpcServer.bindAsync(
                `0.0.0.0:${GRPC_PORT}`,
                grpc.ServerCredentials.createInsecure(),
                (err, port) => {
                    if (err) {
                        logger.error(
                            { err },
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

async function startHttp() {
    return new Promise<void>((resolve) => {
        httpApp.listen(config.httpPort, "0.0.0.0", () => {
            logger.info(`🌐 HTTP started on port ${config.httpPort}`);
            resolve();
        });
    });
}

async function bootstrap(): Promise<void> {

    try {
        await startGrpc();
        await startHttp();
        logger.info(
            '🚀 Gateway service started',
        );
    } catch (err) {
        logger.error(
            { err },
            '💥 Failed to start Battle',
        );
        process.exit(1);
    }

    process.on(
        'SIGINT',
        async () => {
            logger.info(
                '🛑 Shutting down...',
            );
            grpcServer.forceShutdown();
            process.exit(0);
        },
    );
}

function sleep(
    ms: number,
): Promise<void> {
    return new Promise(
        resolve => setTimeout(resolve, ms),
    );
}

bootstrap();


