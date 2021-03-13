﻿import { isGameUpdateImportant, getBattingTeam } from "blaseball-lib/games";
import { Circles } from "../elements/Circles";
import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import Emoji from "../elements/Emoji";
import { BlaseballGame } from "blaseball-lib/models";
import { ChronFightUpdate, ChronGameUpdate } from "blaseball-lib/chronicler";
import BaseDisplay from "../elements/BaseDisplay";

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

function Timestamp({ update }: WrappedUpdateProps) {
    const updateTime = dayjs(update.timestamp);
    const time = updateTime.format("mm:ss");

    const linkHref =
        window.location.protocol + "//" + window.location.host + window.location.pathname + "#" + update.hash;

    return (
        <a href={linkHref} className={`${TimestampGrid} text-gray-700 dark:text-gray-300`}>
            {time}
        </a>
    );
}

function Score({ evt }: UpdateProps) {
    return (
        <span
            className={`${ScoreGrid} tag font-semibold bg-gray-200 dark:bg-gray-800`}
        >{`${evt.awayScore} - ${evt.homeScore}`}</span>
    );
}

function GameLog({ evt }: UpdateProps) {
    const fontWeight = isGameUpdateImportant(evt.lastUpdate, evt.scoreUpdate) ? "font-semibold" : "font-normal";
    return (
        <span className={`${GameLogGrid} ${fontWeight}`}>
            {evt.lastUpdate}
            {evt.scoreUpdate && <strong> {evt.scoreUpdate}</strong>}
        </span>
    );
}

function Batter({ evt }: UpdateProps) {
    const team = getBattingTeam(evt);

    if (!team.batterName)
        // "hide" when there's no batter
        return <span className={`${BatterGrid}`} />;

    return (
        <span
            className={`${BatterGrid} text-sm bg-gray-200 dark:bg-gray-800 rounded px-2 py-1 inline-flex items-center justify-center`}
        >
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

function isMaximumBlaseball(evt: BlaseballGame): boolean {
    const outs = evt.halfInningOuts;
    const outsNeeded = (evt.topOfInning ? evt.awayOuts : evt.homeOuts) ?? 3;
    const balls = evt.atBatBalls;
    const ballsNeeded = (evt.topOfInning ? evt.awayBalls : evt.homeBalls) ?? 4;
    const strikes = evt.atBatStrikes;
    const strikesNeeded = (evt.topOfInning ? evt.awayStrikes : evt.homeStrikes) ?? 3;
    const bases = (evt.topOfInning ? evt.awayBases : evt.homeBases) ?? 4;
    const basesLoaded = Array.from({ length: bases - 1 }).every((_, i) => evt.basesOccupied.includes(i));

    return basesLoaded &&
        ballsNeeded - 1 === balls &&
        outsNeeded - 1 === outs &&
        strikesNeeded - 1 === strikes;
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
                    "grid grid-flow-row-dense gap-2 items-center px-2 py-2 border-gray-300 dark:border-gray-700" +
                    (highlight ? " bg-yellow-200 dark:bg-gray-900" : "") +
                    (isMaximumBlaseball(evt) ? " maximum-blaseball" : " border-b")
                }
                style={{ gridTemplateColumns: "auto auto 1fr" }}
            >
                <GameLog evt={evt} />
                <Timestamp update={update} />
                <Score evt={evt} />
                <Batter evt={evt} />
                <AtBatInfo evt={evt} />
            </div>
        );
    },
    (oldProps, newProps) => {
        return oldProps.update.hash === newProps.update.hash && oldProps.highlight === newProps.highlight;
    }
);
