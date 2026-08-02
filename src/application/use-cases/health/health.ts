import * as healthProto from "../../../contracts/proto/common/health";
import config from "../../../infrastructure/app/config";
import HealthAggregator from "../../../infrastructure/grpc/clients/health.aggregator";

export class HealthUseCase {

    constructor(private readonly healthAgregator: HealthAggregator) {
    }

    async execute(): Promise<healthProto.HealthReport> {
        const reports = await this.healthAgregator.checkAll();

        const components: Record<string, healthProto.HealthStatus> = {};

        let status = healthProto.HealthStatus.HEALTH_STATUS_OK;

        for (const [name, report] of Object.entries(reports)) {
            const componentStatus =
                report?.status === healthProto.HealthStatus.HEALTH_STATUS_OK
                    ? healthProto.HealthStatus.HEALTH_STATUS_OK
                    : healthProto.HealthStatus.HEALTH_STATUS_FAIL;

            components[name] = componentStatus;

            if (componentStatus === healthProto.HealthStatus.HEALTH_STATUS_FAIL) {
                status = healthProto.HealthStatus.HEALTH_STATUS_FAIL;
            }
        }

        return {
            service: config.appName,
            status,
            components,
            timestamp: new Date(),
        };
    }
}

export default HealthUseCase;
