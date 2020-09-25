import {GamePayload} from "./update";

interface Weather {
    name: string;
    emoji: string;
}

export const weatherTypes: Partial<Record<number, Weather>> = {
    7: {name: "Solar Eclipse", emoji: "\u{1F311}"},
    9: {name: "Blooddrain", emoji: "\u{1FA78}"},
    10: {name: "Peanuts", emoji: "\u{1F95C}"},
    11: {name: "Birds", emoji: "\u{1F426}"},
    12: {name: "Feedback", emoji: "\u{1F3A4}"},
    13: {name: "Reverb", emoji: "\u{1F30A}"}
}

export function getWeather(evt: GamePayload): Weather | null {
    return weatherTypes[evt.weather] ?? null;
}