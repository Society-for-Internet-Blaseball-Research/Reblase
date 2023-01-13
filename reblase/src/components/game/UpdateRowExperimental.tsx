import { isGameUpdateImportant, getBattingTeamExperimental } from "blaseball-lib/games";
import { Circles } from "../elements/Circles";
import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { BlaseballGameUpdateExperimental } from "blaseball-lib/models";
import { BaseDisplayExperimental } from "../elements/BaseDisplay";
import clsx from "clsx";
import "./UpdateRow.css";
import Twemoji from "components/elements/Twemoji";

interface WrappedUpdateProps {
    update: BlaseballGameUpdateExperimental;
}

interface UpdateProps {
    evt: BlaseballGameUpdateExperimental;
}

function Timestamp({ update }: WrappedUpdateProps) {
    // const updateTime = dayjs((update as BlaseballGameUpdateExperimental)?.validFrom);
    const time = "TODO"; // updateTime.format("mm:ss");

    const linkHref = window.location.protocol + "//" + window.location.host + window.location.pathname + "#" + update.gameState.step;

    return (
        <a href={linkHref} className="UpdateRow-Timestamp">
            {time}
        </a>
    );
}

function Score({ evt }: UpdateProps) {
    return <span className="UpdateRow-Score tag">{`${evt.gameState.awayScore} - ${evt.gameState.homeScore}`}</span>;
}

function GameLog({ evt }: UpdateProps) {
    const isImportant = isGameUpdateImportant(evt.displayText, null);

    return (
        <span className="UpdateRow-GameLog">
            <span className={clsx(isImportant && "font-semibold")}>{evt.displayText}</span>
        </span>
    );
}

function Batter({ evt }: UpdateProps) {
    const team = getBattingTeamExperimental(evt);

    if (!team.batterName)
        // "hide" when there's no batter
        return null;

    return (
        <span className="UpdateRow-Batter">
            <Twemoji emoji={team.emoji} />
            <span className="ml-1">{team.batterName}</span>
        </span>
    );
}

function AtBatInfo({ evt }: UpdateProps) {
    return (
        <div className="UpdateRow-AtBat">
            <BlaseRunners evt={evt} />
            <span className="flex space-x-1">
                <Circles label="Balls" amount={evt.gameState.balls} total={evt.gameState.ballsNeeded - 1} />
                <Circles label="Strikes" amount={evt.gameState.strikes} total={evt.gameState.strikesNeeded - 1} />
                <Circles label="Outs" amount={evt.gameState.outs} total={evt.gameState.outsNeeded - 1} />
            </span>
        </div>
    );
}
function BlaseRunners({ evt }: UpdateProps) {
    return (
        <BaseDisplayExperimental
            baseRunners={evt.baserunners}
            totalBases={evt.gameState.totalBases}
        />
    );
}

interface UpdateRowProps extends WrappedUpdateProps {
    highlight: boolean;
}

export const UpdateRowExperimental = React.memo(
    function UpdateRowExperimental({ update, highlight }: UpdateRowProps) {
        const evt = update;

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
                <Timestamp update={update} />
                <Score evt={evt} />
                <Batter evt={evt} />
                <AtBatInfo evt={evt} />
            </div>
        );
    },
);
