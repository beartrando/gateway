import * as servicesClient from '../grpc/clients/services.client';

const startedAt = Date.now();

export const check = async () => {

    const reports = await servicesClient.checkAll();

    const components: Record<string, string> = {};

    for (const [name, report] of Object.entries(reports)) {

        components[name] =
            report?.status
                ? "ok"
                : "fail";

    }

    return {
        status: Object.values(reports).every(report => report?.status)
            ? "ok"
            : "fail",
        components,
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
    return {
        name: 'gateway',
        version: process.env.BUILD_VERSION || 'dev',
        env: process.env.NODE_ENV || 'development',
        uptime: Math.floor((Date.now() - startedAt) / 1000),
        timestamp: new Date().toISOString(),
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
