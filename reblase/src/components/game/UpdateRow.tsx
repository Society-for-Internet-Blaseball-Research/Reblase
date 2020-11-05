import { isGameUpdateImportant, getBattingTeam } from "blaseball-lib/games";
import { Circles } from "../elements/Circles";
import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import Emoji from "../elements/Emoji";
import { BlaseballGame } from "blaseball-lib/models";
import { ChronFightUpdate, ChronGameUpdate } from "blaseball-lib/chronicler";
import BaseDisplay from "../elements/BaseDisplay";
import { AiOutlineLink } from "react-icons/ai";

interface WrappedUpdateProps {
    update: ChronGameUpdate | ChronFightUpdate;
}

interface UpdateProps {
    evt: BlaseballGame;
}

const TimestampGrid = "col-start-4 col-end-4 lg:col-start-1 lg:col-end-1";
const ScoreGrid = "col-start-1 col-end-1 lg:col-start-2 lg:col-end-2";
const GameLogGrid = "col-start-1 col-end-4 lg:col-start-3 lg:col-end-3";
const BatterGrid = "col-start-2 col-end-2 justify-self-start lg:col-start-4 lg:col-end-4 lg:justify-self-end";
const AtBatGrid = "col-start-3 col-end-5 justify-self-end lg:col-start-5 lg:col-end-5";
const LinkGrid = "hidden lg:block lg:col-start-6 lg:col-end-6";

 function Timestamp( {update}:WrappedUpdateProps ) {
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
    const fontWeight = isGameUpdateImportant(evt.lastUpdate) ? "font-semibold" : "font-normal";
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

function AtBatInfo({ evt }: UpdateProps) {
    const battingTeam = getBattingTeam(evt);
    return (
        <div className={`${AtBatGrid} flex flex-row items-center space-x-2`}>
            <BlaseRunners evt={evt} />
            <span className="flex space-x-1">
                <Circles label="Balls" amount={evt.atBatBalls} total={battingTeam.maxBalls - 1} />
                <Circles label="Strikes" amount={evt.atBatStrikes} total={battingTeam.maxStrikes - 1} />
                <Circles label="Outs" amount={evt.halfInningOuts} total={battingTeam.maxOuts - 1} />
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

interface UpdateRowProps extends WrappedUpdateProps {
    highlight: boolean;
}

function UpdateLink(props: { hash: string }) {
    const href = window.location.protocol + "//" + window.location.host + window.location.pathname + "#" + props.hash;
    return (
        <a href={href} className={`${LinkGrid} -mr-16 pl-4 cursor-pointer text-lg text-gray-500 hover:text-gray-900`}>
            <AiOutlineLink />
        </a>
    );
}

export const UpdateRow = React.memo(
    function UpdateRow({ update, highlight }: UpdateRowProps) {
        const evt = update.data;

        const scrollRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
            if (highlight) {
                scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, [highlight, scrollRef]);

        return (
            <div
                ref={highlight ? scrollRef : undefined}
                className={
                    "grid grid-flow-row-dense gap-2 items-center px-2 py-2 border-b border-gray-300 " +
                    (highlight ? "bg-yellow-200" : "")
                }
                style={{ gridTemplateColumns: "auto auto 1fr" }}
            >
                <GameLog evt={evt} />
                <Timestamp update={update} />
                <Score evt={evt} />
                <Batter evt={evt} />
                <AtBatInfo evt={evt} />

                <UpdateLink hash={update.hash} />
            </div>
        );
    },
    (oldProps, newProps) => {
        return oldProps.update.hash === newProps.update.hash && oldProps.highlight === newProps.highlight;
    }
);

