import * as profileClient from "../grpc/clients/profile.client";
import * as orchestrationClient from "../grpc/clients/orchestration.client";
import logger from "@shared/logger";

export const health = async () =>
  await profileClient.check();

export const status = async () =>
  await profileClient.status();

export const livez = async () =>
  await profileClient.livez();

export const readyz = async () =>
  await profileClient.readyz();

