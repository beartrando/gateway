import * as grpc from "@grpc/grpc-js";

import * as emptyGrpc from "../generated/common/empty";
import * as healthGrpc from "../generated/common/health";

import servicesConfig from "../../config/servicesConfig";

import {GrpcClientManager} from "@shared/grpc-client-manager";
import logger from "@shared/logger";

const managers = Object.fromEntries(
    Object.entries(servicesConfig).map(([serviceName, service]) => [

        serviceName,

        new GrpcClientManager<healthGrpc.HealthClient>(() =>

            new healthGrpc.HealthClient(
                service.url,
                grpc.credentials.createInsecure(),
            ),
        ),

    ]),
) satisfies Record<string, GrpcClientManager<healthGrpc.HealthClient>>;

export async function check(
    service: string,
): Promise<healthGrpc.HealthReport | null> {
    const manager = managers[service];

    if (!manager) {
        throw new Error(
            `Unknown service '${service}'`,
        );
    }

    try {
        return manager.call<healthGrpc.HealthReport>((client, callback) =>
            client.check({} as emptyGrpc.Empty, callback),
        );
    } catch (err) {
        logger.error("Service health check failed", {
            service,
            err,
        });
        return null;
    }
}

export async function checkAll(): Promise<Record<string, healthGrpc.HealthReport | null>> {
    const reports = await Promise.all(
        Object.entries(managers).map(async ([serviceName, manager]) => {

            try {

                const report = await manager.call((client, callback) =>
                    client.check({} as emptyGrpc.Empty, callback),
                );

                return [serviceName, report] as const;

            } catch (err) {
                logger.error("Service health check failed", {
                    serviceName,
                    err,
                })
                return [
                    serviceName,
                    null,
                ] as const;

            }

        }),
    );

    return Object.fromEntries(reports) as Record<
        string,
        healthGrpc.HealthReport | null
    >;
}

