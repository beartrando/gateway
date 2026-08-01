import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import {config as httpConfig} from "../infrastructure/http/config";
import HealthAgregator from "../infrastructure/grpc/clients/health.agregator";
import FullHealthUseCase from "../application/use-cases/health/full-health";
import HealthController from "../infrastructure/http/controllers/gateway.controller";
import HttpService from "../infrastructure/http/http.service";
import OrchestrationService from "../infrastructure/orchestration/orchestration.service";
import OrchestrationClient from "../infrastructure/grpc/clients/orchestration.client";
import ProxyController from "../infrastructure/http/controllers/proxy-controller";
import microservicesConfig from "../infrastructure/grpc/config/microservices.config";
import GatewayRouter from "../infrastructure/http/routes/health.routes";

function buildHttpService() {

    const healthAgregator = new HealthAgregator();

    const fullHealthUseCase = new FullHealthUseCase(healthAgregator);
    const healthUseCase = new HealthUseCase(healthAgregator);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

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


    return new HttpService(httpConfig.port, gatewayRouter, proxyController);

}


export default buildHttpService;
