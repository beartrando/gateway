import wrapper from "./wrapper";
import logger from "@shared/logger";
import * as orchestrationService from "../../services/orchestration.service";

export const proxy = wrapper(async (req, res) => {
  const response = await orchestrationService.route(req);

  if (response) {
    res.status(response.status).json(response.body);
  } else {
    res.status(500).json({ error: "No response from orchestration" });
  }
});

