import React, { ReactNode } from "react";

import Emoji from "../elements/Emoji";
import { GameStatsHookReturn } from "../../blaseball/hooks";
import { BlaseballGame, BlaseballGameStats, BlaseballTeamStats, BlaseballPlayerStats } from "blaseball-lib/models";
import Error from "components/elements/Error";
import { Loading } from "components/elements/Loading";

function DataCell(props: { children: ReactNode, header?: boolean, classes?: string[], bold?: boolean }) {
    const Tag = props.header ? "th" : "td";
    const className = [
        props.bold ? "font-bold" : "font-normal",
        "text-center", "px-3", "lg:px-4", "py-2",
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
            <HeaderCell bold={true} classes={["w-12"]}>R</HeaderCell>
            <HeaderCell bold={true} classes={["w-12"]}>H</HeaderCell>
        </tr>
    );
}

function ScoreRow(props: { game: BlaseballGame, stats: Stats, innings: number }) {
    const { game, stats, innings } = props;
    const away = stats.gameStats.awayTeamStats === stats.teamStats?.id;
    const { gameStats, playerStats } = props.stats;

    const emoji = game[away ? "awayTeamEmoji" : "homeTeamEmoji"];
    const name = game[away ? "awayTeamName" : "homeTeamName"];
    const won = game.gameComplete && game[away ? "awayScore" : "homeScore"] > game[away ? "homeScore" : "awayScore"];
    const runsByInning = gameStats[away ? "awayTeamRunsByInning" : "homeTeamRunsByInning"];

    return (
        <tr>
            <HeaderCell bold={won}>
                <Emoji emoji={emoji} />
                <span className="hidden lg:inline">{name}</span>
            </HeaderCell>
            {[...Array(innings)].map((_, idx) => <DataCell key={idx}>{runsByInning[idx] ?? (game.gameComplete ? "X" : null)}</DataCell>)}
            <DataCell bold={true}>{runsByInning.reduce((acc, n) => acc + n, 0)}</DataCell>
            <DataCell bold={true}>{playerStats.reduce((acc, sheet) => acc + (sheet.hits ?? 0), 0)}</DataCell>
        </tr>
    );
}

interface Stats {
    away: boolean,
    gameStats: BlaseballGameStats,
    teamStats?: BlaseballTeamStats,
    playerStats: BlaseballPlayerStats[],
}

interface BoxScoreProps extends GameStatsHookReturn {
    game: BlaseballGame;
}

export function BoxScore(props: BoxScoreProps) {
    if (props.error) return <Error>{props.error.toString()}</Error>;

    const chronStats = props.stats[props.stats.length - 1];
    if (chronStats === undefined) return props.isLoading ? <Loading /> : null;

    const game = props.game;
    const innings = Math.max(9, chronStats.gameStats.awayTeamRunsByInning.length);
    const stats = [true, false].map((away): Stats => {
        const gameStats = chronStats.gameStats;
        const teamStats = chronStats.teamStats.find((sheet) => sheet.id === gameStats[away ? "awayTeamStats" : "homeTeamStats"]);
        const playerStats = chronStats.playerStats.filter((sheet) => teamStats?.playerStats.some((id) => sheet.id === id));
        return { away, gameStats, teamStats, playerStats };
    });

    return (
        <div className="overflow-x-auto whitespace-no-wrap mt-4 w-screen -mx-4 pl-4 sm:w-full sm:mx-0 sm:pl-0">
            <table className="table-fixed mx-auto inline-block sm:table">
                <tbody>
                    <TopRow innings={innings} />
                    {stats.map((s) => <ScoreRow key={s.gameStats.id} game={game} stats={s} innings={innings} />)}
                </tbody>
            </table>
            <div className="inline-block w-4 sm:hidden"></div>
        </div>
    );
}
