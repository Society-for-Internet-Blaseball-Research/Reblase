import { BlaseGame } from "./models";

const importantMessages: RegExp[] = [
    // TODO once 5th base lands, are these correct?
    /hits a (Single|Double|Triple|Quadruple|grand slam)/,
    /hits a (solo|2-run|3-run|4-run) home run/,
    /steals (second base|third base|fourth base|fifth base|home)/,
    /scores/,
    /(2s|3s|4s) score/,
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
