import * as healthGrpc from "../grpc/generated/common/health";
import config from "../config/config";
import * as servicesClient from "../grpc/clients/services.client";

export class HealthUseCase {

    async execute(): Promise<healthGrpc.HealthReport> {
        const reports = await servicesClient.checkAll();

        const components: Record<string, healthGrpc.HealthStatus> = {};

        let status = healthGrpc.HealthStatus.HEALTH_STATUS_OK;

        for (const [name, report] of Object.entries(reports)) {
            const componentStatus =
                report?.status === healthGrpc.HealthStatus.HEALTH_STATUS_OK
                    ? healthGrpc.HealthStatus.HEALTH_STATUS_OK
                    : healthGrpc.HealthStatus.HEALTH_STATUS_FAIL;

            components[name] = componentStatus;

            if (componentStatus === healthGrpc.HealthStatus.HEALTH_STATUS_FAIL) {
                status = healthGrpc.HealthStatus.HEALTH_STATUS_FAIL;
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

const healthUseCase = new HealthUseCase();

export default healthUseCase;

