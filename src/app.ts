import logger from '@shared/logger';
import GrpcService from "./infrastructure/grpc/grpc.service";
import FullHealthUseCase from "./application/use-cases/health/full-health";
import HealthHandler from "./infrastructure/grpc/handlers/health.handler";
import HealthUseCase from "./application/use-cases/health/health";
import StatusUseCase from "./application/use-cases/health/status";
import LivezUseCase from "./application/use-cases/health/livez";
import ReadyzUseCase from "./application/use-cases/health/readyz";
import {config as grpcConfig} from "./infrastructure/grpc/config/config";
import {config as httpConfig} from "./infrastructure/http/config";
import OrchestrationService from "./infrastructure/orchestration/orchestration.service";
import HttpService from "./infrastructure/http/http.service";
import ProxyController from "./infrastructure/http/controllers/proxy-controller";
import HealthController from "./infrastructure/http/controllers/gateway.controller";
import GatewayRouter from "./infrastructure/http/routes/health.routes";


const fullHealthUseCase = new FullHealthUseCase;
const healthUseCase = new HealthUseCase;
const statusUseCase = new StatusUseCase;
const livezUseCase = new LivezUseCase;
const readyzUseCase = new ReadyzUseCase;

const healthHandler = new HealthHandler(
    healthUseCase,
    statusUseCase,
    livezUseCase,
    readyzUseCase,
)

const healthController = new HealthController(
    fullHealthUseCase,
    healthUseCase,
    statusUseCase,
    livezUseCase,
    readyzUseCase,
);

const gatewayRouter = new GatewayRouter(healthController);


const proxyController = new ProxyController(new OrchestrationService());

async function bootstrap(): Promise<void> {

    const grpcService = new GrpcService(grpcConfig.port, healthHandler);
    const httpService = new HttpService(httpConfig.port, gatewayRouter, proxyController);

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
