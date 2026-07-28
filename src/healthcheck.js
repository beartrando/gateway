import grpc from '@grpc/grpc-js';
import * as gatewayGrpc from 'infrastructure/grpc/generated/gateway';
import * as emptyGrpc from 'infrastructure/grpc/generated/common/empty';
import config from "./infrastructure/app/config";

const client = new gatewayGrpc.GatewayClient(
    '127.0.0.1:' + config.grpcPort,
    grpc.credentials.createInsecure()
);

client.check(new emptyGrpc.Empty(), (err, response) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }

    process.exit(0);
});