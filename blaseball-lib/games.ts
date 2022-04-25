import { PlayerID, TeamID } from "./common";
import { BlaseballFeedSeasonList, BlaseballGame } from "./models";

export const STATIC_ID = "thisidisstaticyo";

export interface GameTeam {
    id: TeamID;
    name: string;
    nickname: string;
    emoji: string;
    color: string;
    secondaryColor?: string;

    isBatting: boolean;
    isPitching: boolean;

    odds: number;
    score: number;
    opposingScore: number;

    batter: PlayerID | null;
    batterName: string | null;
    pitcher: PlayerID | null;
    pitcherName: PlayerID | null;

    totalBases: number;
    maxBalls: number;
    maxStrikes: number;
    maxOuts: number;
}

const nullIfEmpty = (s: string | null) => (s === "" ? null : s);

export function getHomeTeam(game: BlaseballGame): GameTeam {
    return {
        id: game.homeTeam,
        name: game.homeTeamName,
        nickname: game.homeTeamNickname,
        emoji: game.homeTeamEmoji,
        color: game.homeTeamColor,
        secondaryColor: game.homeTeamSecondaryColor,

        isBatting: !game.topOfInning,
        isPitching: game.topOfInning,

        odds: game.homeOdds,
        score: game.homeScore,
        opposingScore: game.awayScore,

        batter: nullIfEmpty(game.homeBatter),
        batterName: nullIfEmpty(game.homeBatterName),
        pitcher: nullIfEmpty(game.homePitcher),
        pitcherName: nullIfEmpty(game.homePitcherName),

        totalBases: game.homeBases ?? 4,
        maxBalls: game.homeBalls ?? 4,
        maxStrikes: game.homeStrikes ?? 3,
        maxOuts: game.homeOuts ?? 3,
    };
}

export function getAwayTeam(game: BlaseballGame): GameTeam {
    return {
        id: game.awayTeam,
        name: game.awayTeamName,
        nickname: game.awayTeamNickname,
        emoji: game.awayTeamEmoji,
        color: game.awayTeamColor,
        secondaryColor: game.awayTeamSecondaryColor,

        isBatting: game.topOfInning,
        isPitching: !game.topOfInning,

        odds: game.awayOdds,
        score: game.awayScore,
        opposingScore: game.homeScore,

        batter: game.awayBatter,
        batterName: game.awayBatterName,
        pitcher: game.awayPitcher,
        pitcherName: game.awayPitcherName,

        totalBases: game.awayBases ?? 4,
        maxBalls: game.awayBalls ?? 4,
        maxStrikes: game.awayStrikes ?? 3,
        maxOuts: game.awayOuts ?? 3,
    };
}

export function getBattingTeam(game: BlaseballGame): GameTeam {
    return game.topOfInning ? getAwayTeam(game) : getHomeTeam(game);
}

export function getPitchingTeam(game: BlaseballGame): GameTeam {
    return game.topOfInning ? getHomeTeam(game) : getAwayTeam(game);
}

export interface BaseState {
    filled: boolean;
    baserunner: PlayerID | null;
    baserunnerName: string | null;
}

export interface GameState {
    balls: number;
    maxBalls: number;

    strikes: number;
    maxStrikes: number;

    outs: number;
    maxOuts: number;

    homeScore: number;
    awayScore: number;

    bases: BaseState[];
}

export function getGameState(game: BlaseballGame): GameState {
    const bases = [];

    const highestRunnableBase = ((game.topOfInning ? game.awayBases : game.homeBases) ?? 4) - 2;
    const highestFilledBase = Math.max(...game.basesOccupied);
    for (let i = 0; i <= Math.max(highestFilledBase, highestRunnableBase); i++) {
        const runnerIndex = game.basesOccupied.indexOf(i);
        bases.push({
            filled: runnerIndex !== -1,
            baserunner: game.baseRunners[runnerIndex] ?? null,
            baserunnerName: (game.baseRunnerNames ?? [])[runnerIndex] ?? null,
        });
    }

    return {
        balls: game.atBatBalls,
        maxBalls: 3, // for now...

        strikes: game.atBatStrikes,
        maxStrikes: (game.topOfInning ? game.awayStrikes : game.homeStrikes) ?? 3,

        outs: game.halfInningOuts,
        maxOuts: 3, // for now...

        homeScore: game.homeScore,
        awayScore: game.awayScore,

        bases: bases,
    };
}

export function isGameUpdateImportant(update: string, scoreUpdate: string | null): boolean {
    if (scoreUpdate) return true;
    for (const pattern of [
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
        /pecked [\w\s]+ free!/,
        /Big Peanut/,
        /flock of Crows/,
        /murder of Crows/,
        /charms/,
        /Sun 2 smiles/,
        /Sun 30 smiled/,
        /Black Hole swallow/,
        /is Beaned by/,
        /is Percolated/,
        /tastes the infinite/,
        /surge of Immateria/,
        /(swept|returned from) Elsewhere/,
        /CONSUMERS ATTACK/,
        /ECHO/,
        /STATIC/,
        /Echoed/,
        /The Salmon swim upstream!/,
        /is now being Observed/,
        /The Polarity shifted!/,
        /hops on the Grind Rail/,
        /The Community Chest Opens!/,
        /A shimmering Crate descends/,
        /(were|was) repaired by Smithy/,
        /broke!/,
        /(were|was) damaged./,
        /Prize Match!/,
        /entered the Tunnels/,
        /Night Shift/,
        /trade(d?)/,
        /attempted a Heist/,
        /They approached/,
        /evaded them/,
        /collected/,
        /Weather Report arrived from History/,
        /Black Hole \(Black Hole\)/,
        /was Frozen/,
    ]) {
        if (pattern.test(update)) return true;
    }
    return false;
}

export function displaySeason(seasonNumber: number) {
    if (seasonNumber === -1) return "\u2615";
    return (seasonNumber + 1).toString();
}

export function displaySim(sim: string, feedSeasons: BlaseballFeedSeasonList | undefined | null) {
    if (sim == "gamma10") return "Gamma 4";
    if (sim == STATIC_ID || !feedSeasons) return "";
    const feedSeasonIndex = feedSeasons.collection.findIndex((seasonEntry) => seasonEntry.sim == sim);
    if (feedSeasonIndex == -1) return "Unknown SIM";
    return feedSeasons.collection[feedSeasonIndex].name;
}

export function shouldSimBeShown(sim: string, feedSeasons: BlaseballFeedSeasonList | null) {
    if (sim == "gamma10") return true; // hack while we wait for TGB to update feed_season_list.json
    if (sim == STATIC_ID) return true;
    if (!feedSeasons) return false;
    if (sim == "gamma4") return false; // hardcoding this because we don't have data but the site does
    const feedSeasonIndex = feedSeasons.collection.findIndex((seasonEntry) => seasonEntry.sim == sim);
    return feedSeasonIndex !== -1;
}

export function didSimHaveMultipleSeasons(sim: string | undefined) {
    return sim !== "gamma10" && sim !== "gamma9";
}

export function displaySimAndSeasonPlaintext(
    sim: string | undefined,
    season: number,
    feedSeasons: BlaseballFeedSeasonList | undefined | null
) {
    if (sim === STATIC_ID || !sim) {
        return `Season ${displaySeason(season)}`;
    }

    const simHadMultipleSeasons = didSimHaveMultipleSeasons(sim);
    if (simHadMultipleSeasons) {
        return `${displaySim(sim, feedSeasons)}, Season ${displaySeason(season)}`;
    }

    return displaySim(sim, feedSeasons);
}

export function displaySimAndSeasonShorthand(
    sim: string | undefined,
    season: number,
    feedSeasons: BlaseballFeedSeasonList | undefined | null
) {
    if (sim === STATIC_ID || !sim) {
        return season === -1 ? "S\u2615" : `S${season + 1}`;
    }

    const simString = displaySim(sim, feedSeasons);
    const gammaNumber = parseInt(simString.split(" ")[1]);

    const simHadMultipleSeasons = didSimHaveMultipleSeasons(sim);
    if (simHadMultipleSeasons) {
        return `G${gammaNumber}/S${season + 1}`;
    }

    return `G${gammaNumber}`;
}

export function displaySimSeasonAndDayPlaintext(
    sim: string | undefined,
    season: number,
    day: number,
    feedSeasons: BlaseballFeedSeasonList | undefined | null
) {
    const simIsStaticIdYo = sim === STATIC_ID || !sim;

    if (sim === STATIC_ID || !sim) {
        return `Season ${displaySeason(season)}, Day ${day + 1}`;
    }

    return `${!simIsStaticIdYo ? displaySim(sim!, feedSeasons) + ", " : ""}${
        !simIsStaticIdYo && didSimHaveMultipleSeasons(sim) ? "Season " + displaySeason(season) + ", " : ""
    }Day ${day + 1}`;
}
