import wrapper from "./wrapper";
import * as orchestrationService from "../../orchestration/orchestration.service";

export const proxy = wrapper(async (req, res) => {
    const response = await orchestrationService.route(req);
    if (response) {
        if (req.header("x-debug-json") === "true") {
            res.status(response.statusCode).json(
                JSON.parse(Buffer.from(response.body).toString("utf8"))
            );
        } else {
            res
                .status(response.statusCode)
                .set("Content-Type", "application/x-protobuf")
                .send(Buffer.from(response.body));
        }
    } else {
        res.status(500).json({error: "No response from orchestration"});
    }
});

