import {Request} from 'express';
import * as orchestrationProto from "../../contracts/proto/orchestration";
import logger from "@shared/logger";
import OrchestrationClient from "../grpc/clients/orchestration.client";

export class OrchestrationService {

    constructor(private readonly orchestrationClient: OrchestrationClient) {
    }

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

        const request: orchestrationProto.ProxyRequest = {method, path, body, headers, queryParams};

        const resp = await this.orchestrationClient.proxy(request);

        logger.log(resp);

        if (resp) {
            logger.log(
                JSON.parse(Buffer.from(resp.body).toString("utf8"))
            );
        }

        return resp;
    }
}

export default OrchestrationService;
