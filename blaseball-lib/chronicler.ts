import queryString from "query-string";
import { BlaseballGame, BlaseballPlayer, BlaseballTeam, BlaseballTemporal } from "./models";

export const BASE_URL = process.env.REACT_APP_SIBR_API ?? "/";

export const chroniclerApi = {
    gameList: (query: GameListQuery) => BASE_URL + "/games?" + queryString.stringify(query),
    gameUpdates: (query: GameUpdatesQuery) => BASE_URL + "/games/updates?" + queryString.stringify(query),
    players: () => BASE_URL + "/players",
    playerUpdates: (query: PlayerUpdatesQuery) => BASE_URL + "/players/updates?" + queryString.stringify(query),
    teams: () => BASE_URL + "/teams",
    temporalUpdates: () => BASE_URL + "/temporal/updates",
};

export type PlayerUpdatesQuery = {
    player?: string;
    order?: "asc" | "desc";
};

export type GameListQuery = {
    season?: number;
    day?: number;
    started?: boolean;
    finished?: boolean;
    outcomes?: boolean;
    order?: "asc" | "desc";
    team?: string;
    weather?: string;
};

export type GameUpdatesQuery = {
    game: string;
    started: boolean;
    after?: string;
    count?: number;
};

export interface ChronResponse<T> {
    data: T[];
}

export interface PagedResponse {
    nextPage: string | null;
}

export interface GameListResponse extends ChronResponse<ChronGame> {}
export interface GameUpdatesResponse extends ChronResponse<ChronGameUpdate>, PagedResponse {}
export interface PlayersResponse extends ChronResponse<ChronPlayer> {}
export interface TeamsResponse extends ChronResponse<ChronTeam> {}
export interface TemporalResponse extends ChronResponse<ChronTemporalUpdate> {}

export type Timestamp = string;
export type PlayerPosition = "lineup" | "rotation" | "bullpen" | "bench";

export interface ChronGame {
    gameId: string;
    startTime: Timestamp | null;
    endTime: Timestamp | null;
    data: BlaseballGame;
}

export interface ChronGameUpdate {
    gameId: string;
    hash: string;
    timestamp: Timestamp;
    data: BlaseballGame;
}

export interface ChronPlayer {
    id: string;
    lastUpdate: string;

    teamId: string | null;
    position: PlayerPosition | null;
    rosterIndex: number | null;

    data: BlaseballPlayer;
}

export interface ChronSiteUpdate {
    timestamp: Timestamp;
    path: string;
    hash: string;
    size: number;
    downloadUrl: string;
}

export interface ChronTeam {
    id: string;
    lastUpdate: Timestamp;
    data: BlaseballTeam;
}

export interface ChronTributeUpdate {
    updateId: string;
    timestamp: Timestamp;
    players: Partial<Record<string, number>>;
}

export interface ChronEntityVersion<T> {
    updateId: string;
    firstSeen: Timestamp;
    lastSeen: Timestamp;
    data: T;
}

export interface ChronTemporalUpdate extends ChronEntityVersion<BlaseballTemporal> {}

export interface ChronPlayerUpdate extends ChronEntityVersion<BlaseballPlayer> {
    playerId: string;
}

export interface ChronTeamUpdate extends ChronEntityVersion<BlaseballTeam> {
    teamId: string;
}
