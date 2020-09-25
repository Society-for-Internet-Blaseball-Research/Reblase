import {GamePayload, GameUpdate, isImportant} from "../blaseball/update";
import React, {useMemo} from "react";
import {UpdateRow} from "./UpdateRow";
import {getBattingTeam, getPitchingTeam} from "../blaseball/team";

import "../style/GamePage.css";
import Emoji from "./Emoji";

interface UpdateProps {
    evt: GamePayload
}

export const InningHeader = React.memo(function InningHeader(props: UpdateProps) {
    const arrow = props.evt.topOfInning ? "\u25B2" : "\u25BC";
    const halfString = props.evt.topOfInning ? "Top" : "Bottom";
    const pitchingTeam = getPitchingTeam(props.evt);
    const battingTeam = getBattingTeam(props.evt);

    return (
        <div className="col-span-4 lg:col-span-5 mb-2 my-4">
            <h4 className="text-xl font-semibold">{arrow} {halfString} of {props.evt.inning+1}</h4>
            
            <div className="text-sm">
                <strong><Emoji emoji={pitchingTeam.emoji} /> {pitchingTeam.name}</strong> fielding, with <strong>{pitchingTeam.pitcherName}</strong> pitching
            </div>
            
            <div className="text-sm">
                <strong><Emoji emoji={battingTeam.emoji} /> {battingTeam.name}</strong> batting
            </div>
        </div>
    );
});

interface GameUpdateListProps {
    updates: GameUpdate[];
    updateOrder: "asc" | "desc";
    filterImportant: boolean;
}

type Element = { type: "row", update: GameUpdate } | { type: "heading", update: GameUpdate, inning: number, top: boolean };

function groupByInning(updates: GameUpdate[], direction: "asc" | "desc", filterImportant: boolean): Element[] {
    const elements: Element[] = [];

    let lastPayload = null;
    for (const update of updates) {
        const payload = update.payload;
        const row: Element = {type: "row", update};
        
        if (filterImportant && !isImportant(payload))
            continue;

        if (!lastPayload || lastPayload.inning != payload.inning || lastPayload.topOfInning != payload.topOfInning) {
            // New inning, add header
            const header: Element = { type: "heading", inning: payload.inning, top: payload.topOfInning, update };
            elements.push(header);
        }
        
        // Reorder accounting for the early pitching updates we get
        if (direction == "asc") {
            if (payload.lastUpdate.endsWith("batting.") && elements.length > 2) {
                const [heading, prevUpdate] = elements.splice(-2);
                elements.push(prevUpdate, heading);
            }
        } else {
            if (elements.length > 3) {
                const [prevPrevUpdate, prevUpdate, heading] = elements.splice(-3);
                if (heading.type === "heading" && prevPrevUpdate.update.payload.lastUpdate.endsWith("batting.")) {
                    elements.push(prevPrevUpdate, heading, prevUpdate);
                } else {
                    elements.push(prevPrevUpdate, prevUpdate, heading);
                }
            }
        }
        
        // Add the row
        elements.push(row);

        lastPayload = payload;
    }

    return elements;
}

export function GameUpdateList(props: GameUpdateListProps) {
    const updates = props.updateOrder === "desc"
        ? [...props.updates].reverse()
        : props.updates;

    const elements = useMemo(
        () => groupByInning(updates, props.updateOrder, props.filterImportant), 
        [updates, props.updateOrder, props.filterImportant]);
    
    return (
        <div className="grid grid-flow-row-dense gap-2 items-center" style={{gridTemplateColumns: "auto auto 1fr"}}>
            {elements.map(elem => {
                if (elem.type === "row")
                    return <UpdateRow key={elem.update.id + "_update"} update={elem.update} />;
                else
                    return <InningHeader key={elem.update.id + "_heading"} evt={elem.update.payload} />;
            })}
        </div>
    );
}