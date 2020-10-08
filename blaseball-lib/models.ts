import {
    AttributeID,
    BlaseballAttributes,
    BlaseballAttributesDeprecated,
    BlaseballEntity,
    GameID,
    LeagueID,
    PlayerID,
    PlayoffsID,
    SeasonID,
    TeamID,
    TeamRoster,
} from "./common";

export interface BlaseballGame extends BlaseballEntity<GameID> {
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

    awayPitcher: PlayerID | null;
    awayPitcherName: string | null;
    awayBatter: PlayerID | null;
    awayBatterName: string | null;
    homePitcher: PlayerID | null;
    homePitcherName: string | null;
    homeBatter: PlayerID | null;
    homeBatterName: string | null;

    awayTeam: TeamID;
    awayTeamName: string;
    awayTeamNickname: string;
    awayTeamColor: string;
    awayTeamEmoji: string;
    awayTeamSecondaryColor?: string;
    homeTeam: TeamID;
    homeTeamName: string;
    homeTeamNickname: string;
    homeTeamColor: string;
    homeTeamEmoji: string;
    homeTeamSecondaryColor?: string;

    baserunnerCount: number;
    basesOccupied: number[];
    baseRunners: PlayerID[];
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

export interface BlaseballPlayer extends BlaseballEntity<PlayerID>, BlaseballAttributes {
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

export interface BlaseballTeam
    extends BlaseballEntity<TeamID>,
        BlaseballAttributes,
        BlaseballAttributesDeprecated,
        TeamRoster {
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
}

export interface BlaseballTemporal {
    doc?: BlaseballTemporalDoc;
}

export interface BlaseballTemporalDoc extends BlaseballEntity<"whatistime"> {
    alpha: number;
    beta: number;
    zeta: string;
    delta: boolean;
    gamma: number;
    epsilon: boolean;
}

export interface BlaseballSimData extends BlaseballEntity<"thisidisstaticyo"> {
    season: number;
    day: number;

    phase: number;
    playOffRound: number;

    league: LeagueID;
    seasonId: SeasonID;
    playoffs: PlayoffsID;

    eraTitle: string;
    eraColor?: string;
    subEraTitle?: string;
    subEraColor?: string | null;

    nextPhaseTime: string;
    nextElectionEnd: string;
    nextSeasonStart: string;

    twgo?: string;

    attr?: string[];

    // Removed fields, still present in other objects, replaced by attr
    labourOne?: number;
    openedBook?: boolean;
    unlockedPeanuts?: boolean;
    doTheThing?: boolean;
    eatTheRich?: boolean;
    unlockedInterviews?: boolean;
}
