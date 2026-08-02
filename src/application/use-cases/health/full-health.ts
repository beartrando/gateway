import * as healthProto from "../../../contracts/proto/common/health";
import HealthAggregator from "../../../infrastructure/grpc/clients/health.aggregator";

export class FullHealthUseCase {

    constructor(private readonly healthAgregator: HealthAggregator) {
    }

    async execute() {

        const reports = await this.healthAgregator.checkAll();

        const ok = Object.values(reports).every(
            report => report?.status === healthProto.HealthStatus.HEALTH_STATUS_OK,
        );

        return {
            status: ok
                ? healthProto.HealthStatus.HEALTH_STATUS_OK
                : healthProto.HealthStatus.HEALTH_STATUS_FAIL,
            components: reports,
        };
    }
}

export default FullHealthUseCase;
