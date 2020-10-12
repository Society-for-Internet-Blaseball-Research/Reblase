import { isGameUpdateImportant, getBattingTeam } from "blaseball-lib/games";
import { Circles } from "../elements/Circles";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Emoji from "../elements/Emoji";
import { BlaseballGame } from "blaseball-lib/models";
import { ChronFightUpdate, ChronGameUpdate } from "blaseball-lib/chronicler";
import BaseDisplay from "../elements/BaseDisplay";
import { AiOutlineLink, AiOutlineCopy } from "react-icons/ai";
import Tooltip from "rc-tooltip";

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
const ControlsGrid = "hidden lg:block lg:col-start-6 lg:col-end-6";

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

interface UpdateRowProps extends WrappedUpdateProps {
    highlight: boolean;
}

function UpdateLinkControls(props: { hash: string }) {
    // This should probably be using React refs???
    const url = window.location.protocol + "//" + window.location.host + window.location.pathname + "#" + props.hash;

    const updateRowHrefInputID = `update-row-input-${props.hash}`;

    const [linkCopied, setLinkCopied] = useState(false);

    function copyLink(updateRowHrefInputID: string) {
        // Code copied from W3Schools https://www.w3schools.com/howto/howto_js_copy_clipboard.asp

        const updateRowHrefInputElement = document.getElementById(updateRowHrefInputID) as HTMLInputElement;
        updateRowHrefInputElement.select();
        /* For mobile devices, although this button shouldn't show up on those. */
        updateRowHrefInputElement.setSelectionRange(0, 99999);
        document.execCommand('copy');

        setLinkCopied(true);

        // Arbitrary 3 second timeout to set text back to "Copy link".
        setTimeout(() => {
            setLinkCopied(false);
        }, 3000);
    }
    
      return (
        <div className={`${ControlsGrid} pl-r text-lg text-gray-500 -mr-16 pl-4`}>
            <div className="flex items-center">
                <a href={url} className={`cursor-pointer hover:text-gray-900`}>
                    <AiOutlineLink />
                </a>
                <div className="ml-1 flex items-center">
                    <Tooltip overlay={linkCopied ? "Link copied!" : "Copy link"}>
                        <button type="button" className="hover:text-gray-900" onClick={() => {
                            copyLink(updateRowHrefInputID);
                        }}>
                            <AiOutlineCopy />
                        </button>
                    </Tooltip>

                    {/* This is a kinda hacky sorta-but-not-quite-hidden input to copy the link from. It's
                    hiding behind the copy link button because I didn't want to show it, but
                    in order to copy text, you need to select the text first, and you cannot select 
                    text in a hidden input. I tried display: none, width: 0, height: 0, and 
                    type=hidden. - kadauber#7305 */}
                    <input id={updateRowHrefInputID} value={url} readOnly className="w-1 h-1 absolute top-0 left-0" />
                </div>
            </div>
        </div>
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
                style={{ gridTemplateColumns: "auto auto 1fr repeat(3, auto)" }}
            >
                <GameLog evt={evt} />
                <Timestamp update={update} />
                <Score evt={evt} />
                <Batter evt={evt} />
                <AtBatInfo evt={evt} />

                <UpdateLinkControls hash={update.hash} />
            </div>
        );
    },
    (oldProps, newProps) => {
        return oldProps.update.hash === newProps.update.hash && oldProps.highlight === newProps.highlight;
    }
);
