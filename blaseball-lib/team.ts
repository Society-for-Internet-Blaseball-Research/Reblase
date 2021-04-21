import { hasAttribute } from "./attributes";
import { PlayerID, TeamRoster } from "./common";
import { BlaseballPlayer } from "./models";

export function predictGamePitcher(
    team: TeamRoster,
    day: number,
    currentDay: number,
    getPlayer: (id: PlayerID) => BlaseballPlayer
): PlayerID {
    if (team.rotationSlot !== undefined) {
        day += team.rotationSlot - currentDay - 1;
    }
    let pitcher = null;
    do {
        pitcher = team.rotation[day++ % team.rotation.length];
    } while (["SHELLED", "ELSEWHERE"].some((a) => hasAttribute(getPlayer(pitcher), a)));
    return pitcher;
}
