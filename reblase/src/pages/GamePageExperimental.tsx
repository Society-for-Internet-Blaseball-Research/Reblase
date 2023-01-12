import React, { ReactNode, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";

import { UpdatesListFetchingExperimental } from "../components/game/GameUpdateList";
import { cache } from "swr";
import Error from "../components/elements/Error";
import { useGameUpdatesExperimental } from "../blaseball/hooks";
import { BlaseballGameUpdateExperimental } from "blaseball-lib/models";
import { Link } from "react-router-dom";
import { displaySimAndSeasonPlaintext, displaySimSeasonAndDayPlaintext } from "blaseball-lib/games";
import { getWeather } from "blaseball-lib/weather";
import Twemoji from "components/elements/Twemoji";

interface PayloadProps {
    evt: BlaseballGameUpdateExperimental;
}

const GameHeading = ({ evt }: PayloadProps) => {
    const location = useLocation();
    const weather = getWeather(3000);

    return (
        <>
            <p className="mb-2">
                <Link to={`/experimental/season/1`}>
                    &larr; Back to {displaySimAndSeasonPlaintext(undefined, 1, null)}
                </Link>
            </p>
            <Link to={location.pathname}>
                <h2 className="text-3xl font-semibold">
                    {displaySimSeasonAndDayPlaintext(undefined, 1, evt.day, null)}
                </h2>
            </Link>

            <h3 className="mb-2">
                <strong>{evt.awayTeam.name}</strong>
                <small> vs. </small>
                <strong>{evt.homeTeam.name}</strong>
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
    const { updates, error, isLoading } = useGameUpdatesExperimental(query, options.autoUpdate);
    if (error) return <Error>{error.toString()}</Error>;

    const last = updates[updates.length - 1];

    // Stop autoupdating once the game is over
    if (last?.completed && options.autoUpdate) setOptions({ ...options, autoUpdate: false });

    return (
        <div className="container mx-auto px-4">
            {last && <GameHeading evt={last} />}

            <GamePageOptions
                options={options}
                setOptions={setOptions}
                gameComplete={last?.completed ?? true}
            />

            <UpdatesListFetchingExperimental
                updates={updates}
                isLoading={isLoading}
                order={options.reverse ? "desc" : "asc"}
                filterImportant={options.onlyImportant}
                autoRefresh={options.autoUpdate}
            />
        </div>
    );
}
