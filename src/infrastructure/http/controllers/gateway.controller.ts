import wrapper from "./wrapper";
import logger from "@shared/logger";
import fullHealthUseCase from "../../../use-cases/health/full-health";
import livezUseCase from "../../../use-cases/health/livez";
import readyzUseCase from "../../../use-cases/health/readyz";
import healthUseCase from "../../../use-cases/health/health";
import statusUseCase from "../../../use-cases/health/status";

export const health = wrapper(async (req, res) => {
    if (req.query.full) {
        return await fullHealthUseCase.execute();
    } else {
        return await healthUseCase.execute();
    }
});

export const fullHealth = wrapper(async (req, res) => {
    return await fullHealthUseCase.execute();
});

export const status = wrapper(async (req, res) => {
    return await statusUseCase.execute();
});

export const livez = wrapper(async (req, res) => {
    return await livezUseCase.execute();
});

export const readyz = wrapper(async (req, res) => {
    return await readyzUseCase.execute();
});
