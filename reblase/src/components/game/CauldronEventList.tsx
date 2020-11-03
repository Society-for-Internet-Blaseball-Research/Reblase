import React, { useMemo } from "react";
import { CauldronGameEvent, BlaseballTeam, BlaseballPlayer } from "blaseball-lib/models";
import { CauldronRow } from "./CauldronRow";
import Emoji from "../elements/Emoji";
import { getBattingTeam } from "blaseball-lib/games";

interface EventProps {
    teams: BlaseballTeam[];
    evt: CauldronGameEvent;
}

export function InningHeader(props: EventProps) {
    if(!props.teams || !props.evt)
        return <p/>;

    const arrow = props.evt.top_of_inning ? "\u25B2" : "\u25BC";
    const halfString = props.evt.top_of_inning ? "Top" : "Bottom";
    const pitchingTeamId = props.evt.pitcher_team_id;
    const battingTeamId = props.evt.batter_team_id;
    const pitchingTeam = props.teams.find(x => x.id === pitchingTeamId) ?? props.teams[0];
    const battingTeam = props.teams.find(x => x.id === battingTeamId) ?? props.teams[0];

    if(!pitchingTeam || !battingTeam)
        return <p/>;

    return (
        <div className="col-span-4 lg:col-span-5 mb-2 my-4">
            <h4 className="text-xl font-semibold">
                {arrow} {halfString} of {props.evt.inning + 1}
            </h4>

            <div className="text-sm">
                <strong>
                    <Emoji emoji={pitchingTeam.emoji} /> {pitchingTeam.fullName}
                </strong>{" "}
                fielding
            </div>

            <div className="text-sm">
                <strong>
                    <Emoji emoji={battingTeam.emoji} /> {battingTeam.fullName}
                </strong>{" "}
                batting
            </div>
        </div>
    );
}

type CauldronElement =
    | { type: "row"; event: CauldronGameEvent }
    | { type: "heading"; event: CauldronGameEvent, inning: number; top: boolean };

export function addInningHeaderRows(
    events: CauldronGameEvent[],
): CauldronElement[] {
    const elements: CauldronElement[] = [];

    let lastPayload = null;
    let lastHash = null;
    for (const event of events) {

        const payload = event;
        const row: CauldronElement = { type: "row", event };

        if (!lastPayload || lastPayload.inning !== payload.inning || lastPayload.top_of_inning !== payload.top_of_inning) {
            // New inning, add header
            const header: CauldronElement = { type: "heading", inning: payload.inning, top: payload.top_of_inning, event };
            elements.push(header);
        }

        // // Reorder accounting for the early pitching events we get
        // if (direction === "asc") {
        //     if (payload.lastevent.endsWith("batting.") && elements.length > 2) {
        //         const [heading, prevevent] = elements.splice(-2);
        //         elements.push(prevevent, heading);
        //     }
        // } else {
        //     if (elements.length > 3) {
        //         const [prevPrevevent, prevevent, heading] = elements.splice(-3);
        //         if (heading.type === "heading" && prevPrevevent.event.data.lastevent.endsWith("batting.")) {
        //             elements.push(prevPrevevent, heading, prevevent);
        //         } else {
        //             elements.push(prevPrevevent, prevevent, heading);
        //         }
        //     }
        // }

        // Add the row
        elements.push(row);

        lastPayload = payload;
    }

    return elements;
}



interface CauldronListFetchingProps {
    teams: BlaseballTeam[];
    players: BlaseballPlayer[];
    events: CauldronGameEvent[];
    order: "asc" | "desc";
}

export function CauldronListFetching({teams, players, events, order}: CauldronListFetchingProps) {
    return (
        <div className="flex flex-col mt-2">
            <CauldronEventList teams={teams} players={players} events={events} eventOrder={order} />
        </div>
    )
}

interface CauldronEventListProps {
    teams: BlaseballTeam[];
    players: BlaseballPlayer[];
    events: CauldronGameEvent[];
    eventOrder: "asc" | "desc";
}

export function CauldronEventList({teams, players, events, eventOrder}: CauldronEventListProps) {
    events = eventOrder === "desc" ? [...events].reverse() : events;

    const elements = addInningHeaderRows(events);

    return (
        <div className="flex flex-col">
            {elements.map((e) => {
                if(e.type == "heading")
                    return <InningHeader key={e.event.event_index+"_header"} teams={teams} evt={e.event} />
                else
                    return (<CauldronRow item={e.event} teams={teams} players={players} key={e.event.event_index}/>)
            })} 
        </div>
    )
}


