import * as orchestrationClient from "../grpc/clients/orchestration.client";

export const route = async (req) =>
    await orchestrationClient.route(req)
