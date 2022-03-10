﻿import dayjs from "dayjs";
import React from "react";

import "./DayTable.css";
import { GameRow } from "./GameRow";
import { ChronGame } from "blaseball-lib/chronicler";
import { predictGamePitcher } from "blaseball-lib/team";
import { BlaseballFeedSeasonList, BlaseballGame, BlaseballPlayer, BlaseballTeam } from "blaseball-lib/models";
import { displaySimSeasonAndDayPlaintext } from "blaseball-lib/games";

interface DayTableProps {
    games: ChronGame[];
    sim?: string;
    season: number;
    day: number;
    currentDay: number;
    showFutureWeather: boolean;
    feedSeasonList?: BlaseballFeedSeasonList;
    teams: Record<string, BlaseballTeam>;
    players: Record<string, BlaseballPlayer>;
}

function predictPitchersForGame(
    teams: Record<string, BlaseballTeam>,
    players: Record<string, BlaseballPlayer>,
    game: BlaseballGame,
    currentDay: number
) {
    if (game.gameComplete) {
        return {
            home: game.homePitcherName,
            away: game.awayPitcherName,
        };
    }

    const home = predictGamePitcher(teams[game.homeTeam], game.day, currentDay, (id) => players[id]);
    const away = predictGamePitcher(teams[game.awayTeam], game.day, currentDay, (id) => players[id]);

    return {
        home: home ? players[home].name : null,
        away: away ? players[away].name : null,
    };
}

export const DayTable = function DayTable(props: DayTableProps) {
    const startedGame = props.games.find((g) => g.startTime !== null);
    const timestamp = startedGame ? dayjs(startedGame.startTime!) : null;

    return (
        <>
            <div className="flex flex-row items-baseline mt-4 space-x-2">
                <span className="font-semibold">
                    {displaySimSeasonAndDayPlaintext(props.sim, props.season, props.day, props.feedSeasonList)}
                </span>
                <span className="flex-1 text-right lg:text-left text-sm text-gray-700 dark:text-gray-300">
                    {timestamp?.format("YYYY-MM-DD HH:mm")}
                </span>
            </div>

            {props.games.map((game) => {
                const predictedPitchers = predictPitchersForGame(
                    props.teams,
                    props.players,
                    game.data,
                    props.currentDay
                );
                return (
                    <GameRow
                        key={game.gameId}
                        game={game}
                        teams={props.teams}
                        showWeather={props.showFutureWeather || game.startTime !== null}
                        predictedAwayPitcher={predictedPitchers.away}
                        predictedHomePitcher={predictedPitchers.home}
                    />
                );
            })}
        </>
    );
};
