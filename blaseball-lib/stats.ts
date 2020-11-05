import { BaserunningStats, BattingStats, DefenseStats, PitchingStats, PlayerStats } from "./common";

export function calculateBattingSkill(stats: BattingStats): number {
    return (
        Math.pow(1 - stats.tragicness, 0.01) *
        Math.pow(stats.buoyancy, 0) *
        Math.pow(stats.thwackability, 0.35) *
        Math.pow(stats.moxie, 0.075) *
        Math.pow(stats.divinity, 0.35) *
        Math.pow(stats.musclitude, 0.075) *
        Math.pow(1 - stats.patheticism, 0.05) *
        Math.pow(stats.martyrdom, 0.02)
    );
}

export function calculatePitchingSkill(stats: PitchingStats): number {
    return (
        Math.pow(stats.shakespearianism, 0.1) *
        Math.pow(stats.suppression, 0) *
        Math.pow(stats.unthwackability, 0.5) *
        Math.pow(stats.coldness, 0.025) *
        Math.pow(stats.overpowerment, 0.15) *
        Math.pow(stats.ruthlessness, 0.4)
    );
}

export function calculateBaserunningSkill(stats: BaserunningStats): number {
    return (
        Math.pow(stats.laserlikeness, 0.5) *
        Math.pow(stats.continuation, 0.1) *
        Math.pow(stats.baseThirst, 0.1) *
        Math.pow(stats.indulgence, 0.1) *
        Math.pow(stats.groundFriction, 0.1)
    );
}

export function calculateDefenseSkill(stats: DefenseStats): number {
    return (
        Math.pow(stats.omniscience, 0.2) *
        Math.pow(stats.tenaciousness, 0.2) *
        Math.pow(stats.watchfulness, 0.1) *
        Math.pow(stats.anticapitalism, 0.1) *
        Math.pow(stats.chasiness, 0.1)
    );
}

export function calculateSkills(stats: PlayerStats) {
    return {
        batting: calculateBattingSkill(stats),
        pitching: calculatePitchingSkill(stats),
        baserunning: calculateBaserunningSkill(stats),
        defense: calculateDefenseSkill(stats),
    };
}

export function skillToStars(skill: number, rounded: "rounded" | "unrounded"): number {
    if (rounded === "rounded") return Math.round(skill * 5 * 2) / 2;
    else return skill * 5;
}

export function calculateStars(stats: PlayerStats, rounded: "rounded" | "unrounded") {
    return {
        batting: skillToStars(calculateBattingSkill(stats), rounded),
        pitching: skillToStars(calculatePitchingSkill(stats), rounded),
        baserunning: skillToStars(calculateBaserunningSkill(stats), rounded),
        defense: skillToStars(calculateDefenseSkill(stats), rounded),
    };
}
