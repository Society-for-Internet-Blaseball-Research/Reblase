import {GamePayload} from "./update";

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

export function getBattingTeam(evt: GamePayload): TeamInfo {
    return evt.topOfInning ? getTeam(evt, "away") : getTeam(evt, "home");
}

export function getPitchingTeam(evt: GamePayload): TeamInfo {
    return evt.topOfInning ? getTeam(evt, "home") : getTeam(evt, "away");
}

export function getTeam(evt: GamePayload, team: "home" | "away"): TeamInfo {
    const nullIfEmpty = (s: string | null) => s == "" ? null : s;

    if (team === "home") {
        return {
            batterName: nullIfEmpty(evt.homeBatterName),
            pitcherName: nullIfEmpty(evt.homePitcherName),
            emoji: evt.homeTeamEmoji,
            name: evt.homeTeamName,
            nickname: evt.homeTeamNickname,
            score: evt.homeScore,
            isBatting: !evt.topOfInning,
            isPitching: evt.topOfInning,
            maxStrikes: evt.homeStrikes
        };
    } else {
        return {
            batterName: nullIfEmpty(evt.awayBatterName),
            pitcherName: nullIfEmpty(evt.awayPitcherName),
            emoji: evt.awayTeamEmoji,
            name: evt.awayTeamName,
            nickname: evt.awayTeamNickname,
            score: evt.awayScore,
            isBatting: evt.topOfInning,
            isPitching: !evt.topOfInning,
            maxStrikes: evt.awayStrikes
        }
    }
}