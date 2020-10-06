import { isImportant } from "../../blaseball/update";
import { getBattingTeam } from "../../blaseball/team";
import { Circles } from "../elements/Circles";
import React from "react";
import dayjs from "dayjs";
import Emoji from "../elements/Emoji";
import { BlaseGame } from "../../blaseball/models";
import { ChronGameUpdate } from "../../blaseball/chronicler";
import BaseDisplay from "../elements/BaseDisplay";

interface WrappedUpdateProps {
    update: ChronGameUpdate;
}

interface UpdateProps {
    evt: BlaseGame;
}

const TimestampGrid = "col-start-4 col-end-4 lg:col-start-1 lg:col-end-1";
const ScoreGrid = "col-start-1 col-end-1 lg:col-start-2 lg:col-end-2";
const GameLogGrid = "col-start-1 col-end-4 lg:col-start-3 lg:col-end-3";
const BatterGrid = "col-start-2 col-end-2 justify-self-start lg:col-start-4 lg:col-end-4 lg:justify-self-end";
const AtBatGrid = "col-start-3 col-end-5 justify-self-end lg:col-start-5 lg:col-end-5";
const DividerGrid = "col-start-1 col-end-5 lg:col-end-6";

function Timestamp({ update }: WrappedUpdateProps) {
    const updateTime = dayjs(update.timestamp);
    const time = updateTime.format("mm:ss");

    return <span className={`${TimestampGrid} text-gray-700`}>{time}</span>;
}

function Score({ evt }: UpdateProps) {
    return (
        <span className={`${ScoreGrid} tag font-semibold bg-gray-200`}>{`${evt.awayScore} - ${evt.homeScore}`}</span>
    );
}

function GameLog({ evt }: UpdateProps) {
    const fontWeight = isImportant(evt) ? "font-semibold" : "font-normal";
    return <span className={`${GameLogGrid} ${fontWeight}`}>{evt.lastUpdate}</span>;
}

function Batter({ evt }: UpdateProps) {
    const team = getBattingTeam(evt);

    if (!team.batterName)
        // "hide" when there's no batter
        return <span className={`${BatterGrid}`} />;

    return (
        <span className={`${BatterGrid} text-sm bg-gray-200 rounded px-2 py-1 inline-flex items-center justify-center`}>
            <Emoji emoji={team.emoji} />
            <span className="ml-1">{team.batterName}</span>
        </span>
    );
}

const Balls = ({ evt }: UpdateProps) => <Circles label="Balls" amount={evt.atBatBalls} total={3} />;

const Strikes = ({ evt }: UpdateProps) => {
    const totalStrikes = getBattingTeam(evt).maxStrikes;
    return <Circles label="Strikes" amount={evt.atBatStrikes} total={totalStrikes - 1} />;
};

const Outs = ({ evt }: UpdateProps) => <Circles label="Outs" amount={evt.halfInningOuts} total={2} />;

function AtBatInfo({ evt }: UpdateProps) {
    return (
        <div className={`${AtBatGrid} flex flex-row items-center space-x-2`}>
            <BlaseRunners evt={evt} />
            <span className="flex space-x-1">
                <Balls evt={evt} />
                <Strikes evt={evt} />
                <Outs evt={evt} />
            </span>
        </div>
    );
}
function BlaseRunners({ evt }: UpdateProps) {
    const basesIncludingHome = (evt.topOfInning ? evt.awayBases : evt.homeBases) ?? 4;

    return (
        <BaseDisplay
            basesOccupied={evt.basesOccupied}
            baseRunnerNames={evt.baseRunnerNames}
            totalBases={basesIncludingHome - 1}
        />
    );
}

export const UpdateRow = React.memo(
    function UpdateRow({ update }: WrappedUpdateProps) {
        const evt = update.data;

        return (
            <div className="contents">
                <GameLog evt={evt} />
                <Timestamp update={update} />
                <Score evt={evt} />
                <Batter evt={evt} />
                <AtBatInfo evt={evt} />

                <div className={`${DividerGrid} border-b border-solid border-gray-300`} />
            </div>
        );
    },
    (oldProps, newProps) => {
        return oldProps.update.hash === newProps.update.hash;
    }
);
