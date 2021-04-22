import { hasAttribute } from "./attributes";
import { PlayerID } from "./common";
import { BlaseballPlayer, BlaseballTeam } from "./models";

export function predictGamePitcher(
    team: BlaseballTeam,
    day: number,
    currentDay: number,
    getPlayer: (id: PlayerID) => BlaseballPlayer
): PlayerID {
    const slotOffset = team.rotationSlot ? team.rotationSlot - currentDay - 1 : 0;

    // making the assumption here that the offset is never negative to handle cases where the slot is bumped early
    const slot = day + Math.max(slotOffset, 0);

    return skipPlayers(slot, team, getPlayer);
}

function skipPlayers(slot: number, team: BlaseballTeam, getPlayer: (id: PlayerID) => BlaseballPlayer): PlayerID {
    for (let i = 0; i < team.rotation.length; i++) {
        const pitcherId = team.rotation[slot++ % team.rotation.length];
        const pitcher = getPlayer(pitcherId);
        if (!isPlayerSkippedInRotation(pitcher)) return pitcherId;
    }

    // fallback for the inevitable Snackrifice 2 or w/e so we don't infinitely spin
    // (whatever team actually yeets their entire rotation completely will still break this. godspeed.)
    return team.rotation[0];
}

function isPlayerSkippedInRotation(player: BlaseballPlayer) {
    return hasAttribute(player, "SHELLED") || hasAttribute(player, "ELSEWHERE");
}
