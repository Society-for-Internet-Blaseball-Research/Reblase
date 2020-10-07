import { useGameList, useSimulation } from "../blaseball/hooks";
import React from "react";
import Error from "../components/elements/Error";

import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import { ChronGame } from "../blaseball/chronicler";
import { Link } from "react-router-dom";
import Twemoji from "../components/elements/Twemoji";
import { Weather } from "../components/gamelist/GameRow"

export function Home() {
    // Load games from the game list, or show error if there's an error, or loading if they're loading
    const { data: simulation, error: simulationLoadingError, isLoading: simulationIsLoading } = useSimulation();
    const { games, error: gameLoadingError, isLoading: gamesAreLoading } = useGameList({
        season: simulation ? simulation.season : undefined,
        day: simulation ? simulation.day : undefined,
    });

    function renderLiveGames() {
        if (simulationLoadingError) return <Error>{simulationLoadingError.toString()}</Error>
        if (gameLoadingError) return <Error>{gameLoadingError.toString()}</Error>;
        if (gamesAreLoading || simulationIsLoading) return <Loading />;

        return <ul className="flex flex-col mb-3">
            {games && games.map((game: ChronGame) => {
                const arrow = game.data.topOfInning ? "\u25B2" : "\u25BC";
                const homeTeamIsWinning = game.data.homeScore >= game.data.awayScore;
                const awayTeamIsWinning = game.data.awayScore >= game.data.homeScore;

                return <li key={game.gameId} className="flex hover:bg-gray-200">
                    <Link to={`/game/${game.gameId}`} className="flex-grow p-2 border-b border-gray-300 flex">
                        <div className="flex-grow flex flex-col">
                            <div className="space-x-2">
                                <strong>{game.data.homeScore}</strong>
                                <Twemoji emoji={game.data.homeTeamEmoji} />
                                <span className={homeTeamIsWinning ? "font-semibold" : "font-normal"}>{game.data.homeTeamNickname}</span>
                            </div>
                            <div className="space-x-2">
                                <strong>{game.data.awayScore}</strong>
                                <Twemoji emoji={game.data.awayTeamEmoji} />
                                <span className={awayTeamIsWinning ? "font-semibold" : "font-normal"}>{game.data.awayTeamNickname}</span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <Weather weather={game.data.weather} className="text-right" />
                            <div className="space-x-1 text-sm tabular-nums text-gray-700">
                                <span>{game.data.inning + 1}</span>
                                <span>{arrow}</span>
                            </div>
                        </div>
                    </Link>
                </li>
            })}
        </ul>;
    }

    const displaySeasonNumber = simulation && simulation.season + 1;

    return <Container className="grid grid-cols-2 gap-4">
        <Container className="col-span-2">
            <p>Hi! {"\u{1F44B}"} Select a season up top to view more games.</p>
        </Container>
        {/* <Container className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-semibold mb-2">Recent Events</h2>
            TODO: List recent events here
        </Container> */}
        <Container className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-semibold mb-2">Today's Games</h2>
            {simulation && <h3 className="text-xl font-semibold mb-1">Season {displaySeasonNumber}, Day {simulation.day + 1}</h3>}
            {renderLiveGames()}
            {simulation && <Link to={`/season/${displaySeasonNumber}`}>View all Season {displaySeasonNumber} games &rarr;</Link>}
        </Container>
    </Container>;
}
