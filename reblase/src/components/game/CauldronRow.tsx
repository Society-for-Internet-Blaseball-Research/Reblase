import React, { useEffect, useRef } from "react";
import { BlaseballTeam, BlaseballPlayer, CauldronGameEvent } from "blaseball-lib/models";
import { Timestamp } from "./UpdateRow"
import Emoji from "../elements/Emoji";
import { Circles } from "../elements/Circles";
import { CauldronEvent } from "blaseball-lib/chronicler";
import BaseDisplay from "../elements/BaseDisplay";

const ScoreGrid = "col-start-2 col-end-2 lg:col-start-2 lg:col-end-2";
const EventTypeGrid = "col-start-3 col-end-3 lg:col-start-3 lg:col-end-3";
const EventTextGrid = "col-start-4 col-end-4 justify-self-start lg:col-start-4 lg:col-end-4 lg:justify-self-start row-span-2";
const BatterGrid = "col-start-5 col-end-5 justify-self-end lg:col-start-5 lg:col-end-5 lg:justify-self-end";
const AtBatGrid = "col-start-3 col-end-5 justify-self-end lg:col-start-5 lg:col-end-5";
const LinkGrid = "hidden lg:block lg:col-start-6 lg:col-end-6";

interface PlayerTeamUpdateProps {
    evt: CauldronGameEvent;
    teams: BlaseballTeam[];
    players: BlaseballPlayer[];
}

interface SimpleUpdateProps {
    evt: CauldronGameEvent;
}

function EventText({evt} : SimpleUpdateProps) {
    
    return (
        <span className={`${EventTextGrid}`}>
            {evt.event_text.map((s) => <p>{s}</p>)}
        </span>
    )
}

function Score({ evt }: SimpleUpdateProps) {
    return (
        <span className={`${ScoreGrid} tag font-semibold bg-gray-200`}>{`${evt.away_score} - ${evt.home_score}`}</span>
    );
}

function Batter({ evt, teams, players }: PlayerTeamUpdateProps) {
    const player = players.find(x => x.id === evt.batter_id)?.name;
    const team = teams.find(x => x.id === evt.batter_team_id) ?? teams[0];

    if (!player)
        // "hide" when there's no batter
        return <span className={`${BatterGrid}`} />;

    return (
        <span className={`${BatterGrid} text-sm bg-gray-200 rounded px-2 py-1 inline-flex items-center justify-center`}>
            <Emoji emoji={team.emoji} />
            <span className="ml-1">{player}</span>
        </span>
    );
}

function EventType({evt}:SimpleUpdateProps) {
    return (
        <span className={`${EventTypeGrid} font-semibold`}>
            {evt.event_type}
        </span>
        );
}

const Outs = ({ evt }: SimpleUpdateProps) => <Circles label="Outs" amount={evt.outs_before_play} total={2} />;
function AtBatInfo({ evt, players, teams }: PlayerTeamUpdateProps) {
    return (
        <div className={`${AtBatGrid} flex flex-row items-center space-x-2`}>
            <BlaseRunners evt={evt} players={players} teams={teams} />
            <span className="flex space-x-1">
                <Outs evt={evt} />
            </span>
        </div>
    );
}
function BlaseRunners({ evt, players, teams }: PlayerTeamUpdateProps) {
    if(!players || !teams)
        return <p/>;

    const basesIncludingHome = (evt.top_of_inning ? evt.away_base_count : evt.home_base_count) ?? 4;

    let basesOccupiedBefore = [];
    let baseRunnerNamesBefore = [];

    let basesOccupiedAfter = [];
    let baseRunnerNamesAfter = [];

    for(const runner of evt.base_runners)
    {
        let name = players.find(x => x.id === runner.runner_id)?.name ?? "Error";
        if(runner.base_before_play > 0)
        {
            basesOccupiedBefore.push(runner.base_before_play-1);
            baseRunnerNamesBefore.push(name);
        }
        if(runner.base_after_play < basesIncludingHome)
        {
            basesOccupiedAfter.push(runner.base_after_play-1);
            baseRunnerNamesAfter.push(name);
        }
    }

    return (
        <span className="flex space-x-1">
            <BaseDisplay
                basesOccupied={basesOccupiedBefore}
                baseRunnerNames={baseRunnerNamesBefore}
                totalBases={basesIncludingHome - 1}
            />
            🡆
            <BaseDisplay
                basesOccupied={basesOccupiedAfter}
                baseRunnerNames={baseRunnerNamesAfter}
                totalBases={basesIncludingHome - 1}
            />
        </span>
    );
}

interface CauldronRowParams {
    item: CauldronGameEvent;
    teams: BlaseballTeam[];
    players: BlaseballPlayer[];
}

export function CauldronRow({item, teams, players} : CauldronRowParams) {
    const row = item;
    
    return (
        <div
            className="grid grid-rows-2 grid-flow-row-dense gap-2 items-center px-2 py-2 border-b border-gray-300"
            style={{gridTemplateColumns: "auto auto 150px 1fr" }}
        >
            <Timestamp timestamp={row.perceived_at}/>
            <Score evt={item} />
            <EventType evt={item}/>
            <EventText evt={row} />
            <Batter evt={item} teams={teams} players={players} />
            <AtBatInfo evt={item} teams={teams} players={players}/>
        </div>);
}
