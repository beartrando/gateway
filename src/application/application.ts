import logger from "@shared/logger";
import GrpcService from "../infrastructure/grpc/service";
import HttpService from "../infrastructure/http/service";

export class Application {
    constructor(
        private readonly grpcService: GrpcService,
        private readonly httpService: HttpService,
    ) {
    }

    async start(): Promise<void> {

        try {

            await this.grpcService.start();
            await this.httpService.start();

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

                await this.stop();

                process.exit(0);
            },
        );
    }

    async stop() {
        await this.grpcService.stop();
        await this.httpService.stop();
    }
}

export default Application;
