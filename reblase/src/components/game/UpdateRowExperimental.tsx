import { isGameUpdateImportant, getBattingTeamExperimental, GameTeam, getShortTime } from "blaseball-lib/games";
import { Circles } from "../elements/Circles";
import React, { useEffect, useRef } from "react";
import { Dayjs } from "dayjs";
import { BlaseballTeamExperimental, CompositeGameState } from "blaseball-lib/models";
import { BaseDisplayExperimental } from "../elements/BaseDisplay";
import clsx from "clsx";
import "./UpdateRow.css";
import Twemoji from "components/elements/Twemoji";

interface UpdateProps {
    evt: CompositeGameState;
}

interface TeamUpdateProps extends UpdateProps {
    awayTeam: BlaseballTeamExperimental;
    homeTeam: BlaseballTeamExperimental;
}

interface TimedUpdateProps extends UpdateProps {
    firstUpdateTime: Dayjs;
}

function Timestamp({ evt, firstUpdateTime }: TimedUpdateProps) {
    const time = getShortTime(firstUpdateTime, evt.displayTime);

    const linkHref = window.location.protocol + "//" + window.location.host + window.location.pathname + "#" + time;

    return (
        <a href={linkHref} className="UpdateRow-Timestamp">
            {time}
        </a>
    );
}

function Score({ evt }: UpdateProps) {
    return <span className="UpdateRow-Score tag">{`${evt.awayScore} - ${evt.homeScore}`}</span>;
}

function GameLog({ evt }: UpdateProps) {
    const isImportant = isGameUpdateImportant(evt.displayText, null);

    return (
        <span className="UpdateRow-GameLog">
            <span className={clsx(isImportant && "font-semibold")}>{evt.displayText}</span>
        </span>
    );
}

function Batter({ awayTeam, homeTeam, evt }: TeamUpdateProps) {
    const team = getBattingTeamExperimental(evt.topOfInning, awayTeam, homeTeam);

    if (!evt.batter)
        // "hide" when there's no batter
        return null;

    return (
        <span className="UpdateRow-Batter">
            <Twemoji emoji={team.emoji} />
            <span className="ml-1">{evt.batter.name}</span>
        </span>
    );
}

function AtBatInfo({ evt }: UpdateProps) {
    return (
        <div className="UpdateRow-AtBat">
            <BlaseRunners evt={evt} />
            <span className="flex space-x-1">
                <Circles label="Balls" amount={evt.balls} total={3} />
                <Circles label="Strikes" amount={evt.strikes} total={2} />
                <Circles label="Outs" amount={evt.outs} total={2} />
            </span>
        </div>
    );
}

interface BaseRunnersProps {
    evt: CompositeGameState;
}

function BlaseRunners({ evt }: BaseRunnersProps) {
    return (
        <BaseDisplayExperimental
            baseRunners={evt.baserunners}
            totalBases={3}
        />
    );
}

interface UpdateRowProps extends TimedUpdateProps, TeamUpdateProps {
    highlight: boolean;
}

export const UpdateRowExperimental = React.memo(
    function UpdateRowExperimental({ awayTeam, homeTeam, evt, highlight, firstUpdateTime }: UpdateRowProps) {
        const scrollRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
            if (highlight) {
                scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, [highlight, scrollRef]);

        return (
            <div
                ref={highlight ? scrollRef : undefined}
                className={"UpdateRow" + (highlight ? " UpdateRow-Highlight" : "")}
            >
                <GameLog evt={evt} />
                <Timestamp firstUpdateTime={firstUpdateTime} evt={evt} />
                <Score evt={evt} />
                <Batter awayTeam={awayTeam} homeTeam={homeTeam} evt={evt} />
                <AtBatInfo evt={evt} />
            </div>
        );
    },
);
