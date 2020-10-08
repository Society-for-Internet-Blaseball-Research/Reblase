import { useGameList, useSimulation } from "../blaseball/hooks";
import React from "react";
import Error from "../components/elements/Error";

import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import { Link } from "react-router-dom";
import GameRow from "../components/gamelist/GameRow";

function SingleDayGamesList(props: { season: number; day: number }) {
    const { games, error, isLoading } = useGameList({ season: props.season, day: props.day });

    if (error) return <Error>{error.toString()}</Error>;
    if (isLoading) return <Loading />;
    return (
        <div className="flex flex-col">
            {games.map((game) => {
                return <GameRow game={game} showWeather={true} />;
            })}
        </div>
    );
}

export function Home() {
    // Load games from the game list, or show error if there's an error, or loading if they're loading
    const { data: simulation, error: simulationLoadingError, isLoading: simulationIsLoading } = useSimulation();

    if (simulationIsLoading) return <Loading />;
    if (simulationLoadingError) return <Error>{simulationLoadingError.toString()}</Error>;
    return (
        <Container>
            <p className="mb-4">Hi! {"\u{1F44B}"} Select a season up top to view more games.</p>

            <div>
                <h3 className="text-2xl font-semibold">Current games</h3>
                <h4 className="text-md text-gray-700 mb-2">
                    Season {simulation.season + 1}, Day {simulation.day + 1}
                </h4>

                {simulation && <SingleDayGamesList season={simulation.season} day={simulation.day} />}
                <Link className="block mt-2" to={`/season/${simulation.season + 1}`}>
                    View all Season {simulation.season + 1} games &rarr;
                </Link>
            </div>
        </Container>
    );
}
