import React, { ReactNode, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";

import { Loading } from "../components/elements/Loading";
import { GameUpdateList } from "../components/game/GameUpdateList";
import { cache } from "swr";
import Spinner from "../components/elements/Spinner";
import Error from "../components/elements/Error";
import { useGameUpdates } from "../blaseball/hooks";
import { ChronGameUpdate } from "../blaseball/chronicler";
import { BlaseGame } from "../blaseball/models";
import { Link } from "react-router-dom";

interface UpdatesListFetchingProps {
    isLoading: boolean;
    updates: ChronGameUpdate[];
    order: "asc" | "desc";
    filterImportant: boolean;
    autoRefresh: boolean;
}

function UpdatesListFetching(props: UpdatesListFetchingProps) {
    return (
        <div className="flex flex-col mt-2">
            {props.autoRefresh && (
                <span className="italic text-gray-600">
                    <Spinner /> Live-updating...
                </span>
            )}

            <GameUpdateList updates={props.updates} updateOrder={props.order} filterImportant={props.filterImportant} />

            {props.isLoading && <Loading />}
        </div>
    );
}

interface PayloadProps {
    evt: BlaseGame;
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
export function GamePage() {
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
        game: gameId ?? "null",
        started: true,
    };
    const { updates, error, isLoading } = useGameUpdates(query, options.autoUpdate);
    if (error) return <Error>{error.toString()}</Error>;

    const last = updates[updates.length - 1]?.data;

    // Stop autoupdating once the game is over
    if (last?.gameComplete && options.autoUpdate) setOptions({ ...options, autoUpdate: false });

    return (
        <div className="container mx-auto px-4">
            {last && <GameHeading evt={last} />}

            <GamePageOptions options={options} setOptions={setOptions} gameComplete={last?.gameComplete ?? true} />

            <UpdatesListFetching
                updates={updates}
                isLoading={isLoading}
                order={options.reverse ? "desc" : "asc"}
                filterImportant={options.onlyImportant}
                autoRefresh={options.autoUpdate}
            />
        </div>
    );
}
