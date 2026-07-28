import {ReadyStatus} from "../../infrastructure/grpc/generated/common/health";
import {LivezUseCase} from "./livez";

export class ReadyzUseCase {
    async execute(): Promise<ReadyStatus> {
        return {ready: true};
    }
}

const readyzUseCase = new ReadyzUseCase();

export default readyzUseCase;
