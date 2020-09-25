import {Link} from "react-router-dom";
import React from "react";
import {Game} from "../blaseball/game";
import {getWeather} from "../blaseball/weather";
import {getTeam, TeamInfo} from "../blaseball/team";
import {getOutcomes} from "../blaseball/outcome";
import dayjs from "dayjs";
import Emoji from "./Emoji";
import Tooltip from "rc-tooltip";

interface GameProps {
    game: Game;
}


const WeatherGrid = "col-start-3 justify-self-end";
const ScoreGrid = "col-start-4 justify-self-end";
const InningGrid = "col-start-3 justify-self-end";
const DurationGrid = "col-start-4";
const AwayTeamGrid = "col-start-1";
const HomeTeamGrid = "col-start-1";
const EventsGrid = "col-start-2 justify-self-end";
const DividerGrid = "col-start-1 col-end-5";

const Weather = (props: GameProps) => {
    const evt = props.game.lastUpdate;
    
    const weather = getWeather(evt);
    if (!weather)
        return <pre>{evt.weather}</pre>;

    return (
        <span className={`${WeatherGrid} text-center`}>
            <Tooltip placement="top" overlay={<span>{weather.name}</span>}>
                <span>
                    <Emoji emoji={weather.emoji}/>
                </span>
            </Tooltip>
        </span>
    );
};

const Score = (props: GameProps) => {
    const evt = props.game.lastUpdate;
    
    let color = "bg-green-200 text-green-800";
    if (evt.shame)
        color = "bg-purple-200 text-purple-800"
    else if (evt.gameComplete)
        color = "bg-gray-200"; 
    
    return (
        <Link className={ScoreGrid} to={`/game/${props.game.id}`}>
            <span className={`tag font-semibold w-16 ${color}`}>
                {`${evt.awayScore} - ${evt.homeScore}`}
            </span>
        </Link>
    )
}

const Inning = (props: GameProps) => {
    const evt = props.game.lastUpdate;
    const arrow = evt.topOfInning ? "\u25B2" : "\u25BC";
    return (
        <span className={`${InningGrid} text-sm font-semibold text-right w-8 mr-1 leading-6`}>
            {evt.inning+1} {arrow}
        </span>
    )
};

const Duration = (props: GameProps) => {
    let content = "LIVE";
    if (props.game.start && props.game.end) {
        const startMoment = dayjs(props.game.start);
        const endMoment = dayjs(props.game.end);
        const diff = endMoment.diff(startMoment);

        content = dayjs()
            .hour(0).minute(0).second(0)
            .millisecond(diff).format("H:mm:ss");
    }
    
    return (
        <Link className={`${DurationGrid} w-16 text-center text-xs font-semibold`} to={`/game/${props.game.id}`} >
            <span className="">
                {content}
            </span>
        </Link>
    );
}

function Team({team, otherTeam, className}: {team: TeamInfo, otherTeam: TeamInfo, className: string}) {
    const weight = team.score > otherTeam.score ? "font-semibold" : "font-normal";
    return (
        <span className={`${className} ${weight}`}>
            <Emoji emoji={team.emoji} className={"mr-2"}/>
            <span>{team.nickname}</span>
        </span>
    );
}

const AwayTeam = (props: GameProps) =>
    <Team team={getTeam(props.game.lastUpdate, "away")} otherTeam={getTeam(props.game.lastUpdate, "home")} className={AwayTeamGrid} />;

const HomeTeam = (props: GameProps) =>
    <Team team={getTeam(props.game.lastUpdate, "home")} otherTeam={getTeam(props.game.lastUpdate, "away")} className={HomeTeamGrid} />;
    
const Events = (props: GameProps) => {
    const outcomes = getOutcomes(props.game.lastUpdate);
    if (!outcomes)
        return <></>;
    
    const style: Record<string, string> = {
        "red": "bg-red-200 text-red-800",
        "orange": "bg-orange-200 text-orange-800",
        "blue": "bg-blue-200 text-blue-800",
        "pink": "bg-pink-200 text-pink-800",
        "purple": "bg-purple-200 text-purple-800",
    };

    return (
        <span className={EventsGrid}>
            {outcomes.map((outcome, idx) => (
                <Tooltip key={idx} placement="top" overlay={<span>{outcome.text}</span>}>
                    <span className={`tag ml-2 ${style[outcome.color]}`}>
                        {outcome.emoji} {outcome.name}
                    </span>
                </Tooltip>
            ))}
        </span>
    );
};


const GameItem = ({game}: { game: Game }) => {
    return <div
        className="grid grid-flow-row-dense gap-x-2 items-center" 
        style={{gridTemplateColumns: "1fr auto auto auto"}}
    >
        <AwayTeam game={game} />
        <Score game={game} />
        <Weather game={game} />
        
        <HomeTeam game={game} />
        <Events game={game} />
        <Duration game={game} />
        <Inning game={game} />

        <div className={`${DividerGrid} my-2 border-b border-solid border-gray-300`} />
    </div>
};

interface DayTableProps {
    games: Game[];
    season: number;
    day: number;
}

export const DayTable = function DayTable(props: DayTableProps) {
    return (
        <div>
            <h3 className={"text-lg mb-1 font-semibold"}>Season <strong>{props.season}</strong>, Day <strong>{props.day}</strong></h3>

            <div className={"mb-6"}>
                {props.games.map(game => <GameItem key={game.id} game={game}/>)}
            </div>
        </div>
    )
};