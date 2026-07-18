import wrapper from "./wrapper";
import logger from "@shared/logger";
import * as orchestrationService from "../../services/orchestration.service";

// Middleware-функции для роутов
export const proxy = wrapper(async (req, res) => {
  const response = await orchestrationService.route(req);

  res.status(response.status).json(response.body);
});

