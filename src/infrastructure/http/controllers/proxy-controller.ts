import wrapper from "./wrapper";
import OrchestrationService from "../../orchestration/service";

export class ProxyController {

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

    constructor(
        private readonly orchestrationService: OrchestrationService,
    ) {
    }

}

export default ProxyController;
