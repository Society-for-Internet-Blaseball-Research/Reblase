import { BlaseGame } from "./models";

const importantMessages: RegExp[] = [
    /hits a (Single|Double|Triple|grand slam)/,
    /hits a (solo|2-run|3-run) home run/,
    /steals (second base|third base|home)/,
    /scores/,
    /(2s|3s) score/,
    /Rogue Umpire/,
    /feedback/,
    /Reverb/,
    /(yummy|allergic) reaction/,
    /Blooddrain/,
    /Unstable/,
    /Flickering/,
    /hits [\w\s]+ with a pitch/,
    /The Shame Pit/,
    /Red Hot/,
    /they peck [\w\s]+ free!/,
    /Big Peanut/,
    /flock of Crows/,
];

export function isImportant(evt: BlaseGame): boolean {
    for (const regex of importantMessages) if (regex.test(evt.lastUpdate)) return true;

    return false;
}
