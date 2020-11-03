import React, { ReactNode, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";

import { CauldronListFetching } from "../components/game/CauldronEventList";
import { cache } from "swr";
import Error from "../components/elements/Error";
import { useCauldronGameEvents, useGameUpdates } from "../blaseball/hooks";
import { BlaseballGame } from "blaseball-lib/models";
import { Link } from "react-router-dom";

interface PayloadProps {
    evt: BlaseballGame;
}

const GameHeading = ({ evt }: PayloadProps) => {
    const location = useLocation();

    const displaySeasonNumber = evt.season + 1;

    return (
        <>
            <p className="mb-2">
                <Link to={`/season/${displaySeasonNumber}`}>&larr; Back to Season {displaySeasonNumber}</Link>
            </p>
            <Link to={location.pathname}>
                <h2 className="text-3xl font-semibold">
                    Season {displaySeasonNumber}, Day {evt.day + 1}
                </h2>
                <h3>
                    <strong>{evt.awayTeamName}</strong>
                    <small> vs. </small>
                    <strong>{evt.homeTeamName}</strong>
                </h3>
            </Link>
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
export function CauldronPage() {
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
        gameId: gameId ?? "null",
        outcomes: true,
        baseRunners: true,
    };

    const { events, error } = useCauldronGameEvents(query);
    //const { updates, error, isLoading } = useGameUpdates(query, options.autoUpdate);
    if (error) return <Error>{error.toString()}</Error>;

     const last = events[events.length - 1];

    // TODO: components
    return (
        <div className="container mx-auto px-4">
            {/* {<GameHeading evt={last} />}

            <GamePageOptions options={options} setOptions={setOptions} gameComplete={last?.gameComplete ?? true} /> */}

            <CauldronListFetching
                events={events}
                order={options.reverse ? "desc" : "asc"}
            />
        </div>
    );
}
