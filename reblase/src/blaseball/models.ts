export interface BlaseGame {
    outcomes: string[];
    lastUpdate: string;

    season: number;
    day: number;
    isPostseason: boolean;
    weather: number;

    inning: number;
    topOfInning: boolean;
    shame: boolean;

    awayOdds: number;
    homeOdds: number;

    awayStrikes: number;
    awayScore: number;
    awayTeamBatterCount: number;
    homeStrikes: number;
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
    homeBases?: number;
    awayBases?: number;
    repeatCount?: number;
}

export interface BlasePlayer extends Partial<HasAttributes>, PlayerStats {
    name: string;

    deceased: boolean;
    soul: number;
    peanutAllergy?: boolean;
    fate?: number;
    ritual?: string | null;
    bat?: string | null;
    armor?: string | null;
    blood?: number;
    coffee?: number;

    totalFingers: number;
    cinnamon?: number;
    pressurization: number;

    hitStreak?: number;
    consecutiveHits?: number;
}

export interface BlaseTeam extends Partial<HasAttributes>, HasRoster {
    fullName: string;
    nickname: string;
    location: string;
    shorthand: string;
    slogan: string;
    emoji: string;

    mainColor: string;
    secondaryColor: string;

    shameRuns: number;
    totalShames: number;
    seasonShames: number;
    totalShamings: number;
    seasonShamings: number;

    championships: number;
    rotationSlot?: number;

    seasonAttributes?: Attribute[];
    permanentAttributes?: Attribute[];
}

export type Attribute = string;

export interface BattingStats {
    tragicness: number;
    buoyancy: number;
    thwackability: number;
    moxie: number;
    divinity: number;
    musclitude: number;
    patheticism: number;
    martyrdom: number;
}

export interface PitchingStats {
    shakespearianism: number;
    suppression: number;
    unthwackability: number;
    coldness: number;
    overpowerment: number;
    ruthlessness: number;
}

export interface BaserunningStats {
    laserlikeness: number;
    continuation: number;
    baseThirst: number;
    indulgence: number;
    groundFriction: number;
}

export interface DefenseStats {
    omniscience: number;
    tenaciousness: number;
    watchfulness: number;
    anticapitalism: number;
    chasiness: number;
}

export interface PlayerStats extends BattingStats, PitchingStats, BaserunningStats, DefenseStats {}

export interface HasRoster {
    lineup: string[];
    rotation: string[];
    bullpen: string[];
    bench: string[];
}

export interface HasAttributes {
    permAttr: Attribute[];
    seasAttr: Attribute[];
    weekAttr: Attribute[];
    gameAttr: Attribute[];
}

export interface BlaseTemporal {
    doc?: {
        alpha: number;
        beta: number;
        zeta: string;
        delta: boolean;
        gamma: number;
        epsilon: boolean;
    };
}

// See this API doc for more information about each field:
// https://github.com/Society-for-Internet-Blaseball-Research/blaseball-api-spec/blob/master/simulation-data.md
export interface Simulation {
    id: string;
    day: number;
    league: string;
    nextElectionEnd: string;
    nextPhaseTime: string;
    nextSeasonStart: string;
    phase: number;
    playOffRound: number;
    playoffs: string;
    rules: string;
    season: number;
    seasonId: string;
    terminology: string;
    eraColor: string;
    eraTitle: string;
    twgo: string;
    subEraColor: string;
    attr: string[];
}
