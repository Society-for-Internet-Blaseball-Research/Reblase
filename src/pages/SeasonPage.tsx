import { useParams } from "react-router";
import React, { useEffect } from "react";

import { DayTable } from "../components/DayTable";
import { Loading } from "../components/Loading";
import { Container } from "../components/Container";
import { useGameList } from "../blaseball/api";
import Error from "../components/Error";
import { cache } from "swr";
import { Game } from "../blaseball/game";

type GameDay = { games: Game[]; season: number; day: number };
function groupByDay(games: Game[]): GameDay[] {
    const days: Record<string, GameDay> = {};
    for (const game of games) {
        const day = game.data.day;
        if (!days[day]) days[day] = { games: [], season: game.data.season, day: game.data.day };
        days[day].games.push(game);
    }

    const daysList = [];

    // Can't find a better way to do this because JS sorting is hard
    // 120 should be an upper bound (inb4 falsehoods....)
    for (let i = 0; i < 120; i++) {
        if (days[i]) daysList.push(days[i]);
    }

    return daysList;
}

function GamesList(props: { season: number }) {
    let { games, error } = useGameList({
        season: props.season - 1,
        started: true,
    });
    if (error) return <Error>{error}</Error>;
    if (!games) return <Loading />;

    const days = groupByDay(games);
    days.reverse();

    return (
        <>
            {days.map(({ games, season, day }) => {
                return <DayTable key={day} season={season + 1} day={day + 1} games={games} />;
            })}
        </>
    );
}

interface SeasonPageParams {
    season: string;
}

export function SeasonPage() {
    let { season: seasonStr } = useParams<SeasonPageParams>();
    const season = parseInt(seasonStr);

    // Never reuse caches across multiple seasons, then it feels slower because instant rerender...
    useEffect(() => cache.clear(), [season]);

    return (
        <Container className={"mt-4"}>
            <h2 className="text-2xl font-semibold mb-4">Games in Season {season}</h2>

            <GamesList season={season} />
        </Container>
    );
}
