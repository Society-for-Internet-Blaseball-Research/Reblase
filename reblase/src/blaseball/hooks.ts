import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import {
    ChronGame,
    ChronGameUpdate,
    chroniclerApi,
    ChronPlayer,
    ChronResponse,
    ChronTeam,
    ChronTemporalUpdate,
    GameListQuery,
    GameUpdatesQuery,
} from "./chronicler";
import { Simulation } from "./models";

interface GameListHookReturn {
    games: ChronGame[];
    error: any;
    isLoading: boolean;
}

export function useGameList(query: GameListQuery): GameListHookReturn {
    const { data, error } = useSWR<ChronResponse<ChronGame>>(chroniclerApi.gameList(query));

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
    query.count = 1000; // should be enough, right? :)
    const { data: initialData, error } = useSWR<ChronResponse<ChronGameUpdate>>(chroniclerApi.gameUpdates(query));

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
            const json = (await response.json()) as ChronResponse<ChronGameUpdate>;

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

interface PlayerTeamsHookReturn {
    players: ChronPlayer[];
    teams: ChronTeam[];
    teamsObj: Partial<Record<string, ChronTeam>>;
    error?: any;
    isLoading: boolean;
}

export function usePlayerTeamsList(): PlayerTeamsHookReturn {
    const { data: players, error: playersError } = useSWR<ChronResponse<ChronPlayer>>(chroniclerApi.players());
    const { data: teams, error: teamsError } = useSWR<ChronResponse<ChronTeam>>(chroniclerApi.teams());

    const teamsObj = useMemo(() => {
        const teamsObj: Record<string, ChronTeam> = {};
        if (teams) {
            for (const team of teams.data) teamsObj[team.id] = team;
        }

        return teamsObj;
    }, [teams]);

    return {
        players: players?.data ?? [],
        teams: teams?.data ?? [],
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
    const { data, error } = useSWR<ChronResponse<ChronTemporalUpdate>>(chroniclerApi.temporal);

    return {
        updates: data?.data ?? [],
        error,
        isLoading: !data && !error,
    };
}

interface SimulationHookReturn {
    data: Simulation;
    error: any;
    isLoading: boolean
}

export function useSimulation(): SimulationHookReturn {
    const {data, error} = useSWR<any>("https://api.sibr.dev/proxy/database/simulationData");
    
    return {
        data,
        error,
        isLoading: !data && !error,
    }
}
