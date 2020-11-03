import React, { useEffect, useRef } from "react";
import { CauldronGameEvent } from "blaseball-lib/models";
import { Timestamp } from "./UpdateRow"

function EventText(props: { event : CauldronGameEvent}) {
    const row = props.event;
    
    return (
        <span className="col-start-3 col-end-3 lg:col-start-3 lg:col-end-3 row-span-2">
            {row.event_text.map((s) => <p>{s}</p>)}
        </span>
    )
}

export function CauldronRow(props: {item : CauldronGameEvent}) {
    const row = props.item;
    
    return (
        <div
            className="grid grid-rows-2 grid-flow-row-dense gap-2 items-center px-2 py-2 border-b border-gray-300"
            style={{gridTemplateColumns: "150px 150px 1fr" }}
        >
            <span className="col-start-1 col-end-1 lg:col-start-1 lg:col-end-1">{row.top_of_inning ? "Top of " : "Bottom of "}{row.inning+1}</span>
            <span className="col-start-2 col-end-2 lg:col-start-2 lg:col-end-2 font-semibold"> {row.event_type}</span>
            <EventText event={row}/>
            <Timestamp timestamp={row.perceived_at}/>
        </div>);
}
