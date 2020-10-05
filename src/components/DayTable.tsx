import React from "react";
import { ChronGame } from "../blaseball/chronicler";

import "./DayTable.css";
import GameRow from "./GameRow";

interface DayTableProps {
    games: ChronGame[];
    season: number;
    day: number;
    showFutureWeather: boolean;
}

export const DayTable = function DayTable(props: DayTableProps) {
    return (
        <>
            <h3 className="font-semibold mt-4 mb-2 mr-2">
                Season {props.season}, Day {props.day}
            </h3>

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
