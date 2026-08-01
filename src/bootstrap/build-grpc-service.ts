import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import HealthHandler from "../infrastructure/grpc/handlers/health.handler";
import GrpcService from "../infrastructure/grpc/grpc.service";
import HealthAgregator from "../infrastructure/grpc/clients/health.agregator";
import {config as grpcConfig} from "../infrastructure/grpc/config/config";

function buildGrpcService() {

    const healthAgregator = new HealthAgregator();

    const healthUseCase = new HealthUseCase(healthAgregator);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const healthHandler = new HealthHandler(
        healthUseCase,
        statusUseCase,
        livezUseCase,
        readyzUseCase,
    )


    return new GrpcService(grpcConfig.port, healthHandler);
}

export default buildGrpcService;
