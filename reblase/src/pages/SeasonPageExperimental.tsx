import { useLocation } from "react-router";
import React, { useMemo, useState } from "react";

import { DayTableExperimental } from "../components/gamelist/DayTable";
import { Loading } from "../components/elements/Loading";
import { Container } from "../components/layout/Container";
import Error from "../components/elements/Error";
import { useGameListExperimental, useSimulationExperimental,useTeamsList } from "../blaseball/hooks";
import { TeamPickerExperimental } from "../components/elements/TeamPicker";
import Checkbox from "../components/elements/Checkbox";
import { Link } from "react-router-dom";
import { BlaseballFeedSeasonList, BlaseballGameExperimental, BlaseballTeam } from "blaseball-lib/models";
import { PlayerID, SeasonID } from "blaseball-lib/common";

type GameDay = { games: BlaseballGameExperimental[]; season: SeasonID; day: number };
function groupByDay(games: BlaseballGameExperimental[]): GameDay[] {
    const days: Record<string, GameDay> = {};
    let maxDay = -1;
    for (const game of games) {
        const day = game.day;
        if (!days[day]) days[day] = { games: [], season: game.seasonId, day: game.day };
        days[day].games.push(game);
        if (maxDay < day) maxDay = day;
    }

    const daysList = [];

    // Can't find a better way to do this because JS sorting is hard
    // 120 should be an upper bound (inb4 falsehoods....)
    // (future message from gamma9: [narrator voice] it wasn't.)
    // (future message from gamma10: screaming)
    for (let i = 0; i <= maxDay; i++) {
        if (days[i]) daysList.push(days[i]);
    }

    return daysList;
}

const GamesList = React.memo(
    (props: {
        days: GameDay[];
        teams: BlaseballTeam[];
        showFutureWeather: boolean;
        currentDay: number;
        feedSeasonList?: BlaseballFeedSeasonList;
    }) => {
        const teamsMap: Record<PlayerID, BlaseballTeam> = {};
        for (const team of props.teams) teamsMap[team.id!] = team;

        return (
            <div>
                {props.days.map(({ games, season: _, day }) => {
                    return (
                        <DayTableExperimental
                            key={day}
                            day={day}
                            currentDay={props.currentDay}
                            games={games}
                            teams={teamsMap}
                            showFutureWeather={props.showFutureWeather}
                        />
                    );
                })}
            </div>
        );
    }
);

function GamesListFetchingExperimental(props: {
    teams: string[] | null;

    complete: boolean;
    showFutureGames: boolean;
    showFutureWeather: boolean;

    allTeams: BlaseballTeam[];
}) {
    const { games, error, isLoading } = useGameListExperimental();

    const { data: simData, error: simError, isLoading: simIsLoading } = useSimulationExperimental();

    const days = useMemo(() => {
        let gamesFiltered = games.filter((game) => {
            if (game.cancelled) return false;
            if (!game.started) {
                if (props.complete) return false;
                if (!props.showFutureGames) return false;
            }
            if (!props.teams) return true;

            return props.teams?.indexOf(game.awayTeam.id) !== -1 || props.teams.indexOf(game.homeTeam.id) !== -1;
        });

        return groupByDay(gamesFiltered).reverse();
    }, [games, props.showFutureGames, props.teams]);

    if (error || simError) return <Error>{(error || simError).toString()}</Error>;
    if (isLoading || simIsLoading) return <Loading />;

    const currentDay = simData?.simData.currentDay ?? 0;

    return (
        <>
            <GamesList
                days={days}
                teams={props.allTeams}
                showFutureWeather={props.showFutureWeather}
                currentDay={currentDay}
            />
        </>
    );
}

interface SeasonPageParams {
    season: string;
}

export function SeasonPageExperimental() {
    const location = useLocation();

    const { season: seasonStr } = useParams<SeasonPageParams>();
    const seasonNumber = parseInt(seasonStr);
    const seasonId = returnedSeasons.get(seasonNumber - 1);
    const complete = Math.max(...returnedSeasons.keys()) !== seasonNumber - 1;

    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [showFutureGames, setShowFutureGames] = useState<boolean>(false);
    const [showFutureWeather, setShowFutureWeather] = useState<boolean>(false);

    const { teams, error, isLoading: isLoadingTeams } = useTeamsList();

    let {
        games,
        error: gamesError,
        isLoading: isLoadingGames,
    } = useGameListExperimental({season: seasonId});

    if (error || gamesError)
        return <Error>{(error || gamesError).toString()}</Error>;
    if (isLoadingTeams || isLoadingGames) return <Loading />;

    return (
        <Container className={"mt-4"}>
            <p className="mb-2">
                <Link to="/seasons">&larr; Back to Seasons</Link>
            </p>
            <h2 className="text-2xl font-semibold mb-4">
                <Link to={location.pathname}>
                    Games in Season 1
                </Link>
            </h2>

            <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <div className="font-semibold mb-1">Filter by team</div>
                    <TeamPickerExperimental
                        placeholder="Select team(s)..."
                        games={games}
                        teams={teams}
                        selectedTeams={selectedTeams}
                        setSelectedTeams={setSelectedTeams}
                    />
                </div>

                {!complete &&
                <div className="col-start-1">
                    <div className="font-semibold mb-1">Options</div>
                    <Checkbox value={showFutureGames} setValue={setShowFutureGames}>
                        Show future games
                    </Checkbox>
                    <Checkbox value={showFutureWeather} setValue={setShowFutureWeather}>
                        Show future weather
                    </Checkbox>
                </div>
                }
            </div>

            <GamesListFetchingExperimental
                teams={selectedTeams.length ? selectedTeams : null}
                complete={complete}
                showFutureGames={showFutureGames}
                showFutureWeather={showFutureWeather}
                allTeams={teams.map((p) => p.data)}
            />
        </Container>
    );
}
