import * as grpc from "@grpc/grpc-js";

import * as emptyGrpc from "../generated/common/empty";
import * as healthGrpc from "../generated/common/health";

import servicesConfig from "../../config/services.config";

import { GrpcClientManager } from "@shared/grpc-client-manager";
import logger from "@shared/logger";

export class HealthAgregator {
    private readonly empty: emptyGrpc.Empty = {};

    private readonly managers: Record<
        string,
        GrpcClientManager<healthGrpc.HealthClient>
    >;

    constructor() {
        this.managers = Object.fromEntries(
            Object.entries(servicesConfig).map(([serviceName, service]) => [
                serviceName,
                new GrpcClientManager<healthGrpc.HealthClient>(
                    () =>
                        new healthGrpc.HealthClient(
                            service.url,
                            grpc.credentials.createInsecure(),
                        ),
                ),
            ]),
        );
    }

    async check(
        serviceName: string,
    ): Promise<healthGrpc.HealthReport | null> {
        const manager = this.managers[serviceName];

        if (!manager) {
            throw new Error(
                `Unknown service '${serviceName}'`,
            );
        }

        try {
            return await manager.call(
                (client, callback) =>
                    client.check(this.empty, callback),
            );
        } catch (err) {
            logger.error(
                "Service health check failed",
                {
                    serviceName,
                    err,
                },
            );

            return null;
        }
    }

    async checkAll(): Promise<
        Record<string, healthGrpc.HealthReport | null>
    > {
        const reports = await Promise.all(
            Object.keys(this.managers).map(
                async (serviceName) =>
                    [
                        serviceName,
                        await this.check(serviceName),
                    ] as const,
            ),
        );

        return Object.fromEntries(reports);
    }
}

const healthAgregator = new HealthAgregator();

export default healthAgregator;