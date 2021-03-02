import { ChroniclerGameUpdate } from "./api/types";
import { normalizeEmoji } from "./utils";

export interface ReblaseGame {
    id: string;
    time?: string;

    awayTeam: GameTeam;
    homeTeam: GameTeam;

    season: number;
    seasonStr: string;
    day: number;
    dayStr: string;
}

export interface ReblaseGameUpdate {
    id: string;
    time?: string;
    awayScore: number;
    homeScore: number;
    text: string;
    inning: number;
    top: boolean;
    batterName: string | null;
    batterId: string | null;
    pitcherName: string | null;
    pitcherId: string | null;
    runners: Baserunner[];
    balls: number;
    strikes: number;
    outs: number;
}

export interface Baserunner {
    base: number;
    name?: string;
    id?: string;
}

export interface GameTeam {
    id: string;
    nickname: string;
    name: string;
    emoji: string;
    color: string;

    maxBalls: number;
    maxStrikes: number;
    maxOuts: number;
    maxBases: number;
}

export function fromChroniclerGameUpdates(
    updates: ChroniclerGameUpdate[]
): { game: ReblaseGame; updates: ReblaseGameUpdate[] } {
    const last = updates[updates.length - 1];

    const awayTeam: GameTeam = {
        id: last.data.awayTeam,
        nickname: last.data.awayTeamNickname,
        name: last.data.awayTeamName,
        emoji: normalizeEmoji(last.data.awayTeamEmoji),
        color: last.data.awayTeamName,
        maxBalls: last.data.awayBalls ?? 4,
        maxStrikes: last.data.awayStrikes ?? 3,
        maxOuts: last.data.awayOuts ?? 3,
        maxBases: last.data.awayBases ?? 4,
    };

    const homeTeam: GameTeam = {
        id: last.data.homeTeam,
        nickname: last.data.homeTeamNickname,
        name: last.data.homeTeamName,
        emoji: normalizeEmoji(last.data.homeTeamEmoji),
        color: last.data.homeTeamColor,
        maxBalls: last.data.homeBalls ?? 4,
        maxStrikes: last.data.homeStrikes ?? 3,
        maxOuts: last.data.homeOuts ?? 3,
        maxBases: last.data.homeBases ?? 4,
    };

    const resultGame = {
        id: last.gameId,
        awayTeam: awayTeam,
        homeTeam: homeTeam,
        season: last.data.season,
        seasonStr: (last.data.season + 1).toString(), // todo: tournament
        day: last.data.day,
        dayStr: (last.data.day + 1).toString(),
    };

    const resultUpdates = updates.map((u) => {
        const runners = [];
        for (let i = 0; i < u.data.basesOccupied.length; i++) {
            const base = u.data.basesOccupied[i];
            const id = u.data.baseRunners && u.data.baseRunners[i];
            const name = u.data.baseRunnerNames && u.data.baseRunnerNames[i];
            runners.push({ base, id, name });
        }

        return {
            id: u.hash,
            awayScore: u.data.awayScore,
            homeScore: u.data.homeScore,
            text: u.data.lastUpdate,
            inning: u.data.inning,
            top: u.data.topOfInning,
            batterName: u.data.topOfInning ? u.data.awayBatterName : u.data.homeBatterName,
            batterId: u.data.topOfInning ? u.data.awayBatter : u.data.homeBatter,
            pitcherName: u.data.topOfInning ? u.data.homePitcherName : u.data.awayPitcherName,
            pitcherId: u.data.topOfInning ? u.data.homePitcher : u.data.awayPitcher,
            runners: runners,
            balls: u.data.atBatBalls,
            strikes: u.data.atBatStrikes,
            outs: u.data.halfInningOuts,
        };
    });

    return { game: resultGame, updates: resultUpdates };
}
