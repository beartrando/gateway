import * as grpc from '@grpc/grpc-js';
import * as healthProto from '../../../contracts/proto/common/health';
import * as emptyProto from '../../../contracts/proto/common/empty';
import callbackError from './callback.error';
import logger from "@shared/logger";
import healthUseCase from "../../../use-cases/health/health";
import statusUseCase from "../../../use-cases/health/status";
import livezUseCase from "../../../use-cases/health/livez";
import readyzUseCase from "../../../use-cases/health/readyz";

export const check = async (
    call: grpc.ServerUnaryCall<emptyProto.Empty, healthProto.HealthReport>,
    callback: grpc.sendUnaryData<healthProto.HealthReport>
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
    call: grpc.ServerUnaryCall<emptyProto.Empty, healthProto.ServiceStatus>,
    callback: grpc.sendUnaryData<healthProto.ServiceStatus>
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
    call: grpc.ServerUnaryCall<emptyProto.Empty, healthProto.LiveStatus>,
    callback: grpc.sendUnaryData<healthProto.LiveStatus>
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
    call: grpc.ServerUnaryCall<emptyProto.Empty, healthProto.ReadyStatus>,
    callback: grpc.sendUnaryData<healthProto.ReadyStatus>
) => {
    try {
        const response = await readyzUseCase.execute();

        callback(null, response);

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};
