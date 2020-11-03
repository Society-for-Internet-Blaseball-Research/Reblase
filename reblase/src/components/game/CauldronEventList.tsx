import React, { useMemo } from "react";
import { CauldronGameEvent } from "blaseball-lib/models";
import { CauldronRow } from "./CauldronRow";

interface CauldronListFetchingProps {
    events: CauldronGameEvent[];
    order: "asc" | "desc";
}

export function CauldronListFetching(props: CauldronListFetchingProps) {
    return (
        <div className="flex flex-col mt-2">
            <CauldronEventList events={props.events} eventOrder={props.order} />
        </div>
    )
}

interface CauldronEventListProps {
    events: CauldronGameEvent[];
    eventOrder: "asc" | "desc";
}

export function CauldronEventList(props: CauldronEventListProps) {
    const events = props.eventOrder === "desc" ? [...props.events].reverse() : props.events;

    return (
        <div className="flex flex-col">
            {events.map((e) => {
                return (<CauldronRow item={e}/>)
            })} 
        </div>
    )
}
