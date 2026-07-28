import config from "../../infrastructure/app/config";
import {ServiceStatus} from "../../infrastructure/grpc/generated/common/health";
import {LivezUseCase} from "./livez";

const startedAt = Date.now();

export class StatusUseCase {
    async execute(): Promise<ServiceStatus> {
        const uptimeMs = Date.now() - startedAt;

        return {
            name: config.appName,
            version: config.appVersion,
            env: config.appEnv,
            uptime: {
                seconds: Math.floor(uptimeMs / 1000),
                nanos: (uptimeMs % 1000) * 1_000_000,
            },
            timestamp: new Date(),
        };

    }
}

const statusUseCase = new StatusUseCase();

export default statusUseCase;
