import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import config from "./infrastructure/app/config";
import grpcService from "./infrastructure/grpc/grpc.service";
import httpService from "./infrastructure/http/http.service";

async function bootstrap(): Promise<void> {

    try {
        await grpcService.init();
        await httpService.init();

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

            await grpcService.stop();
            await httpService.stop();

            process.exit(0);
        },
    );
}

bootstrap();





