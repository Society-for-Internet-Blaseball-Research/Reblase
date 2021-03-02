export interface BlaseballGame {
    outcomes: string[];
    lastUpdate: string;

    season: number;
    day: number;
    isPostseason: boolean;
    weather: number;

    inning: number;
    topOfInning: boolean;
    playCount?: number;
    shame: boolean;

    awayOdds: number;
    homeOdds: number;

    awayScore: number;
    awayTeamBatterCount: number;
    homeScore: number;
    homeTeamBatterCount: number;

    halfInningOuts: number;
    halfInningScore: number;
    atBatBalls: number;
    atBatStrikes: number;

    awayPitcher: string | null;
    awayPitcherName: string | null;
    awayBatter: string | null;
    awayBatterName: string | null;
    homePitcher: string | null;
    homePitcherName: string | null;
    homeBatter: string | null;
    homeBatterName: string | null;
    awayBases?: number;
    awayBalls?: number;
    awayStrikes: number;
    awayOuts?: number;

    awayTeam: string;
    awayTeamName: string;
    awayTeamNickname: string;
    awayTeamColor: string;
    awayTeamEmoji: string;
    awayTeamSecondaryColor?: string;
    homeTeam: string;
    homeTeamName: string;
    homeTeamNickname: string;
    homeTeamColor: string;
    homeTeamEmoji: string;
    homeTeamSecondaryColor?: string;
    homeBases?: number;
    homeBalls?: number;
    homeStrikes: number;
    homeOuts?: number;

    baserunnerCount: number;
    basesOccupied: number[];
    baseRunners: string[];
    baseRunnerNames?: string[];

    phase: number;
    gameStart: boolean;
    gameComplete: boolean;
    finalized: boolean;

    seriesIndex: number;
    seriesLength: number;
    repeatCount?: number;
}

export interface BlaseballOffseasonRecap {
    id: string;
    bonusResults: string[];
    decreeResults: string[];
    name: string;
    season: number;
    totalBonusVotes: number;
    totalDecreeVotes: number;
    voteCount: number;
    eventResults: string[];
}

export interface BlaseballBonusResult {
    id: string;
    bonusId: string;
    bonusTitle: string;
    teamId: string;
    totalVotes: number;
    description: string;
    highestTeam: string | null;
    highestTeamVotes: number | null;
    teamVotes: number | null;
}

export interface BlaseballDecreeResult {
    id: string;
    decreeId: string;
    decreeTitle: string;
    description: string;
    totalVotes: string;
}

export interface BlaseballEventResult {
    id: string;
    msg: string;
}

export interface ChroniclerGameUpdate {
    gameId: string;
    hash: string;
    data: BlaseballGame;
}

export interface ChroniclerResponse<T> {
    data: T[];
}
