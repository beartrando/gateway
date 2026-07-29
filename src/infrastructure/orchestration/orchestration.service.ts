import {Request} from 'express';
import * as orchestrationProto from "../../contracts/proto/orchestration";
import logger from "@shared/logger";
import orchestrationClient from "../grpc/clients/orchestration.client";

export class OrchestrationService {
    async route(req: Request) {
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

        logger.log(headers);
        const grpcRequest: orchestrationProto.ProxyRequest = {method, path, body, headers, queryParams};

        return await orchestrationClient.proxy(grpcRequest);
    }
}

export default OrchestrationService;
