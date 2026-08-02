import * as grpc from "@grpc/grpc-js";

import * as emptyProto from "../../../contracts/proto/common/empty";
import * as healthProto from "../../../contracts/proto/common/health";

import servicesConfig from "../config/microservices.config";

import {GrpcClientManager} from "@shared/grpc-client-manager";
import logger from "@shared/logger";

export class HealthAggregator {
    private readonly empty: emptyProto.Empty = {};

    private readonly managers: Record<
        string,
        GrpcClientManager<healthProto.HealthClient>
    >;

    constructor() {
        this.managers = Object.fromEntries(
            Object.entries(servicesConfig).map(([serviceName, service]) => [
                serviceName,
                new GrpcClientManager<healthProto.HealthClient>(
                    () =>
                        new healthProto.HealthClient(
                            service.url,
                            grpc.credentials.createInsecure(),
                        ),
                ),
            ]),
        );
    }

    async check(
        serviceName: string,
    ): Promise<healthProto.HealthReport | null> {
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
        Record<string, healthProto.HealthReport | null>
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

export default HealthAggregator;
