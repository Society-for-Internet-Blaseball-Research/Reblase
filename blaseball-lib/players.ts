export const bloodTypes = [
    "A",
    "AAA",
    "AA",
    "Acidic",
    "Basic",
    "O",
    "O No",
    "H₂O",
    "Electric",
    "Love",
    "Fire",
    "Psychic",
    "Grass",
];

export const coffeeTypes = [
    "Black",
    "Light & Sweet",
    "Macchiato",
    "Cream & Sugar",
    "Cold Brew",
    "Flat White",
    "Americano",
    "Espresso", // Displayed as Coffee?
    "Heavy Foam",
    "Latte",
    "Decaf",
    "Milk Substitute",
    "Plenty of Sugar",
    "Anything",
];

export function displayBloodType(id: number): string {
    return bloodTypes[id] ?? "Blood?";
}

export function displayCoffeeType(id: number, espressoIsATypeOfCoffee: boolean): string {
    if (id === 7 && !espressoIsATypeOfCoffee) return "Coffee?";
    return coffeeTypes[id] ?? "Coffee?";
}

export interface SoulscreamStats {
    pressurization: number;
    divinity: number;
    tragicness: number;
    shakespearianism: number;
    ruthlessness: number;
    soul: number;
}

export function generateSoulScream(stats: SoulscreamStats): string {
    const chars = ["A", "E", "I", "O", "U", "X", "H", "A", "E", "I"];
    const soulStats = [
        stats.pressurization,
        stats.divinity,
        stats.tragicness,
        stats.shakespearianism,
        stats.ruthlessness,
    ];

    let scream = "";
    for (let digitPosition = 0; digitPosition < stats.soul; digitPosition++) {
        for (let statIndex = 0; statIndex < 11; statIndex++) {
            const digitMask = 1 / Math.pow(10, digitPosition);
            const statDigit = soulStats[statIndex % soulStats.length] % digitMask;
            const digitValue = Math.floor((statDigit / digitMask) * 10);
            scream += chars[digitValue];
        }
    }
    return scream;
}

export interface VibeStats {
    pressurization: number;
    buoyancy: number;
    cinnamon: number;
}

export function calculateVibes(stats: VibeStats, gameDay: number): number {
    const offset = 0.5 * (stats.pressurization + stats.cinnamon);
    const frequency = 6 + Math.round(10 * stats.buoyancy);
    const phase = Math.PI * ((2 / frequency) * gameDay);
    return offset * Math.cos(phase) - offset;
}

export interface VibeCategory {
    level: number;
    arrows: number;
    direction: "up" | "down" | "neutral";
    text: string;
    threshold: number | null;
}

export const allVibeCategories: VibeCategory[] = [
    { level: 6, threshold: 0.8, arrows: 3, direction: "up", text: "Most Excellent" },
    { level: 5, threshold: 0.4, arrows: 2, direction: "up", text: "Excellent" },
    { level: 4, threshold: 0.1, arrows: 1, direction: "up", text: "Quality" },
    { level: 3, threshold: -0.1, arrows: 1, direction: "neutral", text: "Neutral" },
    { level: 2, threshold: -0.4, arrows: 1, direction: "down", text: "Less Than Ideal" },
    { level: 1, threshold: -0.8, arrows: 2, direction: "down", text: "Far Less Than Ideal" },
    { level: 0, threshold: null, arrows: 3, direction: "down", text: "Honestly Terrible" },
];

export function getVibeCategory(vibe: number): VibeCategory {
    for (const category of allVibeCategories) {
        if (!category.threshold || vibe > category.threshold) return category;
    }
}
