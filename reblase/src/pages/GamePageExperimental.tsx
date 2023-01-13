import React, { ReactNode, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";

import { UpdatesListFetchingExperimental } from "../components/game/GameUpdateList";
import { cache } from "swr";
import Error from "../components/elements/Error";
import { useGameUpdatesExperimental } from "../blaseball/hooks";
import { BlaseballGameExperimental, BlaseballGameUpdateExperimental } from "blaseball-lib/models";
import { Link } from "react-router-dom";
import { displaySimAndSeasonPlaintext, displaySimSeasonAndDayPlaintext } from "blaseball-lib/games";
import { getWeather } from "blaseball-lib/weather";
import Twemoji from "components/elements/Twemoji";
import { Loading } from "components/elements/Loading";

interface PayloadProps {
    game: BlaseballGameExperimental,
}

const GameHeading = ({ game }: PayloadProps) => {
    const location = useLocation();
    const weather = getWeather(3000);

    return (
        <>
            <p className="mb-2">
                <Link to={`/experimental/season/1`}>
                    &larr; Back to {displaySimAndSeasonPlaintext(undefined, 0, null)}
                </Link>
            </p>
            <Link to={location.pathname}>
                <h2 className="text-3xl font-semibold">
                    {displaySimSeasonAndDayPlaintext(undefined, 0, game.day, null)}
                </h2>
            </Link>

            <h3 className="mb-2">
                <strong>{game.awayTeam.name}</strong>
                <small> vs. </small>
                <strong>{game.homeTeam.name}</strong>
            </h3>

            <p className="mb-2">
                <Twemoji emoji={weather.emoji} /> <strong>{weather.name}</strong>
            </p>
        </>
    );
};

interface GamePageOptions {
    reverse: boolean;
    autoUpdate: boolean;
    onlyImportant: boolean;
}

interface GamePageOptionsProps {
    options: GamePageOptions;
    setOptions: (opts: GamePageOptions) => void;
    gameComplete: boolean;
}

const CheckBox = (props: { value: boolean; onChange: (newValue: boolean) => void; children?: ReactNode }) => (
    <label className="block mr-4 text-md">
        <input
            className="mr-2 h-4 align-middle"
            type="checkbox"
            checked={props.value}
            onChange={(e) => props.onChange(e.target.checked)}
        />
        <span>{props.children}</span>
    </label>
);

const GamePageOptions = (props: GamePageOptionsProps) => {
    return (
        <div className="flex flex-row mt-2">
            <CheckBox
                value={props.options.reverse}
                onChange={(reverse) => props.setOptions({ ...props.options, reverse })}
            >
                Latest first
            </CheckBox>

            <CheckBox
                value={props.options.onlyImportant}
                onChange={(onlyImportant) => props.setOptions({ ...props.options, onlyImportant })}
            >
                Only important
            </CheckBox>

            {!props.gameComplete && (
                <CheckBox
                    value={props.options.autoUpdate}
                    onChange={(autoUpdate) => props.setOptions({ ...props.options, autoUpdate })}
                >
                    Live refresh
                </CheckBox>
            )}
        </div>
    );
};

type GamePageParams = { gameId?: string };
export function GamePageExperimental() {
    const { gameId } = useParams<GamePageParams>();

    // Never reuse caches across multiple games, then it feels slower because instant rerender...
    useEffect(() => cache.clear(), [gameId]);

    const [options, setOptions] = useState<GamePageOptions>({
        reverse: false,
        autoUpdate: false,
        onlyImportant: false,
    });

    if (options.autoUpdate && !options.reverse) setOptions({ ...options, reverse: true });

    const query = {
        id: gameId ?? "null",
    };
    const { firstGame, updates, error, isLoading } = useGameUpdatesExperimental(query, options.autoUpdate);
    if (error) return <Error>{error.toString()}</Error>;

    const last = updates[updates.length - 1];

    if (isLoading || !firstGame) return (<Loading></Loading>)

    // Stop autoupdating once the game is over
    if (last?.completed && options.autoUpdate) setOptions({ ...options, autoUpdate: false });

    const firstUpdate = updates[0];

    const helpMe: BlaseballGameUpdateExperimental = {
        ...firstGame,
        gameState: {...firstUpdate, step: 0, ballsNeeded: 4, strikesNeeded: 3, outsNeeded: 3, totalBases: 3},
        displayText: firstUpdate.displayText,
        displayTime: firstUpdate.displayTime,
        displayDelay: 0,
        displayOrder: 0,
    };

    return (
        <div className="container mx-auto px-4">
            {last && <GameHeading game={firstGame} />}

            <GamePageOptions
                options={options}
                setOptions={setOptions}
                gameComplete={last?.completed ?? true}
            />

            <UpdatesListFetchingExperimental
                game={helpMe}
                updates={updates}
                isLoading={isLoading || !firstGame}
                order={options.reverse ? "desc" : "asc"}
                filterImportant={options.onlyImportant}
                autoRefresh={options.autoUpdate}
            />
        </div>
    );
}
