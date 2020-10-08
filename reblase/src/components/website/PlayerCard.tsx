import React from "react";
import { TiStar, TiStarHalf } from "react-icons/ti";
import { GoArrowBoth, GoArrowDown, GoArrowUp } from "react-icons/go";
import { getVibeCategory } from "../../../../blaseball-lib/players";
import "./PlayerCard.css";

interface PlayerInfoProps {
    name: string;
    teamName: string;
    teamEmoji: string;
    teamColor: string;
}

interface PlayerStatsProps {
    vibes: number;
    battingStars: number;
    pitchingStars: number;
    baserunningStars: number;
    defenseStars: number;
}

interface PlayerItemsProps {
    item: string | null;
    armor: string | null;
}

interface PlayerBioProps {
    evolution: string;
    ritual: string | null;
    coffee: string | null;
    blood: string | null;
    fate: number;
    soulscream: string;
}

export interface PlayerCardProps extends PlayerInfoProps, PlayerStatsProps, PlayerItemsProps, PlayerBioProps {}

export function PlayerInfoLine(props: { title: string; children: React.ReactNode }) {
    return (
        <div className="Player-Info-Line">
            <div className="Player-Info-Line-Header">{props.title}</div>
            {props.children}
        </div>
    );
}

export function PlayerVibes(props: { vibe: number }) {
    const category = getVibeCategory(props.vibe);

    const arrows = [];
    for (let i = 0; i < category.arrows; i++) {
        if (category.direction === "up") arrows.push(<GoArrowUp key={i} />);
        if (category.direction === "down") arrows.push(<GoArrowDown key={i} />);
        if (category.direction === "neutral") arrows.push(<GoArrowBoth key={i} />);
    }

    const vibeClass = [
        "Player-Vibe-Terrible",
        "Player-Vibe-FarLessThanIdeal",
        "Player-Vibe-LessThanIdeal",
        "Player-Vibe-Neutral",
        "Player-Vibe-Quality",
        "Player-Vibe-Excellent",
        "Player-Vibe-MostExcellent",
    ][category.level];

    return (
        <span className={`Player-VibeLine ${vibeClass}`} style={{ alignItems: "center" }}>
            {arrows}
            <div className="Player-VibeLine-Text">{category.text}</div>
        </span>
    );
}

export function PlayerStars(props: { stars: number }) {
    const rounded = Math.round(props.stars * 2) / 2;
    const hasHalf = rounded % 1 >= 0.5;

    const elements = [];
    for (let i = 0; i < Math.floor(rounded); i++) elements.push(<TiStar key={i} />);
    if (hasHalf) elements.push(<TiStarHalf key={elements.length} />);
    return (
        <div className="Player-Ratings">
            <span style={{ display: "flex" }}>{elements}</span>
        </div>
    );
}

export function PlayerCard(props: PlayerCardProps) {
    return (
        <div
            className="Player Modal--Generic"
            style={{
                backgroundColor: "#000",
                border: "1px solid white",
                color: "#fff",
                fontFamily: "Lora",
                lineHeight: "1.5",
            }}
        >
            <div className="Player-Info">
                <div className="Player-Header-Name">{props.name}</div>
                <div className="Player-Header-Bottom">
                    <div className="Player-Team-Line hidden">
                        <div className="Player-Team-Logo" style={{ backgroundColor: props.teamColor }}>
                            <div className="Player-Team-Emoji">{props.teamEmoji}</div>
                        </div>
                        <div className="Player-Team-Name">{props.teamName}</div>
                    </div>
                </div>
            </div>
            <div className="Player-Content">
                <ul className="Player-Info-Stats">
                    <PlayerInfoLine title="Current Vibe">
                        <PlayerVibes vibe={props.vibes} />
                    </PlayerInfoLine>
                    <PlayerInfoLine title="Batting">
                        <PlayerStars stars={props.battingStars} />
                    </PlayerInfoLine>
                    <PlayerInfoLine title="Pitching">
                        <PlayerStars stars={props.pitchingStars} />
                    </PlayerInfoLine>
                    <PlayerInfoLine title="Baserunning">
                        <PlayerStars stars={props.baserunningStars} />
                    </PlayerInfoLine>
                    <PlayerInfoLine title="Defense">
                        <PlayerStars stars={props.defenseStars} />
                    </PlayerInfoLine>
                </ul>
                <div className="Player-Info-Items">
                    <div className="Player-Info-Items-Box">
                        <div className="Player-Info-Items-Header">Item</div>
                        <div className="Player-Info-Items-Details">{props.item ? props.item : "None"}</div>
                    </div>
                    <div className="Player-Info-Items-Box">
                        <div className="Player-Info-Items-Header">Armor</div>
                        <div className="Player-Info-Items-Details">{props.armor ? props.armor : "None"}</div>
                    </div>
                </div>
                <ul className="Player-Info-Bio">
                    <PlayerInfoLine title="Evolution">
                        <div className="Player-Info-Line-Body">{props.evolution}</div>
                    </PlayerInfoLine>
                    <PlayerInfoLine title="Pregame Ritual">
                        <div className="Player-Info-Line-Body">{props.ritual}</div>
                    </PlayerInfoLine>
                    <PlayerInfoLine title="Coffee Style">
                        <div className="Player-Info-Line-Body">{props.coffee}</div>
                    </PlayerInfoLine>
                    <PlayerInfoLine title="Blood Type">
                        <div className="Player-Info-Line-Body">{props.blood}</div>
                    </PlayerInfoLine>
                    <PlayerInfoLine title="Fate">
                        <div className="Player-Info-Line-Body">{props.fate}</div>
                    </PlayerInfoLine>
                    <PlayerInfoLine title="Soulscream">
                        <div className="Player-Soulscream">
                            <div className="Player-Soulscream-Body">{props.soulscream}</div>
                        </div>
                    </PlayerInfoLine>
                </ul>
            </div>
        </div>
    );
}
