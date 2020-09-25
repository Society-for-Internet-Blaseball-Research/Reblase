import { GamePayload } from "./update";

export interface Game {
    id: string;
    start: string | null;
    end: string | null;
    data: GamePayload;
}
