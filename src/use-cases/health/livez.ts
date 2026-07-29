import {LiveStatus} from "../../contracts/proto/common/health";

export class LivezUseCase {
    async execute(): Promise<LiveStatus> {
        return {
            live: true,
        };
    }
}


const livezUseCase = new LivezUseCase();

export default livezUseCase;

