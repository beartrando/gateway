import grpc from '@grpc/grpc-js';
import * as gatewayProto from 'contracts/proto/gateway';
import * as emptyProto from 'contracts/proto/common/empty';
import config from "./infrastructure/app/config";

const client = new gatewayProto.GatewayClient(
    '127.0.0.1:' + config.grpcPort,
    grpc.credentials.createInsecure()
);

client.check(new emptyProto.Empty(), (err, response) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }

    process.exit(0);
});