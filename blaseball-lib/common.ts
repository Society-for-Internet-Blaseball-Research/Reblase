export type PlayerID = string;
export type TeamID = string;
export type GameID = string;
export type AttributeID = string;
export type LeagueID = string;
export type SubleagueID = string;
export type DivisionID = string;
export type SeasonID = string;
export type PlayoffsID = string;
export type StadiumID = string;

export interface BlaseballEntity<T> {
    id?: T;
    _id?: T;
}

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

export interface BlaseballAttributes {
    permAttr?: AttributeID[];
    seasAttr?: AttributeID[];
    weekAttr?: AttributeID[];
    gameAttr?: AttributeID[];
}

export interface BlaseballAttributesDeprecated {
    seasonAttributes?: AttributeID[];
    permanentAttributes?: AttributeID[];
}

export interface TeamRoster {
    lineup: PlayerID[];
    rotation: PlayerID[];
    bullpen: PlayerID[];
    bench: PlayerID[];
}

export enum FeedCategory {
    Game = 0,
    Changes = 1,
    Abilities = 2,
    Outcomes = 3,
    Narrative = 4,
}
