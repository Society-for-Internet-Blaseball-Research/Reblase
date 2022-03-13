import queryString from "query-string";

export const BASE_URL = process.env.REACT_APP_FEED_API;
export const EARLIEST_FEED_CONSIDERATION_DATE = "2021-07-30T16:00:00Z";

export const eventuallyApi = {
    temporalUpdates: (query: EventuallyTemporalUpdatesQuery) =>
        BASE_URL + "?category=4&" + queryString.stringify(query),
};

export type EventuallyTemporalUpdatesQuery = {
    order?: "asc" | "desc";
    count?: number;
    after?: string | number;
};
