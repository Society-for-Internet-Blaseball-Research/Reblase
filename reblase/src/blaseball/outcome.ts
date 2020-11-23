export interface Outcome {
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

const shameOutcome: OutcomeType = { name: "Shame", emoji: "\u{1F7E3}", search: [], color: "purple" };

export const outcomeTypes: OutcomeType[] = [
    shameOutcome,
    { name: "Party", emoji: "\u{1F389}", search: [/Partying/i], color: "gray" },
    { name: "Chain", emoji: "\u{1F517}", search: [/The Instability chains/i], color: "gray" },
    { name: "Reverb", emoji: "\u{1F30A}", search: [/reverb/i], color: "blue" },
    { name: "Beaned", emoji: "\u{1F3AF}", search: [/hits [\w\s]+ with a pitch/], color: "blue" },
    { name: "Feedback", emoji: "\u{1F3A4}", search: [/feedback/i], color: "pink" },
    { name: "Incineration", emoji: "\u{1F525}", search: [/rogue umpire/i], color: "orange" },
    { name: "Blooddrain", emoji: "\u{1FA78}", search: [/blooddrain/i], color: "purple" },
    { name: "Unstable", emoji: "\u{1F974}", search: [/Unstable/i], color: "blue" },
    { name: "Flickering", emoji: "\u{26A1}", search: [/Flickering/i], color: "blue" },
    { name: "Birds", emoji: "\u{1F426}", search: [/The Birds pecked/i], color: "purple" },
    { name: "Peanut", emoji: "\u{1F95C}", search: [/peanut/i], color: "orange" },
    { name: "Sun 2", emoji: "\u{1F31E}", search: [/Sun 2/i], color: "orange" },
    { name: "Black Hole", emoji: "\u{26AB}", search: [/Black Hole/i], color: "gray" },
    { name: "Percolated", emoji: "\u{2615}", search: [/Percolated/], color: "brown" },
];

export function getOutcomes(outcomes: string[], shame?: boolean, awayTeam?: string): Outcome[] {
    const foundOutcomes = [];

    if (shame && awayTeam) {
        const outcome = {
            ...shameOutcome,
            text: `The ${awayTeam} were shamed!`,
        };
        foundOutcomes.push(outcome);
    }

    for (const outcomeText of outcomes) {
        let foundType = null;
        for (const outcomeType of outcomeTypes) {
            for (const outcomeSearch of outcomeType.search) {
                // Use a flag since multiple matching searchs shouldn't duplicate
                if (foundType == null && outcomeSearch.test(outcomeText)) foundType = outcomeType;
            }
        }

        if (foundType) {
            const outcome = {
                ...foundType,
                text: outcomeText.trim(),
            };
            foundOutcomes.push(outcome);
        }
    }

    return foundOutcomes;
}
