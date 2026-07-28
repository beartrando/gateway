import * as grpc from '@grpc/grpc-js';
import * as healthGrpc from '../generated/common/health';
import * as emptyGrpc from '../generated/common/empty';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import healthUseCase from "../../../use-cases/health/health";
import statusUseCase from "../../../use-cases/health/status";
import livezUseCase from "../../../use-cases/health/livez";
import readyzUseCase from "../../../use-cases/health/readyz";

export const check = async (
    call: grpc.ServerUnaryCall<emptyGrpc.Empty, healthGrpc.HealthReport>,
    callback: grpc.sendUnaryData<healthGrpc.HealthReport>
) => {
    try {
        const response = await healthUseCase.execute();

        callback(null, response);


    } catch (err) {
        logger.log(err);
        callbackError(callback, err);
    }
};

export const status = async (
    call: grpc.ServerUnaryCall<emptyGrpc.Empty, healthGrpc.ServiceStatus>,
    callback: grpc.sendUnaryData<healthGrpc.ServiceStatus>
) => {
    try {
        const response = await statusUseCase.execute();

        callback(null, response);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};

export const livez = async (
    call: grpc.ServerUnaryCall<emptyGrpc.Empty, healthGrpc.LiveStatus>,
    callback: grpc.sendUnaryData<healthGrpc.LiveStatus>
) => {
    try {
        const response = await livezUseCase.execute();

        callback(null, response);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};

export const readyz = async (
    call: grpc.ServerUnaryCall<emptyGrpc.Empty, healthGrpc.ReadyStatus>,
    callback: grpc.sendUnaryData<healthGrpc.ReadyStatus>
) => {
    try {
        const response = await readyzUseCase.execute();

        callback(null, response);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};
