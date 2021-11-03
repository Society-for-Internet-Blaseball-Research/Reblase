﻿import { useFeedSeasonList, useGameList, usePlayerTeamsList, useSimulation } from "../blaseball/hooks";
import { BlaseballTeam } from "blaseball-lib/models";
import React from "react";
import Error from "../components/elements/Error";
import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import { Link } from "react-router-dom";
import { GameRow } from "../components/gamelist/GameRow";
import { displaySeason, displaySim, STATIC_ID } from "blaseball-lib/games";
import { PlayerID } from "blaseball-lib/common";

function SingleDayGamesList(props: { sim: string; season: number; day: number }) {
    const { games, error, isLoading } = useGameList({ sim: props.sim, season: props.season, day: props.day });
    const { players, teams, error: teamError, isLoading: isLoadingPlayerTeams } = usePlayerTeamsList();

    if (error) return <Error>{error.toString()}</Error>;
    if (teamError) return <Error>{teamError.toString()}</Error>;
    if (isLoading || isLoadingPlayerTeams) return <Loading />;
    const teamsMap: Record<PlayerID, BlaseballTeam> = {};
    for (const team of teams) teamsMap[team.data.id!] = team.data;

    return (
        <div className="flex flex-col">
            {games.map((game) => {
                return (
                    <GameRow
                        key={game.gameId}
                        game={game}
                        teams={teamsMap}
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
    const { feedSeasonList, error: feedSeasonError, isLoading: feedSeasonIsLoading } = useFeedSeasonList();

    if (error || feedSeasonError) return <Error>{(error || feedSeasonError).toString()}</Error>;
    if (isLoading || !sim || feedSeasonIsLoading) return <Loading />;

    const season = sim.phase >= 12 && sim.phase <= 15 ? -1 : sim.season;
    const gammaString = sim.id != STATIC_ID ? displaySim(sim.id!, feedSeasonList?.data ?? null) + ", ": "";

    return (
        <Container>
            <p className="mb-4">Hi! {"\u{1F44B}"} Select a season up top to view more games.</p>

            <div>
                <h3 className="text-2xl font-semibold">Current games</h3>

                <h4 className="text-md text-gray-700 dark:text-gray-300 mb-2">
                    {gammaString}Season {displaySeason(season)}, Day {sim.day + 1}
                </h4>

                {sim && <SingleDayGamesList sim={sim.id!} season={season} day={sim.day} />}
                <Link className="block mt-2" to={`/season/${sim.season + 1}/${sim.id}`}>
                    View all {gammaString}Season {displaySeason(season)} games &rarr;
                </Link>
            </div>
        </Container>
    );
}
