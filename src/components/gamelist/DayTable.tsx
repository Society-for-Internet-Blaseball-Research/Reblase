import dayjs from "dayjs";
import React from "react";
import { ChronGame } from "../../blaseball/chronicler";

import "./DayTable.css";
import GameRow from "./GameRow";

interface DayTableProps {
    games: ChronGame[];
    season: number;
    day: number;
    showFutureWeather: boolean;
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

            {props.games.map((game) => (
                <GameRow
                    key={game.gameId}
                    game={game}
                    showWeather={props.showFutureWeather || game.startTime !== null}
                />
            ))}
        </>
    );
};
