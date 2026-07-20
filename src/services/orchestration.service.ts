import * as orchestrationClient from "../grpc/clients/orchestration.client";
import {Request} from 'express';
import * as orchestrationGrpc from "../grpc/generated/orchestration";

export const route = async function (req: Request) {
    const method = req.method;
    const path = req.path;
    const body = req.body ? Buffer.from(JSON.stringify(req.body)) : Buffer.alloc(0);
    const headers = Object.entries(req.headers).flatMap(([key, value]) => {
        if (Array.isArray(value)) {
            return value.map((v) => ({key, value: String(v)}));
        }

        if (value === undefined) {
            return [];
        }

        return [{key, value: String(value)}];
    });

    const queryParams = Object.entries(req.query as Record<string, any>).flatMap(([key, value]) => {
        if (Array.isArray(value)) {
            return value.map((v) => ({key, value: String(v)}));
        }
        if (value === undefined) {
            return [];
        }
        return [{key, value: String(value)}];
    });

    const grpcRequest: orchestrationGrpc.ProxyRequest = {method, path, body, headers, queryParams};

    return await orchestrationClient.proxy(grpcRequest);
}

