import { useGameListExperimental, useGameOutcomesExperimental, useSimulationExperimental, useTeamsList } from "../blaseball/hooks";
import { BlaseballTeam } from "blaseball-lib/models";
import React from "react";
import Error from "../components/elements/Error";
import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import { Link } from "react-router-dom";
import { GameRowExperimental } from "../components/gamelist/GameRow";
import { SeasonID, TeamID } from "blaseball-lib/common";

function SingleDayGamesList(props: {
    day: number;
    seasonNumber: number;
    seasonId: SeasonID;
}) {
    const { games, error, isLoading } = useGameListExperimental({order: "desc"});
    let { data: outcomes, error: outcomesError, isLoading: _ } = useGameOutcomesExperimental();
    const { teams, error: teamError, isLoading: isLoadingTeams } = useTeamsList();

    if (error) return <Error>{error.toString()}</Error>;
    if (outcomesError) return <Error>{outcomesError.toString()}</Error>;
    if (teamError) return <Error>{teamError.toString()}</Error>;
    if (isLoading || isLoadingTeams) return <Loading />;
    const teamsMap: Record<TeamID, BlaseballTeam> = {};
    for (const team of teams) teamsMap[team.data.id!] = team.data;

    let gameRows: JSX.Element[] = [];
    games.forEach((game) => {
        if (game.day !== props.day || game.seasonId != props.seasonId){
            return;
        }

        // the current value is guaranteed to be newer than this one, if it exists, because we're ordering in descending order.
        if (gameRows.some((row) => row.key == game.id)) {
            return;
        }        

        if (!game.started && (game.gameStates.length == 0 || !game.gameStates[0])) return;

        gameRows.push((          
            <GameRowExperimental
                key={game.id}
                complete={false}
                season={props.seasonNumber}
                game={{...game, outcomes: outcomes.get(game.id) ?? []}}
                teams={teamsMap}
                showWeather={true}
            />
        ));
    });

    if (gameRows.length === 0) {
        return (<h2>No Games</h2>);
    }

    return (
        <div className="flex flex-col">
            {gameRows}
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

                {(sim.simData.currentDay < 0) ?
                <h4 className="text-md text-gray-700 dark:text-gray-300 mb-2">
                    Preseason for Season {sim.simData.currentSeasonNumber + 1}
                </h4>
                :
                <>
                    <h4 className="text-md text-gray-700 dark:text-gray-300 mb-2">
                        Season {sim.simData.currentSeasonNumber + 1}, Day {sim.simData.currentDay + 1}
                    </h4>

                    {sim && (
                        <SingleDayGamesList
                            seasonNumber={sim.simData.currentSeasonNumber}
                            seasonId={sim.simData.currentSeasonId}
                            day={sim.simData.currentDay} />
                    )}
                </>}
                <Link className="block mt-2" to={
                    // we can worry about multiple seasons when there are multiple seasons
                    `/experimental/season/${sim.simData.currentSeasonNumber + 1}`
                }>
                    <>View all Season {sim.simData.currentSeasonNumber + 1} games &rarr;</>
                </Link>
            </div>
        </Container>
    );
}
