import { Baserunner, ReblaseGame, ReblaseGameUpdate } from "../game";
import Bases from "./Bases";
import Circles from "./Circles";

export interface GameUpdateRowProps {
    game: ReblaseGame;
    update: ReblaseGameUpdate;
}

function GameUpdateRow({ game, update }: GameUpdateRowProps) {
    const battingTeam = update.top ? game.awayTeam : game.homeTeam;

    return (
        <tr role="row" className="UpdateRow">
            <GameTimeCell time={update.time} />
            <GameScoreCell away={update.awayScore} home={update.homeScore} />
            <GameLogCell text={update.text} />
            {update.batterName && <GameBatterCell emoji={battingTeam.emoji} name={update.batterName} />}
            <GameBasesCell runners={update.runners} maxBases={battingTeam.maxBalls} />
            <GameStateCell
                balls={update.balls}
                maxBalls={battingTeam.maxBalls}
                strikes={update.strikes}
                maxStrikes={battingTeam.maxStrikes}
                outs={update.outs}
                maxOuts={battingTeam.maxOuts}
            />
        </tr>
    );
}

function GameTimeCell(props: { time?: string }) {
    return (
        <td role="cell" className="time">
            xx:yy
        </td>
    );
}

function GameScoreCell(props: { away: number; home: number }) {
    return (
        <td role="cell" className="score">
            <span>
                {props.away} - {props.home}
            </span>
        </td>
    );
}

function GameBatterCell(props: { name: string; emoji: string }) {
    return (
        <td role="cell" className="batter">
            <span>
                {props.emoji} {props.name}
            </span>
        </td>
    );
}

function GameLogCell(props: { text: string }) {
    return (
        <td role="cell" className="log">
            <span>{props.text}</span>
        </td>
    );
}

function getBaseName(baseNumber: number): string {
    if (baseNumber === 0) return "first";
    if (baseNumber === 1) return "second";
    if (baseNumber === 2) return "third";
    if (baseNumber === 3) return "fourth";
    return "some base";
}

function createBaseLabel(runners: Baserunner[]): string {
    if (runners.length === 0) return "No runners on base";
    if (runners.length === 1) return `Runner on ${getBaseName(runners[0].base)}`;
    return `Runners on ${runners.map((r) => getBaseName(r.base)).join(", ")}`;
}

function GameBasesCell(props: { runners: Baserunner[]; maxBases: number }) {
    return (
        <td role="cell" aria-label={createBaseLabel(props.runners)} className="bases">
            <Bases runners={props.runners} maxBases={props.maxBases - 1} />
        </td>
    );
}

function GameStateCell(props: {
    balls: number;
    maxBalls: number;
    strikes: number;
    maxStrikes: number;
    outs: number;
    maxOuts: number;
}) {
    return (
        <td role="cell" className="state">
            <Circles amount={props.balls} total={props.maxBalls - 1} label="Balls" />
            <Circles amount={props.strikes} total={props.maxStrikes - 1} label="Strikes" />
            <Circles amount={props.outs} total={props.maxOuts - 1} label="Outs" />
        </td>
    );
}

export default GameUpdateRow;
