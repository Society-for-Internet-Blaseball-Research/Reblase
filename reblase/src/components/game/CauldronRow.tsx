import React, { useEffect, useRef } from "react";
import { BlaseballTeam, BlaseballPlayer, CauldronGameEvent } from "blaseball-lib/models";
import { Timestamp } from "./UpdateRow"
import Emoji from "../elements/Emoji";
import { Circles } from "../elements/Circles";
import { CauldronEvent } from "blaseball-lib/chronicler";
import BaseDisplay from "../elements/BaseDisplay";
import Tooltip from "rc-tooltip";

const ScoreGrid = "col-start-2 col-end-2 lg:col-start-2 lg:col-end-2";
const EventTypeGrid = "col-start-3 col-end-3 lg:col-start-3 lg:col-end-3";
const EventTextGrid = "col-start-4 col-end-4 justify-self-start lg:col-start-4 lg:col-end-4 lg:justify-self-start row-span-2";
const BatterGrid = "col-start-5 col-end-5 justify-self-end lg:col-start-5 lg:col-end-5 lg:justify-self-end";
const AtBatGrid = "col-start-3 col-end-5 justify-self-end lg:col-start-5 lg:col-end-5";
const JsonInfoGrid = "col-start-6 col-end-6 lg:col-start-6 lg:col-end-6";
const ErrorsGrid = "col-start-1 col-span-3 row-start-2";

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
        <span className={`text-sm ${EventTextGrid}`}>
            {evt.event_text.map((s,i) => <p key={i}>{s}</p>)}
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

    var display = evt.event_type.replace(/_/g, " ");

    return (
        <span className={`${EventTypeGrid} font-semibold`}>
            {display}
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

    const basesIncludingHome = (evt.top_of_inning ? evt.away_base_count+1 : evt.home_base_count+1) ?? 4;

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

interface JsonInfoProps extends PlayerTeamUpdateProps
{
    visible: boolean
}

interface JsonInfoState
{
    visible: boolean;
    info: string[];
}

class JsonInfo extends React.Component<JsonInfoProps, JsonInfoState> {
    constructor(props : JsonInfoProps) {
        super(props);
        
        let info:string[] = []
        let key: keyof CauldronGameEvent;
    
        for(key in props.evt)
        {
            if(key != "event_text" &&
                key != "base_runners" &&
                key != "additional_context"
            )
            {
                info.push(`${key}: ${props.evt[key]}`);
            }
        }
        info.sort();

        this.state = { visible: false, info: info };
    }

    toggle() {
        this.setState({
            visible: !this.state.visible
        });
    }
    
    render() {
        return (
        <div className={`${JsonInfoGrid} relative`}>
            <button className="btn btn-block" onClick={this.toggle.bind(this)}>🛈</button>
            <div className={`rounded w-auto z-50 absolute text-xs p-2 bg-gray-200 right-0 ${this.state.visible ? "block" :"hidden"}`}>
                {this.state.info.map(x => {
                    return <p key={x}>{x}</p>
                })}
            </div>
        </div>
        )
    }
}

interface ErrorProps {
    text: string
    type: string
}

function Error({text, type} : ErrorProps) {
    let color = "red";
    if(type === 'Fixed')
        color = "blue";

    return (
        <Tooltip placement="top" overlay={<span>{text}</span>}>
            <span className={`text-sm bg-${color}-200 rounded px-2 py-1 inline-flex items-center justify-center`}>
                {type}
            </span>
        </Tooltip>
    );
}

function Errors({evt} : SimpleUpdateProps) {
    if(!evt.parsing_error && !evt.fixed_error)
        return <div className={`${ErrorsGrid}`}/>;

    let allErrors = [];

    for(var err of evt.parsing_error_list)
    {
        allErrors.push({type:"Parsing", text:err});
    }
    for(var err of evt.fixed_error_list)
    {
        allErrors.push({type: "Fixed", text:err});
    }

    return (
    <div className={`${ErrorsGrid}`}>
        {
            allErrors.map((x,i) => {
                return <Error key={i} type={x.type} text={x.text}/>
            })
        }
    </div>
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
        <div>
            <div
                className="grid grid-rows-2 grid-flow-row-dense gap-2 items-center px-2 py-2 border-b border-gray-300"
                style={{gridTemplateColumns: "auto auto 150px 1fr" }}
            >
                <Timestamp timestamp={row.perceived_at}/>
                <Score evt={item} />
                <EventType evt={item}/>
                <Errors evt={item}/>
                <EventText evt={row} />
                <Batter evt={item} teams={teams} players={players} />
                <AtBatInfo evt={item} teams={teams} players={players}/>
                <JsonInfo evt={item} teams={teams} players={players} visible={true}/>
                
            </div>

        </div>);
}
