import * as authClient from '../grpc/clients/auth.client';
import {AnonymousSignInRequest, RefreshTokensRequest} from '../grpc/generated/auth';
import * as orchestrationClient from "../grpc/clients/orchestration.client";

export const health = async () =>
  await authClient.health();

export const status = async () =>
  await authClient.status();

export const livez = async () =>
  await authClient.livez();

export const readyz = async () =>
  await authClient.readyz();



