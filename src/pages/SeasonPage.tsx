import { useLocation, useParams } from "react-router";
import React, { useEffect, useMemo, useState } from "react";

import { DayTable } from "../components/DayTable";
import { Loading } from "../components/Loading";
import { Container } from "../components/Container";
import Error from "../components/Error";
import { cache } from "swr";
import { useGameList, usePlayerTeamsList } from "../blaseball/hooks";
import { ChronGame } from "../blaseball/chronicler";
import TeamPicker from "../components/TeamPicker";
import OutcomePicker from "../components/OutcomePicker";
import { getOutcomes } from "../blaseball/outcome";
import WeatherPicker from "../components/WeatherPicker";
import Checkbox from "../components/Checkbox";
import { Link } from "react-router-dom";

type GameDay = { games: ChronGame[]; season: number; day: number };
function groupByDay(games: ChronGame[]): GameDay[] {
    const days: Record<string, GameDay> = {};
    for (const game of games) {
        const day = game.data.day;
        if (!days[day]) days[day] = { games: [], season: game.data.season, day: game.data.day };
        days[day].games.push(game);
    }

    const daysList = [];

    // Can't find a better way to do this because JS sorting is hard
    // 120 should be an upper bound (inb4 falsehoods....)
    for (let i = 0; i < 120; i++) {
        if (days[i]) daysList.push(days[i]);
    }

    return daysList;
}

const GamesList = React.memo((props: { days: GameDay[]; showFutureWeather: boolean }) => {
    return (
        <div>
            {props.days.map(({ games, season, day }) => {
                return (
                    <DayTable
                        key={day}
                        season={season + 1}
                        day={day + 1}
                        games={games}
                        showFutureWeather={props.showFutureWeather}
                    />
                );
            })}
        </div>
    );
});

function GamesListFetching(props: {
    season: number;
    teams: string[] | null;
    outcomes: string[] | null;
    weather: number[] | null;
    showFutureGames: boolean;
    showFutureWeather: boolean;
}) {
    let { games, error, isLoading } = useGameList({
        season: props.season - 1,
        started: !props.showFutureGames ? true : undefined,
        team: props.teams ? props.teams.join(",") : undefined,
        weather: props.weather ? props.weather.join(",") : undefined,
        outcomes: props.outcomes ? true : undefined,
    });

    const days = useMemo(() => {
        let gamesFiltered = games;
        if (props.outcomes) {
            gamesFiltered = gamesFiltered.filter((game) => {
                const gameOutcomes = getOutcomes(game.data);
                for (const gameOutcome of gameOutcomes)
                    if (props.outcomes?.indexOf(gameOutcome.name) !== -1) return true;
                return false;
            });
        }

        return groupByDay(gamesFiltered).reverse();
    }, [games, props.outcomes]);

    if (error) return <Error>{error}</Error>;
    if (isLoading) return <Loading />;

    return <GamesList days={days} showFutureWeather={props.showFutureWeather} />;
}

interface SeasonPageParams {
    season: string;
}

export function SeasonPage() {
    const location = useLocation();

    let { season: seasonStr } = useParams<SeasonPageParams>();
    const season = parseInt(seasonStr);

    let [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    let [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
    let [selectedWeather, setSelectedWeather] = useState<number[]>([]);
    let [showFutureGames, setShowFutureGames] = useState<boolean>(false);
    let [showFutureWeather, setShowFutureWeather] = useState<boolean>(false);

    const { teams, error } = usePlayerTeamsList();

    // Never reuse caches across multiple seasons, then it feels slower because instant rerender...
    useEffect(() => cache.clear(), [season]);

    if (error) return <Error>{error.toString()}</Error>;

    return (
        <Container className={"mt-4"}>
            <h2 className="text-2xl font-semibold mb-4"><Link to={location.pathname}>Games in Season {season}</Link></h2>

            <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <div className="font-semibold mb-1">Filter by team</div>
                    <TeamPicker
                        placeholder="Select team(s)..."
                        teams={teams}
                        selectedTeams={selectedTeams}
                        setSelectedTeams={setSelectedTeams}
                    />
                </div>

                <div>
                    <div className="font-semibold mb-1">Filter by events</div>
                    <OutcomePicker
                        placeholder="Select event(s)..."
                        selectedOutcomes={selectedOutcomes}
                        setSelectedOutcomes={setSelectedOutcomes}
                    />
                </div>

                <div>
                    <div className="font-semibold mb-1">Filter by weather</div>
                    <WeatherPicker
                        placeholder="Select weather..."
                        selectedWeather={selectedWeather}
                        setSelectedWeather={setSelectedWeather}
                    />
                </div>

                <div>
                    <div className="font-semibold mb-1">Options</div>
                    <Checkbox value={showFutureGames} setValue={setShowFutureGames}>
                        Show future games
                    </Checkbox>
                    <Checkbox value={showFutureWeather} setValue={setShowFutureWeather}>
                        Show future weather
                    </Checkbox>
                </div>
            </div>

            <GamesListFetching
                season={season}
                teams={selectedTeams.length ? selectedTeams : null}
                outcomes={selectedOutcomes.length ? selectedOutcomes : null}
                weather={selectedWeather.length ? selectedWeather : null}
                showFutureGames={showFutureGames}
                showFutureWeather={showFutureWeather}
            />
        </Container>
    );
}
