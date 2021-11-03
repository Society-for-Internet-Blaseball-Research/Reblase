import useSWR, { useSWRInfinite } from "swr";
import { useEffect, useMemo, useState } from "react";
import {
    ChronGame,
    ChronGameUpdate,
    ChronPlayer,
    ChronV1Response,
    ChronV2Response,
    ChronTeam,
    ChronTemporalUpdate,
    GameListQuery,
    GameListResponse,
    GameUpdatesQuery,
    GameUpdatesResponse,
    chroniclerApi,
    ChronPlayerUpdate,
    PlayerUpdatesQuery,
    FightUpdatesQuery,
    FightUpdatesResponse,
    ChronFightUpdate,
    FightsResponse,
    ChronFight,
    SimResponse,
    TemporalResponse,
    TemporalUpdatesQuery,
    ChronStadium,
    SunSunPressureQuery,
    SunSunPressureResponse,
    ChronSunSunPressure,
} from "blaseball-lib/chronicler";
import { BlaseballSimData, BlaseballStadium } from "blaseball-lib/models";

interface GameListHookReturn {
    games: ChronGame[];
    error: any;
    isLoading: boolean;
}

export function useGameList(query: GameListQuery): GameListHookReturn {
    const { data, error } = useSWR<GameListResponse>(chroniclerApi.gameList(query));

    return {
        games: data?.data ?? [],
        error,
        isLoading: !data,
    };
}

interface GameUpdatesHookReturn {
    updates: ChronGameUpdate[];
    error: any;
    isLoading: boolean;
}

export function useGameUpdates(query: GameUpdatesQuery, autoRefresh: boolean): GameUpdatesHookReturn {
    // First load of original data
    query.count = 2000; // should be enough, right? (future message from season 23: [narrator voice] it wasn't.)
    const { data: initialData, error } = useSWR<GameUpdatesResponse>(chroniclerApi.gameUpdates(query));

    // Updates added via autoupdating
    const [extraUpdates, setExtraUpdates] = useState<ChronGameUpdate[]>([]);

    // Combined the above!
    const allUpdates = [...(initialData?.data ?? []), ...extraUpdates];

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
            const response = await fetch(chroniclerApi.gameUpdates(query));
            const json = (await response.json()) as ChronV1Response<ChronGameUpdate>;

            // Add the data we got to the extra state :)
            setExtraUpdates([...extraUpdates, ...json.data]);
        }, 2000);
        return () => clearInterval(timer);
    }, [query, autoRefresh, allUpdates, extraUpdates]);

    return {
        updates: allUpdates,
        isLoading: !initialData,
        error,
    };
}

interface FightUpdatesHookReturn {
    updates: ChronFightUpdate[];
    error: any;
    isLoading: boolean;
}

export function useFightUpdates(query: FightUpdatesQuery): FightUpdatesHookReturn {
    const { data, error } = useSWRInfinite<FightUpdatesResponse>(
        (_, previous) => {
            query = {...query, count: 1000};

            // First page
            if (!previous) return chroniclerApi.fightUpdates(query);

            // Reached end
            if (!previous.nextPage) return null;

            // Next page
            return chroniclerApi.fightUpdates({ ...query, page: previous.nextPage });
        },
        // todo: better way to do this?
        { initialSize: 999 }
    );

    const allUpdates = [];
    if (data) {
        for (const page of data) {
            allUpdates.push(...page.items);
        }
    }

    return {
        updates: allUpdates,
        error,
        isLoading: !data && !error,
    };
}

interface PlayerTeamsHookReturn {
    players: ChronPlayer[];
    teams: ChronTeam[];
    teamsObj: Partial<Record<string, ChronTeam>>;
    error?: any;
    isLoading: boolean;
}

export function usePlayerTeamsList(): PlayerTeamsHookReturn {
    const { data: players, error: playersError } = useSWR<ChronV2Response<ChronPlayer>>(chroniclerApi.players());
    const { data: teams, error: teamsError } = useSWR<ChronV2Response<ChronTeam>>(chroniclerApi.teams());

    const teamsObj = useMemo(() => {
        const teamsObj: Record<string, ChronTeam> = {};
        if (teams) {
            for (const team of teams.items) teamsObj[team.entityId] = team;
        }

        return teamsObj;
    }, [teams]);

    return {
        players: players?.items ?? [],
        teams: teams?.items ?? [],
        teamsObj,
        error: playersError || teamsError,
        isLoading: (!players || !teams) && !(playersError || teamsError),
    };
}

interface TemporalHookReturn {
    updates: ChronTemporalUpdate[];
    error: any;
    isLoading: boolean;
}

export function useTemporal(): TemporalHookReturn {
    const { data, error } = useSWRInfinite<TemporalResponse>(
        (_, previous) => {
            const query: TemporalUpdatesQuery = { count: 250, order: "desc" };

            // First page
            if (!previous) return chroniclerApi.temporalUpdates(query);

            // Reached end
            if (!previous.nextPage) return null;

            // Next page
            return chroniclerApi.temporalUpdates({ ...query, page: previous.nextPage });
        },
        // todo: better way to do this?
        { initialSize: 999 }
    );

    const allUpdates = [];
    if (data) {
        for (const page of data) {
            allUpdates.push(...page.items);
        }
    }

    return {
        updates: allUpdates,
        error,
        isLoading: !data && !error,
    };
}

interface SimDataHookReturn {
    data: BlaseballSimData | null;
    error: any;
    isLoading: boolean;
}

export function useSimulation(): SimDataHookReturn {
    const { data, error } = useSWR<SimResponse>(chroniclerApi.simUpdates({ order: "desc", count: 1 }));

    return {
        data: data?.items[0]?.data ?? null,
        error,
        isLoading: !data && !error,
    };
}

interface SunSunPressureDataHookReturn {
    data: ChronSunSunPressure[];
    error: any;
    isLoading: boolean;
}

export function useSunSunPressure(query: SunSunPressureQuery): SunSunPressureDataHookReturn {
    const { data, error } = useSWRInfinite<SunSunPressureResponse>(
        (_, previous) => {
            const query: SunSunPressureQuery = { count: 250, order: "desc" };

            // First page
            if (!previous) return chroniclerApi.sunSunPressure(query);

            // Reached end
            if (!previous.nextPage) return null;

            // Next page
            return chroniclerApi.sunSunPressure({ ...query, page: previous.nextPage });
        },
        // todo: better way to do this?
        { initialSize: 999 }
    );

    const allItems = [];
    if (data) {
        for (const page of data) {
            allItems.push(...page.items);
        }
    }

    return {
        data: allItems,
        error,
        isLoading: !data && !error,
    };
}

export interface PlayerUpdatesHookReturn {
    updates: ChronPlayerUpdate[] | undefined;
    error: any;
}

export function usePlayerUpdates(query: PlayerUpdatesQuery): PlayerUpdatesHookReturn {
    const { data, error } = useSWR<ChronV2Response<ChronPlayerUpdate>>(chroniclerApi.playerUpdates(query));
    return { updates: data?.items, error };
}

interface FightsHookReturn {
    fights: ChronFight[];
    error: any;
    isLoading: boolean;
}

export function useFights(): FightsHookReturn {
    const { data, error } = useSWR<FightsResponse>(chroniclerApi.fights());

    return {
        fights: data?.items ?? [],
        isLoading: !data,
        error,
    };
}

interface StadiumHookReturn {
    stadiums: ChronStadium[];
    error: any;
    isLoading: boolean;
}

export function useStadiums(): StadiumHookReturn {
    const { data, error } = useSWR<ChronV2Response<ChronStadium>>(chroniclerApi.stadiums());

    return {
        stadiums: data?.items ?? [],
        error,
        isLoading: !data,
    };
}
