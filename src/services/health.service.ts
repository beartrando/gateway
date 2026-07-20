import * as servicesClient from '../grpc/clients/services.client';
import * as healthGrpc from '../grpc/generated/common/health';

const startedAt = Date.now();

export const check = async (): Promise<healthGrpc.HealthReport> => {
    const reports = await servicesClient.checkAll();

    const components: Record<string, healthGrpc.HealthStatus> = {};

    for (const [name, report] of Object.entries(reports)) {
        components[name] =
            report?.status === healthGrpc.HealthStatus.HEALTH_STATUS_OK
                ? healthGrpc.HealthStatus.HEALTH_STATUS_OK
                : healthGrpc.HealthStatus.HEALTH_STATUS_FAIL;
    }

    return {
        service: "gateway",
        status: Object.values(reports).every(
            report => report?.status === healthGrpc.HealthStatus.HEALTH_STATUS_OK,
        )
            ? healthGrpc.HealthStatus.HEALTH_STATUS_OK
            : healthGrpc.HealthStatus.HEALTH_STATUS_FAIL,
        components,
        timestamp: new Date(),
    };
};

export const fullHealth = async () => {

    const reports = await servicesClient.checkAll();

    return {
        status: Object.values(reports).every(
            report => report?.status,
        ),
        components: reports,
    };
};

export const status = async () => {
    const uptimeMs = Date.now() - startedAt;

    return {
        name: "gateway",
        version: process.env.BUILD_VERSION || "dev",
        env: process.env.NODE_ENV || "development",
        uptimeSeconds: {
            seconds: Math.floor(uptimeMs / 1000),
            nanos: (uptimeMs % 1000) * 1_000_000,
        },
        timestamp: new Date(),
    };
};
export const livez = async () => {
    return {
        live: true,
    };
};

export const readyz = async () => {
    const pgOk = true;
    const kafkaOk = true;
    return {ready: pgOk && kafkaOk};
};
