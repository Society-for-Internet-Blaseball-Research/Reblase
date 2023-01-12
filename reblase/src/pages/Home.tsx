import { useGameListExperimental, useSimulationExperimental, useTeamsList } from "../blaseball/hooks";
import { BlaseballTeam } from "blaseball-lib/models";
import React from "react";
import Error from "../components/elements/Error";
import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import { Link } from "react-router-dom";
import { GameRowExperimental } from "../components/gamelist/GameRow";
import { PlayerID } from "blaseball-lib/common";

function SingleDayGamesList(props: {
    day: number;
}) {
    const { games, error, isLoading } = useGameListExperimental();
    const { teams, error: teamError, isLoading: isLoadingTeams } = useTeamsList();

    if (error) return <Error>{error.toString()}</Error>;
    if (teamError) return <Error>{teamError.toString()}</Error>;
    if (isLoading || isLoadingTeams) return <Loading />;
    const teamsMap: Record<PlayerID, BlaseballTeam> = {};
    for (const team of teams) teamsMap[team.data.id!] = team.data;

    return (
        <div className="flex flex-col">
            {games.filter((game) => {game.day == props.day}).map((game) => {
                return (
                    <GameRowExperimental
                        key={game.id}
                        game={game}
                        teams={teamsMap}
                        showWeather={true}
                    />
                );
            })}
        </div>
    );
}

export function Home() {
    // Load games from the game list, or show error if there's an error, or loading if they're loading
    const { data: sim, error, isLoading } = useSimulationExperimental();
    
    if (error) return <Error>{(error).toString()}</Error>;
    if (isLoading || !sim) return <Loading />;

    return (
        <Container>
            <p className="mb-4">Hi! {"\u{1F44B}"} Select a season up top to view more games.</p>

            <div>
                <h3 className="text-2xl font-semibold">Current games</h3>

                <h4 className="text-md text-gray-700 dark:text-gray-300 mb-2">
                    Season 1, Day ${sim.simData.currentDay + 1}
                </h4>

                {sim && (
                    <SingleDayGamesList day={sim.simData.currentDay} />
                )}
                <Link className="block mt-2" to={
                    // we can worry about multiple seasons when there are multiple seasons
                    `/experimental/season/1`
                }>
                    <>View all Season 1 games &rarr;</>
                </Link>
            </div>
        </Container>
    );
}
