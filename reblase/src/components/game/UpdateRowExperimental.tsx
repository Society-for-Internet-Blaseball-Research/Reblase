import { isGameUpdateImportant, getBattingTeamExperimental } from "blaseball-lib/games";
import { Circles } from "../elements/Circles";
import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { BlaseballGameUpdateExperimental, CompositeGameState } from "blaseball-lib/models";
import { BaseDisplayExperimental } from "../elements/BaseDisplay";
import clsx from "clsx";
import "./UpdateRow.css";
import Twemoji from "components/elements/Twemoji";

interface UpdateProps {
    game: BlaseballGameUpdateExperimental;
    evt: CompositeGameState;
}

function Timestamp({ game: _, evt }: UpdateProps) {
    const updateTime = dayjs(evt.displayTime);
    const time = updateTime.format("mm:ss");

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

function Batter({ game, evt }: UpdateProps) {
    const team = getBattingTeamExperimental(game);

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

function AtBatInfo({ game, evt }: UpdateProps) {
    const team = getBattingTeamExperimental(game);
    return (
        <div className="UpdateRow-AtBat">
            <BlaseRunners game={game} evt={evt} />
            <span className="flex space-x-1">
                <Circles label="Balls" amount={evt.balls} total={team.maxBalls - 1} />
                <Circles label="Strikes" amount={evt.strikes} total={team.maxStrikes - 1} />
                <Circles label="Outs" amount={evt.outs} total={team.maxOuts - 1} />
            </span>
        </div>
    );
}
function BlaseRunners({ game, evt }: UpdateProps) {
    const team = getBattingTeamExperimental(game);
    return (
        <BaseDisplayExperimental
            baseRunners={evt.baserunners}
            totalBases={team.totalBases}
        />
    );
}

interface UpdateRowProps extends UpdateProps {
    highlight: boolean;
}

export const UpdateRowExperimental = React.memo(
    function UpdateRowExperimental({ game, evt, highlight }: UpdateRowProps) {
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
                <GameLog game={game} evt={evt} />
                <Timestamp game={game} evt={evt} />
                <Score game={game} evt={evt} />
                <Batter game={game} evt={evt} />
                <AtBatInfo game={game} evt={evt} />
            </div>
        );
    },
);
