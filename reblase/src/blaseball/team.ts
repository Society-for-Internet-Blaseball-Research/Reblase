import { BlaseGame } from "./models";

export interface TeamInfo {
    batterName: string | null;
    pitcherName: string | null;
    emoji: string;
    name: string;
    nickname: string;
    score: number;
    isBatting: boolean;
    isPitching: boolean;
    maxStrikes: number;
}

export function getBattingTeam(game: BlaseGame): TeamInfo {
    return game.topOfInning ? getTeam(game, "away") : getTeam(game, "home");
}

export function getPitchingTeam(game: BlaseGame): TeamInfo {
    return game.topOfInning ? getTeam(game, "home") : getTeam(game, "away");
}

export function getTeam(game: BlaseGame, team: "home" | "away"): TeamInfo {
    const nullIfEmpty = (s: string | null) => (s === "" ? null : s);

    if (team === "home") {
        return {
            batterName: nullIfEmpty(game.homeBatterName),
            pitcherName: nullIfEmpty(game.homePitcherName),
            emoji: game.homeTeamEmoji,
            name: game.homeTeamName,
            nickname: game.homeTeamNickname,
            score: game.homeScore,
            isBatting: !game.topOfInning,
            isPitching: game.topOfInning,
            maxStrikes: game.homeStrikes,
        };
    } else {
        return {
            batterName: nullIfEmpty(game.awayBatterName),
            pitcherName: nullIfEmpty(game.awayPitcherName),
            emoji: game.awayTeamEmoji,
            name: game.awayTeamName,
            nickname: game.awayTeamNickname,
            score: game.awayScore,
            isBatting: game.topOfInning,
            isPitching: !game.topOfInning,
            maxStrikes: game.awayStrikes,
        };
    }
}
