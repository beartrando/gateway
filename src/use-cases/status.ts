import config from "../config/config";
import {ServiceStatus} from "../grpc/generated/common/health";
import {LivezUseCase} from "./livez";

export class StatusUseCase {
    async execute(): Promise<ServiceStatus> {

        const startedAt = Date.now();
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
