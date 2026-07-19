import * as grpc from "@grpc/grpc-js";
import * as healthGrpc from "../generated/common/health";
import * as emptyGrpc from "../generated/common/empty";

import config from "../../config/config";
import {GrpcClientManager} from "@shared/grpc-client-manager";
import servicesConfig from "../../config/services.config";

type HealthManager = GrpcClientManager<any>;

const managers = Object.fromEntries(

    Object.entries(servicesConfig).map(([name, url]) => [

      name,

      new GrpcClientManager(( ) =>

          new healthGrpc.HealthClient(
              url,
              grpc.credentials.createInsecure(),
          ),

      ),

    ]),

) satisfies Record<string, HealthManager>;

export async function health(service: string) {
  return managers[service].call((client, cb) =>
      client.health({} as emptyGrpc.Empty, cb),
  );
}

export async function healthAll() {

  const entries = await Promise.all(

      Object.entries(managers).map(async ([name, manager]) => {

        const report = await manager.call((client, cb) =>
            client.health({}, cb),
        );

        return [name, report] as const;

      }),

  );

  return Object.fromEntries(entries);
}