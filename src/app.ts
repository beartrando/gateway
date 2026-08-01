import logger from '@shared/logger';
import buildGrpcService from "./bootstrap/build-grpc-service";
import buildHttpService from "./bootstrap/build-http-service";


const grpcService = buildGrpcService();
const httpService = buildHttpService();

async function bootstrap(): Promise<void> {

    try {
        await grpcService.init();
        await httpService.init();

        logger.info(
            '🚀 Gateway service started',
        );
    } catch (err) {
        logger.error(
            {err},
            '💥 Failed to start Gateway',
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



