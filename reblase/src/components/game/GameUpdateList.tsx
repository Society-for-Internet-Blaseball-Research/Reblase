import {
    isGameUpdateImportant,
    getBattingTeam,
    getPitchingTeam,
    getBattingTeamExperimental,
    getPitchingTeamExperimental,
} from "blaseball-lib/games";
import React, { useMemo } from "react";
import { UpdateRow } from "./UpdateRow";
import { UpdateRowExperimental } from "./UpdateRowExperimental";

import "../../style/GamePage.css";
import { ChronFightUpdate, ChronGameUpdate } from "blaseball-lib/chronicler";
import { BlaseballGame, BlaseballGameUpdateExperimental, CompositeGameState } from "blaseball-lib/models";
import Spinner from "components/elements/Spinner";
import { Loading } from "components/elements/Loading";
import Twemoji from "components/elements/Twemoji";
import dayjs from "dayjs";

type GameOrFight = ChronFightUpdate | ChronGameUpdate;

interface UpdatesListFetchingProps {
    isLoading: boolean;
    updates: GameOrFight[];
    order: "asc" | "desc";
    filterImportant: boolean;
    autoRefresh: boolean;
}

export function UpdatesListFetching(props: UpdatesListFetchingProps) {
    return (
        <div className="flex flex-col mt-2">
            {props.autoRefresh && (
                <span className="italic text-gray-600 dark:text-gray-400">
                    <Spinner /> Live-updating...
                </span>
            )}

            <GameUpdateList updates={props.updates} updateOrder={props.order} filterImportant={props.filterImportant} />

            {props.isLoading && <Loading />}
        </div>
    );
}

interface UpdatesListFetchingExperimentalProps {
    isLoading: boolean;
    game: BlaseballGameUpdateExperimental;
    updates: CompositeGameState[];
    order: "asc" | "desc";
    filterImportant: boolean;
    autoRefresh: boolean;
}

export function UpdatesListFetchingExperimental(props: UpdatesListFetchingExperimentalProps) {
    return (
        <div className="flex flex-col mt-2">
            {props.autoRefresh && (
                <span className="italic text-gray-600 dark:text-gray-400">
                    <Spinner /> Live-updating...
                </span>
            )}

            <GameUpdateListExperimental
                firstGame={props.game}
                updates={props.updates}
                updateOrder={props.order}
                filterImportant={props.filterImportant}
            />

            {props.isLoading && <Loading />}
        </div>
    );
}

interface UpdateProps {
    evt: BlaseballGame;
}

export const InningHeader = React.memo(function InningHeader(props: UpdateProps) {
    const arrow = props.evt.topOfInning ? "\u25B2" : "\u25BC";
    const halfString = props.evt.topOfInning ? "Top" : "Bottom";
    const pitchingTeam = getPitchingTeam(props.evt);
    const battingTeam = getBattingTeam(props.evt);

    return (
        <div className="col-span-4 lg:col-span-5 mb-2 my-4">
            <h4 className="text-xl font-semibold">
                {arrow} {halfString} of {props.evt.inning + 1}
            </h4>

            <div className="text-sm">
                <strong>
                    <Twemoji emoji={pitchingTeam.emoji} /> {pitchingTeam.name}
                </strong>{" "}
                fielding, with <strong>{pitchingTeam.pitcherName}</strong> pitching
            </div>

            <div className="text-sm">
                <strong>
                    <Twemoji emoji={battingTeam.emoji} /> {battingTeam.name}
                </strong>{" "}
                batting
            </div>
        </div>
    );
});

interface UpdateExperimentalProps {
    first: BlaseballGameUpdateExperimental;
    evt: CompositeGameState;
}

export const InningHeaderExperimental = React.memo(function InningHeaderExperimental(props: UpdateExperimentalProps) {
    const arrow = props.evt.topOfInning ? "\u25B2" : "\u25BC";
    const halfString = props.evt.topOfInning ? "Top" : "Bottom";
    const pitchingTeam = getPitchingTeamExperimental(props.first);
    const battingTeam = getBattingTeamExperimental(props.first);

    return (
        <div className="col-span-4 lg:col-span-5 mb-2 my-4">
            <h4 className="text-xl font-semibold">
                {arrow} {halfString} of {props.evt.inning + 1}
            </h4>

            <div className="text-sm">
                <strong>
                    <Twemoji emoji={pitchingTeam.emoji} /> {pitchingTeam.name}
                </strong>{" "}
                fielding, with <strong>{pitchingTeam.pitcherName}</strong> pitching
            </div>

            <div className="text-sm">
                <strong>
                    <Twemoji emoji={battingTeam.emoji} /> {battingTeam.name}
                </strong>{" "}
                batting
            </div>
        </div>
    );
});

type Element =
    | { type: "row"; update: GameOrFight }
    | { type: "heading"; update: GameOrFight; inning: number; top: boolean };

export function addInningHeaderRows(
    updates: GameOrFight[],
    direction: "asc" | "desc",
    filterImportant: boolean
): Element[] {
    const elements: Element[] = [];

    let lastInning = -1;
    let lastTopOfInning = true;
    let lastHash = null;
    for (const update of updates) {
        // Basic dedupe
        if (lastHash === update.hash) continue;

        const payload = update.data;
        const row: Element = { type: "row", update };

        if (filterImportant && !isGameUpdateImportant(payload.lastUpdate, payload.scoreUpdate)) continue;

        const isNewHalfInning = lastInning !== payload.inning || lastTopOfInning !== payload.topOfInning;
        if (isNewHalfInning && payload.inning > -1) {
            // New inning, add header
            const header: Element = { type: "heading", inning: payload.inning, top: payload.topOfInning, update };

            // We're skipping "inning 0" so if this is the inning 1 header, "push" it before the first events
            if (payload.inning === 0 && payload.topOfInning && direction == "asc") {
                elements.unshift(header);
            } else {
                elements.push(header);
            }
        }

        // Reorder accounting for the early pitching updates we get
        // This was fixed in Season 12 (iirc??)
        if (update.data.season < 11) {
            if (direction === "asc") {
                if (payload.lastUpdate.endsWith("batting.") && elements.length > 2) {
                    const [heading, prevUpdate] = elements.splice(-2);
                    elements.push(prevUpdate, heading);
                }
            } else {
                if (elements.length > 3) {
                    const [prevPrevUpdate, prevUpdate, heading] = elements.splice(-3);
                    if (heading.type === "heading" && prevPrevUpdate.update.data.lastUpdate.endsWith("batting.")) {
                        elements.push(prevPrevUpdate, heading, prevUpdate);
                    } else {
                        elements.push(prevPrevUpdate, prevUpdate, heading);
                    }
                }
            }
        }

        // Add the row
        elements.push(row);

        if (payload.inning !== -1) {
            lastInning = payload.inning;
            lastTopOfInning = payload.topOfInning;
        }
        lastHash = update.hash;
    }

    return elements;
}

type ElementExperimental =
    | { type: "row"; update: CompositeGameState }
    | { type: "heading"; update: CompositeGameState; inning: number; top: boolean };

export function addInningHeaderRowsExperimental(
    updates: CompositeGameState[],
    direction: "asc" | "desc",
    filterImportant: boolean
): ElementExperimental[] {
    const elements: ElementExperimental[] = [];

    let lastInning = -1;
    let lastTopOfInning = true;
    let lastDisplayText = "";
    let lastDisplayOrder = 0;

    for (const update of updates) {
        const gameState = update;
        const row: ElementExperimental = { type: "row", update };

        if (!update.displayText) continue;
        if (lastDisplayText == update.displayText && lastDisplayOrder === update.displayOrder) continue;
        lastDisplayText = update.displayText;
        lastDisplayOrder = update.displayOrder;

        if (filterImportant && !isGameUpdateImportant(update.displayText, null)) continue;

        console.log(
            update,
            "lastInning=",
            lastInning,
            "isTopOfInning",
            update.topOfInning
        );

        const isNewHalfInning = lastInning !== gameState.inning || lastTopOfInning !== gameState.topOfInning;
        if (isNewHalfInning && gameState.inning > -1) {
            // New inning, add header
            const header: ElementExperimental = {
                type: "heading",
                inning: gameState.inning,
                top: gameState.topOfInning,
                update,
            };

            // We're skipping "inning 0" so if this is the inning 1 header, "push" it before the first events
            if (gameState.inning === 0 && gameState.topOfInning && direction == "asc") {
                elements.unshift(header);
            } else {
                elements.push(header);
            }
        }

        // Add the row
        elements.push(row);

        if (gameState.inning !== -1) {
            lastInning = gameState.inning;
            lastTopOfInning = gameState.topOfInning;
        }
    }

    return elements;
}

export interface SecondaryUpdate<T> {
    data: T;
    timestamp: string;
}

interface GameUpdateListProps<TSecondary> {
    updates: GameOrFight[];
    updateOrder: "asc" | "desc";
    filterImportant: boolean;
    secondaryUpdates?: SecondaryUpdate<TSecondary>[];
    renderSecondary?: (update: SecondaryUpdate<TSecondary>) => React.ReactNode;
}

type Group<TSecondary> = { firstUpdate: GameOrFight; updates: GroupValue<TSecondary>[] };

type GroupValue<TSecondary> =
    | { type: "primary"; data: GameOrFight }
    | { type: "secondary"; data: SecondaryUpdate<TSecondary> };
export function GameUpdateList<TSecondary = undefined>(props: GameUpdateListProps<TSecondary>) {
    const updates = [...props.updates];

    // Season 11+ has a "playCount" property we can use for proper ordering
    // Otherwise, .sort is stable and it'll keep existing order
    updates.sort((a, b) => (a.data.playCount ?? -1) - (b.data.playCount ?? -1));

    if (props.updateOrder === "desc") updates.reverse();

    const elements = useMemo(
        () => addInningHeaderRows(updates, props.updateOrder, props.filterImportant),
        [updates, props.updateOrder, props.filterImportant]
    );

    const grouped = [];
    let lastGroup: Group<TSecondary> | null = null;

    for (const elem of elements) {
        if (elem.type === "heading") {
            lastGroup = {
                firstUpdate: elem.update,
                updates: [] as GroupValue<TSecondary>[],
            };
            grouped.push(lastGroup);
        } else {
            lastGroup!.updates.push({ type: "primary", data: elem.update });
        }
    }

    if (props.secondaryUpdates) {
        const remaining = [...props.secondaryUpdates] as SecondaryUpdate<TSecondary>[];
        for (const group of grouped) {
            for (let i = 0; i < group.updates.length; i++) {
                const firstRemaining = remaining[0];
                if (!firstRemaining) break;

                const at = group.updates[i];
                const timestamp = (at.data as ChronGameUpdate)?.timestamp ?? (at.data as ChronFightUpdate).validFrom;

                if (at.type === "primary" && firstRemaining.timestamp < timestamp) {
                    group.updates.splice(i, 0, { type: "secondary", data: remaining.shift()! });
                }
            }
        }

        lastGroup!.updates.push(...remaining.map((d) => ({ type: "secondary" as const, data: d })));
    }

    const scrollTarget = window.location.hash.replace("#", "");

    return (
        <div className="flex flex-col">
            {grouped
                .filter((g) => g.updates.length > 0)
                .map((group) => (
                    <div key={group.firstUpdate.hash + "_group"}>
                        <InningHeader key={group.firstUpdate.hash + "_heading"} evt={group.firstUpdate.data} />
                        <div className="flex flex-col">
                            {group.updates.map((update) => {
                                if (update.type === "primary") {
                                    const highlight = update.data.hash === scrollTarget;
                                    return (
                                        <UpdateRow
                                            key={update.data.hash + "_update"}
                                            update={update.data}
                                            highlight={highlight}
                                        />
                                    );
                                } else if (props.renderSecondary) {
                                    return props.renderSecondary(update.data);
                                } else {
                                    return null;
                                }
                            })}
                        </div>
                    </div>
                ))}
        </div>
    );
}

interface GameUpdateListExperimentalProps {
    firstGame: BlaseballGameUpdateExperimental;
    updates: CompositeGameState[];
    updateOrder: "asc" | "desc";
    filterImportant: boolean;
}

type GroupExperimental = { firstUpdate: CompositeGameState; updates: CompositeGameState[] };

export function GameUpdateListExperimental(props: GameUpdateListExperimentalProps) {
    const updates = [...props.updates];

    updates.sort((a, b) => a.displayOrder - b.displayOrder);

    if (props.updateOrder === "desc") updates.reverse();

    const elements = useMemo(
        () => addInningHeaderRowsExperimental(updates, props.updateOrder, props.filterImportant),
        [updates, props.updateOrder, props.filterImportant]
    );

    const grouped = [];
    let lastGroup: GroupExperimental | null = null;

    for (const elem of elements) {
        if (elem.type === "heading") {
            lastGroup = {
                firstUpdate: elem.update,
                updates: [] as CompositeGameState[],
            };
            grouped.push(lastGroup);
        } else {
            lastGroup!.updates.push(elem.update);
        }
    }

    const scrollTarget = window.location.hash.replace("#", "");

    return (
        <div className="flex flex-col">
            {grouped
                .filter((g) => g.updates.length > 0)
                .map((group) => (
                    <div>
                        <InningHeaderExperimental first={props.firstGame} evt={group.firstUpdate} />
                        <div className="flex flex-col">
                            {group.updates.map((update) => {
                                const highlight = update.displayTime === scrollTarget;
                                return (
                                    <UpdateRowExperimental game={props.firstGame} evt={update} highlight={highlight} />
                                );
                            })}
                        </div>
                    </div>
                ))}
        </div>
    );
}
