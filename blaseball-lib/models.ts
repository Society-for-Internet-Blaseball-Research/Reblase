import {
    AttributeID,
    BlaseballAttributes,
    BlaseballAttributesDeprecated,
    BlaseballEntity,
    CauldronEventID,
    GameID,
    LeagueID,
    PlayerID,
    PlayerStats,
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
    gameStart: boolean;
    gameComplete: boolean;
    finalized: boolean;

    seriesIndex: number;
    seriesLength: number;
    repeatCount?: number;
}


export interface CauldronGameEvent extends BlaseballEntity<CauldronEventID> {
    game_id: GameID;
    perceived_at: string;
    event_type: string;
    event_index: number;
    inning: number;
    top_of_inning: boolean;
    outs_before_play: number;
    batter_id: PlayerID;
    batter_team_id: TeamID;
    pitcher_id: PlayerID;
    pitcher_team_id: TeamID;
    home_score: number;
    away_score: number;
    home_strike_count: number;
    away_strike_count: number;
    batter_count: number;
    pitches: string[];
    total_strikes: number;
    total_balls: number;
    total_fouls: number;
    is_leadoff: boolean;
    is_pinch_hit: boolean;
    lineup_position: number;
    is_last_event_for_plate_appearance: boolean;
    bases_hit: number;
    runs_batted_in: number;
    is_sacrifice_hit: boolean;
    is_sacrifice_fly: boolean;
    outs_on_play: boolean;
    is_double_play: boolean;
    is_triple_play: boolean;
    is_wild_pitch: boolean;
    batted_ball_type: string;
    is_bunt: boolean;
    errors_on_play: boolean;
    batter_base_after_play: number;
    is_last_game_event: boolean;
    event_text: string[];
    additional_context: string;
    season: number;
    day: number;
    parsing_error: boolean;
    parsing_error_list: string[];
    fixed_error: boolean;
    fixed_error_list: string[];
    home_ball_count: number;
    away_ball_count: number;
    home_base_count: number;
    away_base_count: number;
    base_runners: CauldronBaseRunner[];
    outcomes: CauldronOutcome[];
}

export interface CauldronBaseRunner extends BlaseballEntity<number> {
    game_event_id: CauldronEventID;
    runner_id: PlayerID;
    responsible_pitcher_id: PlayerID;
    base_before_play: number;
    base_after_play: number;
    was_base_stolen: boolean;
    was_caught_stealing: boolean;
    was_picked_off: boolean;
    runner_scored: boolean;
}

export interface CauldronOutcome {
    game_event_id: CauldronEventID;
    entity_id: string;
    event_type: string;
    original_text: string;
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
