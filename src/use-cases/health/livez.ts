import {LiveStatus} from "../../infrastructure/grpc/generated/common/health";

export class LivezUseCase {
    async execute(): Promise<LiveStatus> {
        return {
            live: true,
        };
    }
}


const livezUseCase = new LivezUseCase();

export default livezUseCase;

