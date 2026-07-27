import * as healthGrpc from "../../grpc/generated/common/health";
import healthAgregator from "../../grpc/clients/health.agregator";

export class FullHealthUseCase {

    async execute() {

        const reports = await healthAgregator.checkAll();

        const ok = Object.values(reports).every(
            report => report?.status === healthGrpc.HealthStatus.HEALTH_STATUS_OK,
        );

        return {
            status: ok
                ? healthGrpc.HealthStatus.HEALTH_STATUS_OK
                : healthGrpc.HealthStatus.HEALTH_STATUS_FAIL,
            components: reports,
        };
    }
}

const fullHealthUseCase = new FullHealthUseCase();

export default fullHealthUseCase;


