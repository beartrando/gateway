import * as grpc from '@grpc/grpc-js';
import * as orchestrationGrpc from '../generated/orchestration';
import logger from '@shared/logger';
import {GrpcClientManager} from '@shared/grpc-client-manager';
import servicesConfig from "../../config/servicesConfig";

const orchestrationManager = new GrpcClientManager<orchestrationGrpc.OrchestrationClient>(() => {
    return new orchestrationGrpc.OrchestrationClient(servicesConfig.orchestration.url, grpc.credentials.createInsecure());
});

export const proxy = async (grpcRequest: orchestrationGrpc.ProxyRequest): Promise<orchestrationGrpc.ProxyResponse | null> => {
    // logger.log(grpcRequest);

    return orchestrationManager.call((client, cb) =>
        client.proxy(grpcRequest, cb),
    );
};




