import { hasAttribute } from "./attributes";
import { PlayerID, TeamRoster } from "./common";
import { BlaseballPlayer } from "./models";

export function predictGamePitcher(
    team: TeamRoster,
    day: number,
    getPlayer: (id: PlayerID) => BlaseballPlayer
): PlayerID {
    let pitcher = null;
    do {
        pitcher = team.rotation[day++ % team.rotation.length];
    } while (hasAttribute(getPlayer(pitcher), "SHELLED"));
    return pitcher;
}
