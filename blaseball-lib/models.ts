import { Timestamp } from "./chronicler";
import {
    AttributeID,
    BlaseballAttributes,
    BlaseballAttributesDeprecated,
    BlaseballEntity,
    FeedCategory,
    GameID,
    LeagueID,
    PlayerID,
    PlayerStats,
    PlayoffsID,
    SeasonID,
    StadiumID,
    TeamID,
    TeamRoster,
    WeatherID,
} from "./common";

export interface BlaseballGame extends BlaseballEntity<GameID> {
    outcomes?: string[];
    lastUpdate: string;
    scoreLedger: string | null;
    scoreUpdate: string | null;

    sim?: string;
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

    awayPitcher: PlayerID | null;
    awayPitcherName: string | null;
    awayBatter: PlayerID | null;
    awayBatterName: string | null;
    homePitcher: PlayerID | null;
    homePitcherName: string | null;
    homeBatter: PlayerID | null;
    homeBatterName: string | null;
    awayBases?: number;
    awayBalls?: number;
    awayStrikes: number;
    awayOuts?: number;

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
    homeBases?: number;
    homeBalls?: number;
    homeStrikes: number;
    homeOuts?: number;

    baserunnerCount: number;
    basesOccupied: number[];
    baseRunners: PlayerID[];
    baseRunnerNames?: string[];

    phase: number;
    rules: string;
    gameStart: boolean;
    gameComplete: boolean;
    finalized: boolean;

    seriesIndex: number;
    seriesLength: number;
    repeatCount?: number;

    stadiumId?: string | null;
}

interface BlaseballGameInformationExperimental {
    id: GameID;

    startTime: Timestamp;
    updated: Timestamp;

    awayTeam: BlaseballTeamExperimental;
    homeTeam: BlaseballTeamExperimental;

    awayPitcher: BlaseballPlayerExperimental;
    homePitcher: BlaseballPlayerExperimental;

    day: number;
    seasonId: SeasonID;
    numberInSeries: number;
    seriesLength: number;

    weather: BlaseballWeatherExperimental;

    started: boolean;
    complete: boolean;
    cancelled: boolean;

    gameLoserId: TeamID;
    gameWinnerId: TeamID;
}

export interface BlaseballDisplayExperimental {
    displayText: string;
    displayTime: Timestamp;
    displayDelay: number;
    displayOrder: number;
}

export interface BlaseballGameExperimental extends BlaseballGameInformationExperimental {
    gameEventBatches: BlaseballGameEventExperimental[];
    gameStates: BlaseballGameStateExperimental[];
}

export interface BlaseballGameUpdateExperimental extends BlaseballGameInformationExperimental, BlaseballDisplayExperimental {
    gameState: BlaseballGameStateExperimental;

    baserunners?: BlaseballBaserunnerExperimental[];
}

export interface BlaseballGameEventExperimental { 
    gameId: GameID;

    batchStep: number;
    batchData: string;
}

export interface BlaseballGameBatchChanges {
    awayScore?: number;
    homeScore?: number;
    shame?: boolean;

    started?: boolean;
    complete?: boolean;
    inning?: number;
    topOfInning?: boolean;

    batter?: BlaseballPlayerExperimental | null;
    pitcher?: BlaseballPlayerExperimental | null;
    teamAtBat?: "HOME" | "AWAY";

    balls?: number;
    ballsNeeded?: number;
    outs?: number;
    outsNeeded?: number;
    strikes?: number;
    strikesNeeded?: number;

    baserunners?: BlaseballBaserunnerExperimental[];
    defenders?: BlaseballPlayerExperimental[];
    totalBases: number;
}

export interface BlaseballGameBatchChangedState extends BlaseballDisplayExperimental {
    changedState: BlaseballGameBatchChanges;
}

export interface BlaseballGameStateExperimental {
    awayScore: number;
    homeScore: number;
    shame: boolean;

    step: number; // is this display order in the batch changes? 
    inning: number;
    topOfInning: boolean;

    batter: BlaseballPlayerExperimental | null;
    pitcher: BlaseballPlayerExperimental | null;
    teamAtBat: "HOME" | "AWAY";

    balls: number;
    ballsNeeded: number;
    outs: number;
    outsNeeded: number;
    strikes: number;
    strikesNeeded: number;

    baserunners?: BlaseballBaserunnerExperimental[];
    totalBases: number;
}

export interface CompositeGameState {
    batter: BlaseballPlayerExperimental | null;
    pitcher: BlaseballPlayerExperimental | null;
    //defenders: Option<Vec<PlayerRef>>, don't care
    baserunners: BlaseballBaserunnerExperimental[];
    
    started: boolean;
    complete: boolean;
    teamAtBat: "HOME" | "AWAY";
    
    balls: number;
    strikes: number;
    outs: number;
    
    awayScore: number;
    homeScore: number;
    shame: boolean;

    inning: number;
    topOfInning: boolean;

    displayText: string;
    displayTime: Timestamp;
    displayOrder: number;
}

export interface BlaseballTeamExperimental {
    emoji: string;
    gameWinner: boolean;
    id: TeamID;
    name: string;
    nickname: string;
    primaryColor: string;
    secondaryColor: string;
    shorthand: string;
    slogan: string;
}

export interface BlaseballPlayerExperimental {
    id: PlayerID;
    name: string;
}

export interface BlaseballBaserunnerExperimental extends BlaseballPlayerExperimental {
    base: number;
}

export interface BlaseballWeatherExperimental {
    id: WeatherID;
    name: string;
    weatherEffects: [];
}

export interface BlaseballSimExperimental {
    startDayNumber: number;
    endDayNumber: number;

    startTime: Timestamp;
    endTime: Timestamp;
    
    simData: BlaseballSimDataExperimental;
}

export interface BlaseballSimDataExperimental {
    currentDay: number;
    currentSeasonId: SeasonID;
    currentSeasonNumber: number; // this exists?! 
}

export interface DamageResult {
    dmgType: number;
    teamTarget: string;
    playerSource: string;
    dmg: number;
}

export interface BlaseballFight extends BlaseballGame {
    awayHp: string;
    homeHp: string;
    awayMaxHp: string;
    homeMaxHp: string;
    damageResults: string;
}

export interface BlaseballPlayer extends BlaseballEntity<PlayerID>, BlaseballAttributes, PlayerStats {
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

export interface BlaseballTeamDescriptor {
    fullName: string;
    nickname: string;
    location: string;
}

export interface BlaseballTeamState {
    nullified?: boolean;
    scattered?: BlaseballTeamDescriptor;
}

export interface BlaseballTeam
    extends BlaseballEntity<TeamID>,
        BlaseballTeamDescriptor,
        BlaseballAttributes,
        BlaseballAttributesDeprecated,
        TeamRoster {
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

    state?: BlaseballTeamState;
}

export interface BlaseballTemporal {
    doc?: BlaseballTemporalDoc;
}

export interface BlaseballTemporalDoc extends BlaseballEntity<"whatistime"> {
    alpha?: number;
    beta?: number;
    zeta: string;
    delta?: boolean;
    gamma: number;
    epsilon: boolean;
}

export interface BlaseballSimData extends BlaseballEntity<string> {
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

export interface BlaseballStadium extends BlaseballEntity<StadiumID> {
    name: string;
    nickname: string;
    teamId: string;
    model: number;
    mods: AttributeID[];
}

export interface BlaseballSunSunPressure {
    current: number;
    maximum: number;
    recharge: number;
}

export interface BlaseballFeedSeasonEntry {
    sim: string;
    name: string;
    seasons: number[];
}

export interface BlaseballFeedSeasonList {
    collection: BlaseballFeedSeasonEntry[];
}

export interface BlaseballFeedEntry {
    id: string;

    description: string;
    blurb: string;

    nuts: number;

    playerTags: PlayerID[];
    teamTags: TeamID[];
    gameTags: GameID[];

    metadata: object;

    created: string;

    season: number;
    sim: string;
    tournament: number;
    day: number;

    phase: number;

    type: number;
    category: FeedCategory;
}

export interface BlaseballFeedTemporalMetadata {
    being: number;
    _eventually_ingest_source?: string;
    _eventually_ingest_time?: number;
}