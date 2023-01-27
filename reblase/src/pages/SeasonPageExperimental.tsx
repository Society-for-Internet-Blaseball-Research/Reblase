import { useLocation, useParams } from "react-router";
import React, { useMemo, useState } from "react";

import { DayTableExperimental } from "../components/gamelist/DayTable";
import { Loading } from "../components/elements/Loading";
import { Container } from "../components/layout/Container";
import Error from "../components/elements/Error";
import { useGameListExperimental, useGameOutcomesExperimental, useSimulationExperimental,useTeamsList } from "../blaseball/hooks";
import { TeamPickerExperimental } from "../components/elements/TeamPicker";
import { WeatherPickerExperimental } from "../components/elements/WeatherPicker";
import { OutcomePickerExperimental } from "../components/elements/OutcomePicker";
import StadiumPicker from "components/elements/StadiumPicker";
import Checkbox from "../components/elements/Checkbox";
import { Link } from "react-router-dom";
import { BlaseballDisplayExperimental, BlaseballFeedSeasonList, BlaseballGameExperimental, BlaseballGameExperimentalWithOutcomes, BlaseballTeam } from "blaseball-lib/models";
import { GameID, PlayerID, SeasonID, WeatherID } from "blaseball-lib/common";
import { returnedSeasons } from "blaseball-lib/seasons";
import { Outcome, OutcomeType } from "blaseball/outcome";

type GameDay = { games: BlaseballGameExperimentalWithOutcomes[]; season: SeasonID; day: number };
function groupByDay(games: BlaseballGameExperimentalWithOutcomes[]): GameDay[] {
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
        season: number;
        days: GameDay[];
        complete: boolean;
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
                            season={props.season}
                            day={day}
                            complete={props.complete}
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
    season: number;
    games: BlaseballGameExperimental[];
    outcomes: Map<GameID, BlaseballDisplayExperimental[]>;

    teams: string[] | null;
    weather: WeatherID[] | null;
    selectedOutcomes: OutcomeType[] | null;

    complete: boolean;
    showFutureGames: boolean;
    showFutureWeather: boolean;

    allTeams: BlaseballTeam[];
}) {
    const { data: simData, error: simError, isLoading: simIsLoading } = useSimulationExperimental();
    const games = props.games;

    const days = useMemo(() => {
        let gamesFiltered = games.filter((game) => {
            if (game.cancelled) return false;
            if (!game.started) {
                if (!props.showFutureGames) {
                    if (game.gameStates.length == 0) return false;
                    
                }
            }
            if (props.weather && !props.weather.some((weatherId) => game.weather.id === weatherId)) return false;
            if (!props.teams) return true;

            return props.teams?.indexOf(game.awayTeam.id) !== -1 || props.teams.indexOf(game.homeTeam.id) !== -1;
        });

        const outcomesFiltered = new Map(Array(...props.outcomes.entries()).filter((value) => gamesFiltered.some((game) => game.id === value[0])));

        let gamesWithOutcomesFiltered = gamesFiltered.map((game) => {return {...game, outcomes: outcomesFiltered.get(game.id) ?? []}});

        if (props.selectedOutcomes && props.selectedOutcomes.length > 0) {
            gamesWithOutcomesFiltered = gamesWithOutcomesFiltered.filter((game) => {
                if (game.outcomes.length == 0) return false;

                return game.outcomes
                    .some((outcome) => props.selectedOutcomes!
                        .some((outcomeType) => outcomeType.search
                            .some((r) => {return r.test(outcome.displayText)})))
            });
        }

        let gamesByDay = groupByDay(gamesWithOutcomesFiltered).reverse();

        return gamesByDay;
    }, [games, props.outcomes, props.season, props.showFutureGames, props.weather, props.selectedOutcomes, props.teams]);

    if (days.length === 0) return (
        <>
            <span className="font-semibold mt-4 space-x-2">
                No games which match current filters.
            </span>
        </>
    );

    if (simError) return <Error>{simError}</Error>;
    if (simIsLoading) return <Loading />;

    const currentDay = simData?.simData.currentDay ?? 0;

    return (
        <>
            <GamesList
                season={props.season}
                days={days}
                complete={props.complete}
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
    const [selectedStadiums, setSelectedStadiums] = useState<string[]>([]);
    const [selectedOutcomes, setSelectedOutcomes] = useState<OutcomeType[]>([]);
    const [selectedWeather, setSelectedWeather] = useState<WeatherID[]>([]);
    const [showFutureGames, setShowFutureGames] = useState<boolean>(false);
    const [showFutureWeather, setShowFutureWeather] = useState<boolean>(false);

    const { teams, error, isLoading: isLoadingTeams } = useTeamsList();

    let {
        games,
        error: gamesError,
        isLoading: isLoadingGames,
    } = useGameListExperimental({season: seasonId});

    let {
        data: outcomes,
        error: outcomesError,
        isLoading: _, // do not pause execution while outcomes load
    } = useGameOutcomesExperimental();

    if (error || gamesError || outcomesError) return <Error>{(error || gamesError).toString()}</Error>;
    if (isLoadingTeams || isLoadingGames) return <Loading />;

    return (
        <Container className={"mt-4"}>
            <p className="mb-2">
                <Link to="/seasons">&larr; Back to Seasons</Link>
            </p>
            <h2 className="text-2xl font-semibold mb-4">
                <Link to={location.pathname}>
                    Games in Season {seasonNumber}
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

                <div>
                    <div className="font-semibold mb-1">Filter by events</div>
                    <OutcomePickerExperimental
                        placeholder="Select event(s)..."
                        selectedOutcomes={selectedOutcomes}
                        setSelectedOutcomes={setSelectedOutcomes}
                    />
                </div>

                <div>
                    <div className="font-semibold mb-1">Filter by weather</div>
                    <WeatherPickerExperimental
                        placeholder="Select weather..."
                        selectedWeather={selectedWeather}
                        setSelectedWeather={setSelectedWeather}
                    />
                </div>

                <div>
                    <div className="font-semibold mb-1">Filter by stadium</div>
                    <StadiumPicker
                        placeholder="Select stadium(s)..."
                        games={[]}
                        selectedStadiums={selectedStadiums}
                        setSelectedStadiums={setSelectedStadiums}
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
                season={seasonNumber}
                complete={complete}
                games={games}
                outcomes={outcomes}
                selectedOutcomes={selectedOutcomes}
                showFutureGames={showFutureGames}
                showFutureWeather={showFutureWeather}
                teams={selectedTeams.length ? selectedTeams : null}
                allTeams={teams.map((p) => p.data)}
                weather={selectedWeather.length ? selectedWeather : null}
            />
        </Container>
    );
}
