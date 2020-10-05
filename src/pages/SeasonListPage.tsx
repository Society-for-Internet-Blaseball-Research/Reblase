import React from "react";
import { Container } from "../components/Container";
import { Loading } from "../components/Loading";
import Error from "../components/Error";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useGameList } from "../blaseball/hooks";
import { ChronGame } from "../blaseball/chronicler";

function SeasonRow(props: { game: ChronGame }) {
    const { startTime, data } = props.game;

    const startDate = startTime ? dayjs(startTime) : null;
    const endDate = startTime ? dayjs(startTime).add(6, "day") : null;
    const dateFormat = "MMM D, YYYY";

    const target = `/season/${data.season + 1}`;
    return (
        <Link className="flex px-4 py-2 border-b border-solid border-gray-300 items-center cursor-pointer hover:bg-gray-200" to={target}>
            <span className="text-lg font-semibold">Season {data.season + 1}</span>
            <span className="text-gray-700 ml-4 mr-auto">
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

    const seasons = [];
    for (const game of games) seasons[game.data.season] = game;
    seasons.reverse();

    return (
        <Container className={"mt-4"}>
            <h2 className="text-2xl font-semibold mb-2">Seasons</h2>

            <div className="flex flex-col">
                {seasons.map((seasonGame, i) => (
                    <SeasonRow key={i} game={seasonGame}></SeasonRow>
                ))}
            </div>
        </Container>
    );
}
