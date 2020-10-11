import dayjs from "dayjs";
import React from "react";

import "./DayTable.css";
import { GameRow } from "./GameRow";
import { ChronGame } from "blaseball-lib/chronicler";
import { predictGamePitcher } from "blaseball-lib/team";
import { BlaseballGame, BlaseballPlayer, BlaseballTeam } from "blaseball-lib/models";

interface DayTableProps {
    games: ChronGame[];
    season: number;
    day: number;
    showFutureWeather: boolean;
    teams: Record<string, BlaseballTeam>;
    players: Record<string, BlaseballPlayer>;
}

function predictPitchersForGame(
    teams: Record<string, BlaseballTeam>,
    players: Record<string, BlaseballPlayer>,
    game: BlaseballGame
) {
    const home = predictGamePitcher(teams[game.homeTeam], game.day, (id) => players[id]);
    const away = predictGamePitcher(teams[game.awayTeam], game.day, (id) => players[id]);

    return {
        home: players[home].name,
        away: players[away].name,
    };
}

export const DayTable = function DayTable(props: DayTableProps) {
    const startedGame = props.games.find((g) => g.startTime !== null);
    const timestamp = startedGame ? dayjs(startedGame.startTime!) : null;

    return (
        <>
            <div className="flex flex-row items-baseline mt-4 space-x-2">
                <span className="font-semibold">
                    Season {props.season}, Day {props.day}
                </span>
                <span className="flex-1 text-right lg:text-left text-sm text-gray-700">
                    {timestamp?.format("YYYY-MM-DD HH:mm")}
                </span>
            </div>

            {props.games.map((game) => {
                const predictedPitchers = predictPitchersForGame(props.teams, props.players, game.data);
                return (
                    <GameRow
                        key={game.gameId}
                        game={game}
                        showWeather={props.showFutureWeather || game.startTime !== null}
                        predictedAwayPitcher={predictedPitchers.away}
                        predictedHomePitcher={predictedPitchers.home}
                    />
                );
            })}
        </>
    );
};
