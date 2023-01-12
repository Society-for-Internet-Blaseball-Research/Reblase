import useSWR, { useSWRInfinite } from "swr";
import { useEffect, useMemo, useState } from "react";
import {
    ChronGame,
    ChronGameUpdate,
    ChronPlayer,
    ChronV1Response,
    ChronV2Response,
    ChronExperimental,
    ChronTeam,
    ChronTemporalUpdate,
    GameListQuery,
    GameListResponse,
    GameUpdatesQuery,
    GameUpdatesResponse,
    chroniclerApi,
    chroniclerExperimentalApi,
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
    SunSunPressureResponse,
    ChronSunSunPressure,
    ChronFeedSeasonList,
} from "blaseball-lib/chronicler";
import {
    eventuallyApi,
    EventuallyTemporalUpdatesQuery,
    EARLIEST_FEED_CONSIDERATION_DATE,
} from "blaseball-lib/eventually";
import { 
    BlaseballFeedEntry, 
    BlaseballFeedTemporalMetadata,
    BlaseballGameExperimental,
    BlaseballSimData,
    BlaseballSimExperimental
} from "blaseball-lib/models";

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

interface GameListExperimentalHookReturn {
    games: BlaseballGameExperimental[];
    error: any;
    isLoading: boolean;
}

export function useGameListExperimental(): GameListExperimentalHookReturn {
    const { data, error } = useSWR<BlaseballGameExperimental[]>((process.env.REACT_APP_SIBR_API_MIRROR ?? "") + "/games");

    return {
        games: data ?? [],
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
            query = { ...query, count: 1000 };

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

interface TeamsHookReturn {
    teams: ChronTeam[];
    teamsObj: Partial<Record<string, ChronTeam>>;
    error?: any;
    isLoading: boolean;
}

export function useTeamsList(): TeamsHookReturn {
    const { data: teams, error: teamsError } = useSWR<ChronV2Response<ChronTeam>>(chroniclerApi.teams());

    const teamsObj = useMemo(() => {
        const teamsObj: Record<string, ChronTeam> = {};
        if (teams) {
            for (const team of teams.items) teamsObj[team.entityId] = team;
        }

        return teamsObj;
    }, [teams]);

    return {
        teams: teams?.items ?? [],
        teamsObj,
        error: teamsError,
        isLoading: !teams && !teamsError,
    };
}

interface TemporalHookReturn {
    updates: ChronTemporalUpdate[];
    error: any;
    isLoading: boolean;
}

export function useAllTemporal(): TemporalHookReturn {
    const { data: chronData, error: chronError } = useSWRInfinite<TemporalResponse>(
        (_, previous) => {
            const query: TemporalUpdatesQuery = { count: 250, order: "desc", before: EARLIEST_FEED_CONSIDERATION_DATE };

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

    const { data: eventuallyData, error: eventuallyError } = useSWRInfinite<BlaseballFeedEntry[]>(
        (_, previous) => {
            const query: EventuallyTemporalUpdatesQuery = { count: 250, order: "desc" };

            // First page
            if (!previous) return eventuallyApi.temporalUpdates(query);

            const last_entry = previous[-1];
            if (!last_entry) return null;
            if (!last_entry.created) return null;
            if (last_entry.created.localeCompare(EARLIEST_FEED_CONSIDERATION_DATE) < 0) return null;

            return eventuallyApi.temporalUpdates({ ...query, after: last_entry.created });
        },
        { initialSize: 999 }
    );

    const allUpdates: ChronTemporalUpdate[] = [];
    if (chronData) {
        for (const page of chronData) {
            allUpdates.push(...page.items);
        }
    }

    if (eventuallyData) {
        for (const page of eventuallyData) {
            for (const feedEntry of page) {
                const feed_metadata = feedEntry.metadata as BlaseballFeedTemporalMetadata;
                if (!feed_metadata) break;

                allUpdates.push({
                    nextPage: "no-pages",
                    hash: "no-hash",
                    entityId: feedEntry.id,
                    validFrom: feedEntry.created,
                    validTo: feedEntry.created,
                    data: {
                        doc: {
                            zeta: feedEntry.description,
                            gamma: feed_metadata.being,
                            // we're only considering feed events after s24, and there haven't been any non-takeover temporal events yet
                            // a problem for future us
                            epsilon: true,
                        },
                    },
                });
            }
        }
    }

    return {
        updates: allUpdates,
        error: chronError || eventuallyError,
        isLoading: !chronData && !chronError && !eventuallyData && !eventuallyError,
    };
}

interface TemporalHookReturn {
    updates: ChronTemporalUpdate[];
    error: any;
    isLoading: boolean;
}

export function useTemporalForGame(gameId: string): TemporalHookReturn {
    const { data: gameData } = useSWR<GameUpdatesResponse>(
        chroniclerApi.gameUpdates({ game: gameId, count: 1, started: true })
    );

    const { data: chronData, error: chronError } = useSWR<TemporalResponse>(() =>
        chroniclerApi.temporalUpdates({ count: 1000, order: "asc", after: gameData!.data[0].timestamp })
    );

    return {
        updates: chronData?.items ?? [],
        error: chronError,
        isLoading: !chronData && !chronError,
    };
}

export function useTemporalForFight(fightId: string): TemporalHookReturn {
    const { data: fightData } = useSWR<FightUpdatesResponse>(
        chroniclerApi.fightUpdates({ id: fightId, count: 1 })
    );

    const { data: chronData, error: chronError } = useSWR<TemporalResponse>(() =>
        chroniclerApi.temporalUpdates({ count: 1000, order: "asc", after: fightData!.items[0].validFrom })
    );

    return {
        updates: chronData?.items ?? [],
        error: chronError,
        isLoading: !chronData && !chronError,
    };
}

interface SimDataHookReturn {
    data: BlaseballSimData | null;
    error: any;
    isLoading: boolean;
}

export function useSimulation(): SimDataHookReturn {
    const { data, error } = useSWR<SimResponse>(chroniclerApi.simUpdates());

    return {
        data: data?.items[0]?.data ?? null,
        error,
        isLoading: !data && !error,
    };
}

interface SimDataExperimentalHookReturn {
    data: BlaseballSimExperimental | null;
    error: any;
    isLoading: boolean;
}

export function useSimulationExperimental(): SimDataExperimentalHookReturn {
    const { data, error } = useSWR<ChronExperimental<BlaseballSimExperimental>>(chroniclerExperimentalApi.sim({order: "desc", count: 1}));

    return {
        data: data?.items[0].data ?? null,
        error,
        isLoading: !data && !error,
    };
}

interface SunSunPressureDataHookReturn {
    data: ChronSunSunPressure[];
    error: any;
    isLoading: boolean;
}

export function useSunSunPressureForGame(gameId: string): SunSunPressureDataHookReturn {
    const { data: gameData } = useSWR<GameUpdatesResponse>(
        chroniclerApi.gameUpdates({ game: gameId, count: 1, started: true })
    );

    const { data: chronData, error: chronError } = useSWR<SunSunPressureResponse>(() =>
        chroniclerApi.sunSunPressure({ count: 1000, order: "desc", after: gameData!.data[0].timestamp })
    );

    return {
        data: chronData?.items ?? [],
        error: chronError,
        isLoading: !chronData && !chronError,
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

interface FeedSeasonListReturn {
    feedSeasonList: ChronFeedSeasonList | null;
    error: any;
    isLoading: boolean;
}

export function useFeedSeasonList(): FeedSeasonListReturn {
    const { data, error } = useSWR<ChronV2Response<ChronFeedSeasonList>>(chroniclerApi.feedSeasonList());
    return {
        feedSeasonList: data?.items[0] ?? null,
        error,
        isLoading: !data,
    };
}
