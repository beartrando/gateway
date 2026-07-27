import * as grpc from "@grpc/grpc-js";

import * as orchestrationGrpc from "../generated/orchestration";

import { GrpcClientManager } from "@shared/grpc-client-manager";

import servicesConfig from "../../config/services.config";

export class OrchestrationClient {
    private readonly manager: GrpcClientManager<orchestrationGrpc.OrchestrationClient>;

    constructor(
        private readonly url: string,
    ) {
        this.manager = new GrpcClientManager(
            () =>
                new orchestrationGrpc.OrchestrationClient(
                    this.url,
                    grpc.credentials.createInsecure(),
                ),
        );
    }

    async proxy(
        request: orchestrationGrpc.ProxyRequest,
    ): Promise<orchestrationGrpc.ProxyResponse | null> {
        return this.manager.call(
            (client, callback) =>
                client.proxy(request, callback),
        );
    }
}

const orchestrationClient = new OrchestrationClient(servicesConfig.orchestration.url);

export default orchestrationClient;
