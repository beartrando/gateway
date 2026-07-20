import wrapper from "./wrapper";
import * as orchestrationService from "../../services/orchestration.service";
import logger from "@shared/logger";

export const proxy = wrapper(async (req, res) => {
    const response = await orchestrationService.route(req);


    if (response) {

        // if (response.body) {
        //     logger.log(JSON.parse(Buffer.from(response.body).toString("utf8")));
        // }

        if (req.header("X-Debug-Json") === "true") {
            // logger.log('here');
            res.status(response.status).json(
                JSON.parse(Buffer.from(response.body).toString("utf8"))
            );
        } else {
            // logger.log('or here');

            res.status(response.status).send(response.body);
            // logger.log(response.body);

        }
    } else {
        res.status(500).json({error: "No response from orchestration"});
    }
});

