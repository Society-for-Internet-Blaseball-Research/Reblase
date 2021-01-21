import React, { ReactNode } from "react";

import Emoji from "../elements/Emoji";
import { ChronGameStats } from "blaseball-lib/chronicler";
import { BlaseballGame, BlaseballGameStats, BlaseballTeamStats, BlaseballPlayerStats } from "blaseball-lib/models";
import Error from "components/elements/Error";
import { Loading } from "components/elements/Loading";

interface Stats {
    gameStats: BlaseballGameStats,
    teamStats?: BlaseballTeamStats,
    playerStats: BlaseballPlayerStats[],
}

function filterStats(stats: ChronGameStats, away: boolean): Stats {
    const teamStats = stats.teamStats.find(
        (sheet) => sheet.id === stats.gameStats[away ? "awayTeamStats" : "homeTeamStats"]);
    const playerStats = stats.playerStats.filter((sheet) => teamStats?.playerStats.some((id) => sheet.id === id));
    return { ...stats, teamStats, playerStats };
}

function DataCell(props: { children: ReactNode, header?: boolean, classes?: string[], bold?: boolean }) {
    const Tag = props.header ? "th" : "td";
    const className = [
        props.bold ? "font-bold" : "font-normal",
        "text-center", "px-4", "py-2",
        "border", "border-gray-300", "dark:border-gray-700",
        ...(props.classes ?? [])
    ].join(" ");
    return <Tag className={className}>{props.children}</Tag>;
}

function HeaderCell(props: { children: ReactNode, classes?: string[], bold?: boolean }) {
    return (
        <DataCell
            {...props}
            classes={["bg-gray-200", "dark:bg-gray-800", ...(props.classes ?? [])]}
            header={true}
        >
            {props.children}
        </DataCell>
    );
}

function TopRow(props: { innings: number }) {
    return (
        <tr>
            <HeaderCell>&nbsp;</HeaderCell>
            {[...Array(props.innings)].map((_, idx) => <HeaderCell key={idx} classes={["w-12"]}>{idx + 1}</HeaderCell>)}
            <HeaderCell bold={true} classes={["w-12"]}><abbr title="Runs">R</abbr></HeaderCell>
            <HeaderCell bold={true} classes={["w-12"]}><abbr title="Hits">H</abbr></HeaderCell>
        </tr>
    );
}

function ScoreRow(props: { game: BlaseballGame, stats: ChronGameStats, innings: number, away: boolean }) {
    const { game, stats, innings, away } = props;
    const { gameStats, playerStats } = filterStats(stats, away);

    const emoji = game[away ? "awayTeamEmoji" : "homeTeamEmoji"];
    const name = game[away ? "awayTeamName" : "homeTeamName"];
    const won = game.gameComplete && game[away ? "awayScore" : "homeScore"] > game[away ? "homeScore" : "awayScore"];
    const runsByInning = gameStats[away ? "awayTeamRunsByInning" : "homeTeamRunsByInning"];

    return (
        <tr>
            <HeaderCell bold={won}><Emoji emoji={emoji} /> {name}</HeaderCell>
            {[...Array(innings)].map((_, idx) => <DataCell key={idx}>{runsByInning[idx] ?? (game.gameComplete ? "X" : null)}</DataCell>)}
            <DataCell bold={true}>{runsByInning.reduce((acc, n) => acc + n, 0)}</DataCell>
            <DataCell bold={true}>{playerStats.reduce((acc, sheet) => acc + (sheet.hits ?? 0), 0)}</DataCell>
        </tr>
    );
}

interface BoxScoreProps {
    game: BlaseballGame;
    stats: ChronGameStats[];
    error: any;
    isLoading: boolean;
}

export function BoxScore(props: BoxScoreProps) {
    if (props.error) return <Error>{props.error.toString()}</Error>;

    const stats = props.stats[props.stats.length - 1];
    if (stats === undefined) return props.isLoading ? <Loading /> : null;

    const game = props.game;
    const innings = Math.max(9, stats.gameStats.awayTeamRunsByInning.length);

    return (
        <table className="Boxscore table-fixed m-auto mt-4">
            <tbody>
                <TopRow innings={innings} />
                {[true, false].map((away) => <ScoreRow key={away ? "away" : "home"} game={game} stats={stats} innings={innings} away={away} />)}
            </tbody>
        </table>
    );
}
