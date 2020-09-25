export interface GamePayload {
    lastUpdate: string;
    inning: number;
    topOfInning: boolean;
    gameComplete: boolean;
    shame: boolean;

    atBatStrikes: number;
    atBatBalls: number;
    halfInningOuts: number;
    
    homeStrikes: number;
    awayStrikes: number;

    season: number;
    day: number;
    weather: number;
    outcomes: string[];

    homeTeamName: string;
    homeTeamNickname: string;
    homeTeamEmoji: string;
    awayTeamName: string;
    awayTeamNickname: string;
    awayTeamEmoji: string;

    awayPitcherName: string;
    awayBatterName: string | null;
    homePitcherName: string;
    homeBatterName: string | null;

    awayScore: number;
    homeScore: number;

    basesOccupied: number[];
    baseRunnerNames: string[];
}

export type GameUpdate = {
    id: string;
    timestamp: string,
    payload: GamePayload
}

const importantMessages: RegExp[] = [
    /hits a (Single|Double|Triple|grand slam)/,
    /hits a (solo|2-run|3-run) home run/,
    /steals (second base|third base|home)/,
    /scores/,
    /(2s|3s) score/,
    /Rogue Umpire/,
    /feedback/,
    /Reverb/,
    /(yummy|allergic) reaction/,
    /Blooddrain/,
    /Unstable/,
    /Flickering/,
    /hits [\w\s]+ with a pitch/,
    /The Shame Pit/,
    /Red Hot/,
    /they peck [\w\s]+ free!/
];

export function isImportant(evt: GamePayload): boolean {
    for (const regex of importantMessages)
        if (regex.test(evt.lastUpdate))
            return true;

    return false;
}