import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import HealthHandler from "../infrastructure/grpc/handlers/health.handler";
import GrpcService from "../infrastructure/grpc/service";
import HealthAggregator from "../infrastructure/grpc/clients/health.aggregator";
import {grpcConfig as grpcConfig} from "../infrastructure/grpc/config/config";
import {httpConfig as httpConfig} from "../infrastructure/http/config";
import FullHealthUseCase from "../application/use-cases/health/full-health";
import HealthController from "../infrastructure/http/controllers/gateway.controller";
import HttpService from "../infrastructure/http/service";
import OrchestrationService from "../infrastructure/orchestration/service";
import OrchestrationClient from "../infrastructure/grpc/clients/orchestration.client";
import ProxyController from "../infrastructure/http/controllers/proxy-controller";
import microservicesConfig from "../infrastructure/grpc/config/microservices.config";
import GatewayRouter from "../infrastructure/http/routes/health.routes";
import Application from "../application/application";

function buildApplication() {

    const healthAggregator = new HealthAggregator();

    const fullHealthUseCase = new FullHealthUseCase(healthAggregator);
    const healthUseCase = new HealthUseCase(healthAggregator);
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


    const orchestrationClient = new OrchestrationClient(microservicesConfig.orchestration.url);
    const orchestrationService = new OrchestrationService(orchestrationClient);
    const proxyController = new ProxyController(orchestrationService);


    const httpService = new HttpService(httpConfig.port, gatewayRouter, proxyController);
    const grpcService = new GrpcService(grpcConfig.port, healthHandler);

    const application = new Application(grpcService, httpService);

    return application;
}

export default buildApplication;
