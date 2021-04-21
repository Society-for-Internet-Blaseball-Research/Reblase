import queryString from "query-string";
import { CauldronGameEvent, CauldronBaseRunner, CauldronOutcome } from "./models";

export const BASE_URL = process.env.REACT_APP_CAULDRON_API ?? "/";

export const cauldronApi = {
    gameEvents: (query: CauldronEventsQuery) => BASE_URL + "/events?" + queryString.stringify(query),
};

export type CauldronEventsQuery = {
    gameId: string;
    outcomes: boolean;
    baseRunners: boolean;
};

export interface CauldronResponse<T> {
    count: number;
    results: T[];
}

export interface CauldronEventsResponse extends CauldronResponse<CauldronGameEvent> {}
