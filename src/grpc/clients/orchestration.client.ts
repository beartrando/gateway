import * as grpc from '@grpc/grpc-js';
import * as orchestrationGrpc from '../generated/orchestration';
import logger from '@shared/logger';
import {GrpcClientManager} from '@shared/grpc-client-manager';
import {Header} from "../generated/orchestration";
import servicesConfig from "../../config/services.config";

const orchestrationManager = new GrpcClientManager<orchestrationGrpc.OrchestrationClient>(() => {
    return new orchestrationGrpc.OrchestrationClient(servicesConfig.orchestrationUrl, grpc.credentials.createInsecure());
});

export const proxy = async (
    method: string,
    path: string,
    headers: Header[],
    queryParams: Header[],
    body: Uint8Array
): Promise<orchestrationGrpc.ProxyResponse | null> => {
    const grpcRequest: orchestrationGrpc.ProxyRequest = {method, path, body, headers, queryParams};

    // logger.log(grpcRequest);

    return orchestrationManager.call((client, cb) =>
        client.proxy(grpcRequest, cb),
    );
};




