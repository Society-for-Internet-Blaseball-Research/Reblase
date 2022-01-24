import React, { ReactNode, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import Tooltip from "rc-tooltip";

import { UpdatesListFetching } from "../components/game/GameUpdateList";
import { cache } from "swr";
import Error from "../components/elements/Error";
import { useGameUpdates, useFeedSeasonList } from "../blaseball/hooks";
import { BlaseballFeedSeasonList, BlaseballGame } from "blaseball-lib/models";
import { Link } from "react-router-dom";
import { displaySimAndSeasonPlaintext, displaySimSeasonAndDayPlaintext, STATIC_ID } from "blaseball-lib/games";
import { getWeather } from "blaseball-lib/weather";
import Twemoji from "components/elements/Twemoji";

interface PayloadProps {
    evt: BlaseballGame;
    feedSeasonList?: BlaseballFeedSeasonList;
}

const GameHeading = ({ evt, feedSeasonList }: PayloadProps) => {
    const location = useLocation();
    const weather = getWeather(evt.weather);

    return (
        <>
            <p className="mb-2">
                <Link to={evt.sim ? `/season/${evt.season + 1}/${evt.sim}` : `/season/${evt.season + 1}`}>
                    &larr; Back to {displaySimAndSeasonPlaintext(evt.sim, evt.season, feedSeasonList)}
                </Link>
            </p>
            <Link to={location.pathname}>
                <h2 className="text-3xl font-semibold">
                    {displaySimSeasonAndDayPlaintext(evt.sim, evt.season, evt.day, feedSeasonList)}
                </h2>
            </Link>

            <h3 className="mb-2">
                <strong>{evt.awayTeamName}</strong>
                <small> vs. </small>
                <strong>{evt.homeTeamName}</strong>
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
    id: string;
    season: number;
    sim: string;
    timestamp: string;
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

            <a href={`https://www.blaseball.com/watch/${props.id}`}>
                <Tooltip placement="top" overlay={<span>View on Blaseball.com</span>}>
                    <Twemoji emoji={"\u{26BE}"} />
                </Tooltip>
            </a>

            {props.sim == STATIC_ID && (
                <a
                    href={`https://before.sibr.dev/_before/jump?redirect=%2Fleague&season=${props.season}&time=${props.timestamp}`}
                >
                    <Tooltip placement="top" overlay={<span>Remember Before?</span>}>
                        <Twemoji emoji={"\u{1FA78}"} />
                    </Tooltip>
                </a>
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
    const { feedSeasonList, error: feedSeasonError, isLoading: feedSeasonIsLoading } = useFeedSeasonList();
    if (error || feedSeasonError) return <Error>{error.toString() || feedSeasonError.toString()}</Error>;

    const first = updates[0];
    const last = updates[updates.length - 1]?.data;

    // Stop autoupdating once the game is over
    if (last?.gameComplete && options.autoUpdate) setOptions({ ...options, autoUpdate: false });

    return (
        <div className="container mx-auto px-4">
            {last && <GameHeading evt={last} feedSeasonList={feedSeasonList?.data} />}

            <GamePageOptions
                options={options}
                setOptions={setOptions}
                gameComplete={last?.gameComplete ?? true}
                id={gameId! ?? "null"}
                season={first?.data?.season}
                timestamp={first?.timestamp}
                sim={first?.data.sim ?? STATIC_ID}
            />

            <UpdatesListFetching
                updates={updates}
                isLoading={isLoading || feedSeasonIsLoading}
                order={options.reverse ? "desc" : "asc"}
                filterImportant={options.onlyImportant}
                autoRefresh={options.autoUpdate}
            />
        </div>
    );
}
