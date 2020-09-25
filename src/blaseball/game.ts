import {GamePayload} from "./update";

export interface Game {
    id: string;
    start: string | null;
    end: string | null;
    lastUpdate: GamePayload;
    lastUpdateTime: string;
}

export interface Day {
    season: number;
    day: number;
    start: string | null;
    games: Game[];
}
