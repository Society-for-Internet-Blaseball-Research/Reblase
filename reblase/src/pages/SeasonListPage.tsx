import React from "react";
import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import Error from "../components/elements/Error";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useGameList } from "../blaseball/hooks";
import { ChronGame } from "blaseball-lib/chronicler";
import { displaySeason } from "blaseball-lib/games";

function SeasonRow(props: { game: ChronGame }) {
    const { startTime, data } = props.game;

    const startDate = startTime ? dayjs(startTime) : null;
    const endDate = startTime ? dayjs(startTime).add(6, "day") : null;
    const dateFormat = "MMM D, YYYY";

    const target = `/season/${data.season + 1}`;
    return (
        <Link
            className="flex px-4 py-2 border-b border-solid border-gray-300 dark:border-gray-700 items-center hover:bg-gray-200 dark-hover:bg-gray-800"
            to={target}
        >
            <span className="text-lg font-semibold">Season {displaySeason(data.season)}</span>
            <span className="text-gray-700 dark:text-gray-300 ml-4 mr-auto">
                {startDate?.format(dateFormat) ?? "TBD"} - {endDate?.format(dateFormat) ?? "TBD"}
            </span>
            <span className="text-semibold">View games</span>
        </Link>
    );
}

export function SeasonListPage() {
    const query = { day: 0 };
    const { games, error, isLoading } = useGameList(query);

    if (error) return <Error>{error.toString()}</Error>;
    if (isLoading) return <Loading />;

    const seasons: Partial<Record<number, ChronGame>> = {};
    for (const game of games) {
        if (!seasons[game.data.season]) seasons[game.data.season] = game;
    }

    const seasonsList = Object.keys(seasons)
        .map((s) => parseInt(s))
        .sort((a, b) => {
            // lol
            if (a < 0) a += 100;
            if (b < 0) b += 100;

            return b - a;
        })
        .map((s) => seasons[s]!);

    return (
        <Container className={"mt-4"}>
            <h2 className="text-2xl font-semibold mb-2">Seasons</h2>

            <div className="flex flex-col mb-6">
                {seasonsList.map((seasonGame, i) => (
                    seasonGame.data.season >= 0 ? <SeasonRow key={i} game={seasonGame}/> : null
                ))}
            </div>
            <h2 className="text-2xl font-semibold mb-2">Exhibitions</h2>
            <div className="flex flex-col">
                {seasonsList.map((seasonGame, i) => (
                    seasonGame.data.season < 0 ? <SeasonRow key={i} game={seasonGame}/> : null
                ))}
            </div>
        </Container>
    );
}
