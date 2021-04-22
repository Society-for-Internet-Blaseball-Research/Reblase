import { useGameList, useSimulation } from "../blaseball/hooks";
import React from "react";
import Error from "../components/elements/Error";

import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import { Link } from "react-router-dom";
import { GameRow } from "../components/gamelist/GameRow";
import { displaySeason } from "blaseball-lib/games";

function SingleDayGamesList(props: { season: number; day: number }) {
    const { games, error, isLoading } = useGameList({ season: props.season, day: props.day });

    if (error) return <Error>{error.toString()}</Error>;
    if (isLoading) return <Loading />;
    return (
        <div className="flex flex-col">
            {games.map((game) => {
                return (
                    <GameRow
                        key={game.gameId}
                        game={game}
                        showWeather={true}
                        predictedAwayPitcher={null}
                        predictedHomePitcher={null}
                    />
                );
            })}
        </div>
    );
}

export function Home() {
    // Load games from the game list, or show error if there's an error, or loading if they're loading
    const { data: sim, error, isLoading } = useSimulation();

    if (error) return <Error>{error.toString()}</Error>;
    if (isLoading || !sim) return <Loading />;

    const season = sim.phase >= 12 && sim.phase <= 15 ? -1 : sim.season;

    return (
        <Container>
            <p className="mb-4">Hi! {"\u{1F44B}"} Select a season up top to view more games.</p>

            <div>
                <h3 className="text-2xl font-semibold">Current games</h3>

                <h4 className="text-md text-gray-700 dark:text-gray-300 mb-2">
                    Season {displaySeason(season)}, Day {sim.day + 1}
                </h4>

                {sim && <SingleDayGamesList season={season} day={sim.day} />}
                <Link className="block mt-2" to={`/season/${sim.season + 1}`}>
                    View all Season {displaySeason(season)} games &rarr;
                </Link>
            </div>
        </Container>
    );
}
