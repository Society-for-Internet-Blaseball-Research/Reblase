import { GameUpdate } from "./update";
import { Game } from "./game";
import useSWR, { useSWRInfinite } from "swr";
import { useEffect, useState } from "react";
import queryString from "query-string";

export const BASE_URL = process.env.REACT_APP_SIBR_API ?? "/";

export interface EventsResponse {
    games: Game[];
}

export interface GamesListQuery {
    season?: number;
    day?: number;
    started?: boolean;
    finished?: boolean;
    outcomes?: boolean;
    order?: "asc" | "desc";
}

export function useGameList(query: GamesListQuery): { games: Game[] | undefined; error: any } {
    const { data, error } = useSWR<Game[]>(BASE_URL + `/games?${queryString.stringify(query)}`, {
        revalidateOnFocus: false,
    });

    return {
        games: data,
        error,
    };
}

interface GameUpdatesHookReturn {
    updates: GameUpdate[];
    error: any;
    isLoading: boolean;
}

interface GameUpdatesQuery {
    game: string;
    started: boolean;
    after?: string;
    count?: number;
}

export function useGameUpdates(query: GameUpdatesQuery, autoRefresh: boolean): GameUpdatesHookReturn {
    // First load of original data
    query.count = 1000; // should be enough, right? :)
    const { data: initialData, error } = useSWR<GameUpdate[]>(
        BASE_URL + `/games/updates?${queryString.stringify(query)}`,
        {
            revalidateOnFocus: false,
        }
    );

    // Updates added via autoupdating
    const [extraUpdates, setExtraUpdates] = useState<GameUpdate[]>([]);

    // Combined the above!
    const allUpdates = [...(initialData ?? []), ...extraUpdates];

    // Background timer for autoupdating
    useEffect(() => {
        const timer = setInterval(async () => {
            // Stop if autorefresh is off
            // (effect closure will get remade on change so this "updates" properly)
            if (!autoRefresh || allUpdates.length === 0) return;

            // Handle autorefresh logic
            const lastUpdate = allUpdates[allUpdates.length - 1];
            const lastTimestamp = lastUpdate.timestamp;

            query.after = lastTimestamp;
            const url = BASE_URL + `/games/updates?${queryString.stringify(query)}`;
            const response = await fetch(url);
            const json = (await response.json()) as GameUpdate[];

            // Add the data we got to the extra state :)
            setExtraUpdates([...extraUpdates, ...json]);
        }, 2000);
        return () => clearInterval(timer);
    }, [query, autoRefresh, allUpdates, extraUpdates]);

    return {
        updates: allUpdates,
        isLoading: !initialData,
        error,
    };
}

interface GameEventsHookReturn {
    games: Game[];
    error: any;
    isLoading: boolean;
    nextPage: () => void;
    hasMoreData: boolean;
}

export function useGameEvents(): GameEventsHookReturn {
    function getNextPage(pageIndex: number, previousPageData: EventsResponse | null) {
        if (previousPageData == null) return BASE_URL + "/api/events";
        if (previousPageData?.games.length === 0) return null;

        const games = previousPageData?.games ?? [];
        const lastGameTimestamp = games[games?.length - 1].end;

        return BASE_URL + `/api/events?before=${encodeURIComponent(lastGameTimestamp ?? "null")}`;
    }

    const { data, error, size, setSize } = useSWRInfinite<EventsResponse>(getNextPage, { revalidateOnFocus: false });

    const games = data && data.map((page) => page.games).flat();
    return {
        games: games ?? [],
        error,
        isLoading: !data,
        nextPage: () => setSize(size + 1),
        hasMoreData: data ? data[data.length - 1].games.length > 0 : true,
    };
}
