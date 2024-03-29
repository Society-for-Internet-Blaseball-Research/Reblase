import queryString from "query-string";
import { GameID, SeasonID } from "./common";
import {
    BlaseballFight,
    BlaseballGame,
    BlaseballPlayer,
    BlaseballSimData,
    BlaseballStadium,
    BlaseballSunSunPressure,
    BlaseballTeam,
    BlaseballTemporal,
    BlaseballFeedSeasonList,
    BlaseballGameBatchChangedState,
} from "./models";

export const BASE_URL = process.env.REACT_APP_SIBR_API ?? "/";

export const chroniclerApi = {
    gameList: (query: GameListQuery) => BASE_URL + "v1/games?" + queryString.stringify(query),
    gameUpdates: (query: GameUpdatesQuery) => BASE_URL + "v1/games/updates?" + queryString.stringify(query),
    fights: () => BASE_URL + "v2/entities?type=Bossfight",
    fightUpdates: (query: FightUpdatesQuery) => BASE_URL + "v2/versions?type=Bossfight&" + queryString.stringify(query),
    players: () => BASE_URL + "v2/entities?type=Player",
    playerUpdates: (query: PlayerUpdatesQuery) => BASE_URL + "v2/versions?type=Player&" + queryString.stringify(query),
    teams: () => BASE_URL + "v2/entities?type=Team",
    temporalUpdates: (query: TemporalUpdatesQuery) => BASE_URL + "v2/versions?type=Temporal&" + queryString.stringify(query),
    simUpdates: () => BASE_URL + "v2/entities?type=Sim",
    stadiums: () => BASE_URL + "v2/entities?type=Stadium",
    sunSunPressure: (query: SunSunPressureQuery) => BASE_URL + "v2/versions?type=SunSun&" + queryString.stringify(query),
    feedSeasonList: () => BASE_URL + "v2/entities?type=FeedSeasonList",
};

export const BASE_EXPERIMENTAL_URL = process.env.REACT_APP_SIBR_API_NEW ?? "/";

export const chroniclerExperimentalApi = {
    gameUpdates: (query: GameUpdatesQueryExperimental) => BASE_EXPERIMENTAL_URL + "v0/game-events?" + queryString.stringify(query),
    notableGameEvents: (search: string, query: GameUpdatesQueryExperimental) => BASE_EXPERIMENTAL_URL + "v0/game-events?search=" + search + queryString.stringify(query),
    gameList: (query: GameListQueryExperimental) => BASE_EXPERIMENTAL_URL + "v0/entities?kind=game&" + queryString.stringify(query),
    sim: (query: QueryExperimental) => BASE_EXPERIMENTAL_URL + "v0/entities?kind=sim&" + queryString.stringify(query),
};

export type PlayerUpdatesQuery = {
    player?: string;
    order?: "asc" | "desc";
    count?: number;
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
    sim?: string;
};

export type GameUpdatesQueryExperimental = {
    order?: "asc" | "desc";
    after?: Timestamp;
    before?: Timestamp;
    count?: number;
    game_id?: GameID;
}

export type GameListQueryExperimental = {
    order?: "asc" | "desc";
    season?: SeasonID;
    id?: GameID;
    count?: number;
}

export type QueryExperimental = {
    order?: "asc" | "desc";
    count?: number;
}

export type GameUpdatesQuery = {
    game: string;
    started: boolean;
    after?: Timestamp;
    count?: number;
};

export type FightUpdatesQuery = {
    id: string;
    after?: Timestamp;
    count?: number;
    page?: string;
};

export type TemporalUpdatesQuery = {
    order?: "asc" | "desc";
    count?: number;
    after?: Timestamp;
    before?: Timestamp;
    page?: string;
};

export type SunSunPressureQuery = {
    order?: "asc" | "desc";
    count?: number;
    after?: Timestamp;
}

export interface ChronV2Response<T> {
    items: T[];
}

export interface ChronV1Response<T> {
    data: T[];
}

export interface PagedResponse {
    nextPage: string | null;
}

export interface GameListResponse extends ChronV1Response<ChronGame> {}
export interface GameUpdatesResponse extends ChronV1Response<ChronGameUpdate>, PagedResponse {}
export interface FightUpdatesResponse extends ChronV2Response<ChronFightUpdate>, PagedResponse {}
export interface FightsResponse extends ChronV2Response<ChronFight> {}
export interface PlayersResponse extends ChronV2Response<ChronPlayer> {}
export interface TeamsResponse extends ChronV2Response<ChronTeam> {}
export interface TemporalResponse extends ChronV2Response<ChronTemporalUpdate>, PagedResponse {}
export interface SimResponse extends ChronV2Response<ChronSimUpdate> {}
export interface SunSunPressureResponse extends ChronV2Response<ChronSunSunPressure>, PagedResponse {}
export interface FeedSeasonListResponse extends ChronV2Response<ChronFeedSeasonList> {}

export type Timestamp = string;

export interface ChronGame {
    gameId: string;
    startTime: Timestamp | null;
    endTime: Timestamp | null;
    data: BlaseballGame;
}

export interface ChronExperimental<T> {
    items: ChronEntityVersionExperimental<T>[];
}

export interface ChronGameEventsExperimental {
    items: ChronGameEventExperimental[];
}

export interface ChronGameEventExperimental {
    game_id: GameID;
    timestamp: Timestamp;
    data: BlaseballGameBatchChangedState;
}

export interface ChronEntityVersionExperimental<T>{
    kind: "game" | "team" | "player" | "sim";
    entity_id: "string";
    valid_from: Timestamp;
    data: T;
}

export interface HashedUpdate {
    hash: string;
}

export interface ChronGameUpdate extends HashedUpdate {
    gameId: string;
    timestamp: Timestamp;
    data: BlaseballGame;
}

export interface ChronEntityVersion<T> {
    nextPage: string;
    entityId: string;
    validFrom: Timestamp;
    validTo: Timestamp;
    data: T;
}

export interface ChronFight extends ChronEntityVersion<BlaseballFight>, HashedUpdate {}
export interface ChronFightUpdate extends ChronEntityVersion<BlaseballFight>, HashedUpdate {}
export interface ChronPlayer extends ChronEntityVersion<BlaseballPlayer> {}
export interface ChronPlayerUpdate extends ChronEntityVersion<BlaseballPlayer> {}
export interface ChronTeam extends ChronEntityVersion<BlaseballTeam>{}
export interface ChronTeamUpdate extends ChronEntityVersion<BlaseballTeam> {}
export interface ChronTemporalUpdate extends ChronEntityVersion<BlaseballTemporal>, HashedUpdate {}
export interface ChronSimUpdate extends ChronEntityVersion<BlaseballSimData> {}
export interface ChronStadium extends ChronEntityVersion<BlaseballStadium> {}
export interface ChronSunSunPressure extends ChronEntityVersion<BlaseballSunSunPressure>, HashedUpdate {}
export interface ChronFeedSeasonList extends ChronEntityVersion<BlaseballFeedSeasonList> {}