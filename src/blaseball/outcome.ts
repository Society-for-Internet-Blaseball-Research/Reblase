import {GamePayload} from "./update";

interface Outcome {
    name: string;
    emoji: string;
    text: string;
    color: string;
}

interface OutcomeType {
    name: string;
    emoji: string;
    search: RegExp[];
    color: string;
}

export const outcomeTypes: OutcomeType[] = [
    {name: "Party", emoji: "\u{1F389}", search: [/Partying/i], color: "yellow"},
    {name: "Chain", emoji: "\u{1F517}", search: [/The Instability chains/i], color: "grey"},
    {name: "Reverb", emoji: "\u{1F30A}", search: [/reverb/i], color: "blue"},
    {name: "Feedback", emoji: "\u{1F3A4}", search: [/feedback/i], color: "pink"},
    {name: "Incineration", emoji: "\u{1F525}", search: [/rogue umpire/i], color: "orange"},
    {name: "Peanut", emoji: "\u{1F95C}", search: [/peanut/i], color: "orange"},
    {name: "Blooddrain", emoji: "\u{1FA78}", search: [/blooddrain/i], color: "purple"},
    {name: "Unstable", emoji: "\u{1F974}", search: [/Unstable/i], color: "blue"},
    {name: "Flickering", emoji: "\u{26A1}", search: [/Flickering/i], color: "blue"},
    {name: "Birds", emoji: "\u{1F426}", search: [/The Birds pecked/i], color: "purple"}
]

export function getOutcomes(evt: GamePayload): Outcome[] {
    const foundOutcomes = [];
    for (const outcomeText of evt.outcomes) {
        let foundType = null;
        for (const outcomeType of outcomeTypes) {
            for (const outcomeSearch of outcomeType.search) {
                // Use a flag since multiple matching searchs shouldn't duplicate
                if (foundType == null && outcomeSearch.test(outcomeText))
                    foundType = outcomeType;
            }
        }

        if (foundType) {
            const outcome = {
                ...foundType,
                text: outcomeText
            };
            foundOutcomes.push(outcome);
        }
    }

    return foundOutcomes;
}