import * as grpc from '@grpc/grpc-js';
import * as emptyGrpc from '../generated/common/empty';
import * as orchestrationGrpc from '../generated/orchestration';
import logger from '@shared/logger';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';
import * as healthGrpc from "../generated/common/health";
import {Header} from "../generated/orchestration";

const orchestrationManager = new GrpcClientManager<orchestrationGrpc.OrchestrationClient>(() => {
    return new orchestrationGrpc.OrchestrationClient(config.serviceOrchestrationUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<healthGrpc.HealthReport | null> => {
    const grpcRequest: emptyGrpc.Empty = {};
    return orchestrationManager.call<healthGrpc.HealthReport>(
        (client, cb) => client.health(grpcRequest, cb)
    ).catch((err) => {
        logger.error("Health check failed:", err);
        return null;
    });
};

export const status = (): Promise<healthGrpc.StatusInfo | null> => {
    const grpcRequest: emptyGrpc.Empty = {};
    return orchestrationManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<healthGrpc.LiveStatus | null> => {
    const grpcRequest: emptyGrpc.Empty = {};
    return orchestrationManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<healthGrpc.ReadyStatus | null> => {
    const grpcRequest: emptyGrpc.Empty = {};
    return orchestrationManager.call((client, cb) => client.readyz(grpcRequest, cb));
};

export const route = async (
    method: string,
    path: string,
    headers: Header[],
    queryParams: Header[],
    body: Uint8Array
): Promise<orchestrationGrpc.RouteResponse | null> => {
    const grpcRequest: orchestrationGrpc.RouteRequest = {method, path, body, headers, queryParams};

    logger.log(grpcRequest);

    return orchestrationManager.call((client, cb) =>
        client.route(grpcRequest, cb),
    );
};




