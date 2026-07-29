import wrapper from "./wrapper";
import OrchestrationService from "../../orchestration/orchestration.service";

export class ProxyController {

    constructor(
        private readonly orchestrationService: OrchestrationService,
    ) {
    }

    proxy = wrapper(async (req, res) => {
        const response = await this.orchestrationService.route(req);
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

}

export default ProxyController;
