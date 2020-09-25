import React from "react";
import { useGameList } from "../blaseball/api";
import { Container } from "../components/Container";
import { Loading } from "../components/Loading";
import Error from "../components/Error";
import { Game } from "../blaseball/game";
import dayjs from "dayjs";
import { Link, useHistory, withRouter } from "react-router-dom";

function SeasonRow(props: { game: Game }) {
    const history = useHistory();

    const { start, data } = props.game;

    const startDate = dayjs(start!);
    const endDate = dayjs(start!).add(6, "day");
    const dateFormat = "MMM D, YYYY";

    const target = `/season/${data.season + 1}`;
    return (
        <div
            className="flex px-4 py-2 border-b border-solid border-gray-300 items-center cursor-pointer hover:bg-gray-200"
            onClick={() => history.push(target)}
        >
            <span className="text-lg font-semibold">Season {data.season + 1}</span>
            <span className="text-gray-700 ml-4 mr-auto">
                {startDate.format(dateFormat)} - {endDate.format(dateFormat)}
            </span>
            <Link to={target}>
                <span className="text-semibold">View games</span>
            </Link>
        </div>
    );
}

export function SeasonListPage() {
    const query = { day: 0, started: true };
    const { games, error } = useGameList(query);

    if (error) return <Error>{error.toString()}</Error>;
    if (!games) return <Loading />;

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
