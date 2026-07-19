import * as grpc from "@grpc/grpc-js";

import * as emptyGrpc from "../generated/common/empty";
import * as healthGrpc from "../generated/common/health";

import config from "../../config/services.config";

import {GrpcClientManager} from "@shared/grpc-client-manager";
import logger from "@shared/logger";

const managers = Object.fromEntries(

    Object.entries(config).map(([serviceName, serviceUrl]) => [

        serviceName,

        new GrpcClientManager<healthGrpc.HealthClient>(() =>

            new healthGrpc.HealthClient(
                serviceUrl,
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

    return manager.call((client, callback) =>
        client.health({} as emptyGrpc.Empty, callback),
    ).catch((err) => {
        logger.error("Service health check failed", {
            service,
            err,
        });
        return null;
    });
}

export async function checkAll(): Promise<Record<string, healthGrpc.HealthReport | null>> {

    const reports = await Promise.all(

        Object.entries(managers).map(async ([serviceName, manager]) => {

            try {

                const report = await manager.call((client, callback) =>
                    client.health({} as emptyGrpc.Empty, callback),
                ).catch((err) => {
                    logger.error("Service health check failed", {
                        serviceName,
                        err,
                    });
                    return null;
                });

                return [serviceName, report] as const;

            } catch {

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

