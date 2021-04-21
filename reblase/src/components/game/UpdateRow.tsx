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

const TimestampGrid = "col-start-4 col-span-1 lg:col-start-1 lg:col-span-1 justify-self-end self-start sm:justify-self-center sm:self-center";
const ScoreGrid = "row-end-4 row-span-1 sm:row-auto col-start-1 col-span-1 lg:col-start-2 lg:col-span-1";
const GameLogGrid = "col-start-1 col-span-3 lg:col-start-3 lg:col-span-1";
const BatterGrid = "col-start-1 col-span-2 sm:col-start-2 sm:col-span-1 justify-self-start lg:col-start-4 lg:col-span-1 lg:justify-self-end";
const AtBatGrid = "row-end-4 sm:row-auto col-start-3 col-span-2 justify-self-end lg:col-start-5 lg:col-span-1";

 function Timestamp({ update }:WrappedUpdateProps ) {
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
                    "grid grid-rows-update-mobile sm:grid-rows-none md:grid-flow-row-dense gap-x-2 gap-y-1 sm:gap-2 items-center px-2 py-2 border-b border-gray-300 dark:border-gray-700" +
                    (highlight ? " bg-yellow-200 dark:bg-gray-900" : "")
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

