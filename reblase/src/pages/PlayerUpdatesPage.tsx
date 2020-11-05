import { usePlayerUpdates } from "blaseball/hooks";
import { Loading } from "components/elements/Loading";
import React, { useState } from "react";
import { useParams } from "react-router";
import { calculateStars } from "blaseball-lib/stats";
import Error from "../components/elements/Error";
import { BlaseballPlayer } from "blaseball-lib/models";
import { displayBloodType, displayCoffeeType, generateSoulScream } from "blaseball-lib/players";
import { ChronPlayerUpdate } from "blaseball-lib/chronicler";
import deepEqual from "deep-equal";
import { PlayerCard } from "components/website/PlayerCard";
import { Container } from "components/layout/Container";
import dayjs from "dayjs";

interface PlayerState {
    name: string;
    battingStars: number;
    pitchingStars: number;
    baserunningStars: number;
    defenseStars: number;
    item: string | null;
    armor: string | null;
    evolution: string;
    ritual: string | null;
    coffee: string;
    blood: string;
    fate: number;
    soulscream: string;
}

function getState(player: BlaseballPlayer): PlayerState {
    const stars = calculateStars(player, "rounded");
    return {
        name: player.name,
        battingStars: stars.batting,
        pitchingStars: stars.pitching,
        baserunningStars: stars.baserunning,
        defenseStars: stars.defense,
        item: player.bat ? player.bat : null,
        armor: player.armor ? player.armor : null,
        evolution: "Base",
        ritual: player.ritual ? player.ritual : null,
        coffee: displayCoffeeType(player.coffee ?? -1, false),
        blood: displayBloodType(player.blood ?? -1),
        fate: player.fate ?? 0,
        soulscream: generateSoulScream(player),
    };
}

interface StateUpdate {
    id: string;
    firstSeen: string;
    lastSeen: string;
    state: PlayerState;
}

function consolidateStates(updates: ChronPlayerUpdate[]): StateUpdate[] {
    const states: StateUpdate[] = [];

    for (const update of updates) {
        const thisState = getState(update.data);

        const lastUpdate = states[states.length - 1];
        if (!lastUpdate || !deepEqual(thisState, lastUpdate.state)) {
            states.push({
                id: update.updateId,
                firstSeen: update.firstSeen,
                lastSeen: update.lastSeen,
                state: thisState,
            });
        } else {
            lastUpdate.lastSeen = update.lastSeen;
        }
    }

    return states;
}

export type ChangeType = string;

function getChangesBetween(prev: PlayerState, next: PlayerState): ChangeType[] {
    const changes = [];

    if (prev.name !== next.name) changes.push("Name");

    if (prev.battingStars !== next.battingStars) changes.push("Batting");
    if (prev.pitchingStars !== next.pitchingStars) changes.push("Pitching");
    if (prev.baserunningStars !== next.baserunningStars) changes.push("Baserunning");
    if (prev.defenseStars !== next.defenseStars) changes.push("Defense");

    if (prev.item !== next.item) changes.push("Item");
    if (prev.armor !== next.armor) changes.push("Armor");

    if (prev.evolution !== next.evolution) changes.push("Evolution");
    if (prev.ritual !== next.ritual) changes.push("Pregame Ritual");
    if (prev.coffee !== next.coffee) changes.push("Coffee Style");
    if (prev.blood !== next.blood) changes.push("Blood Type");
    if (prev.fate !== next.fate) changes.push("Fate");
    if (prev.soulscream !== next.soulscream) changes.push("Soulscream");

    return changes;
}

export default function PlayerUpdatesPage() {
    const { playerId } = useParams<{ playerId: string }>();
    const [selectedUpdate, setSelectedUpdate] = useState<string | null>(null);

    const { updates, error } = usePlayerUpdates({ player: playerId, count: 1000 });

    if (error) return <Error>{error.toString()}</Error>;
    if (!updates) return <Loading />;

    const stateUpdates = consolidateStates(updates);
    if (selectedUpdate === null) setSelectedUpdate(stateUpdates[stateUpdates.length - 1].id);

    stateUpdates.reverse();
    return (
        <Container className="my-4 flex flex-row">
            <div className="flex-1 flex flex-col items-center">
                <table className="w-full table-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="px-4 py-2">Timestamp</th>
                            {/* <th className="px-4 py-2">Last Seen</th> */}
                            <th className="px-4 py-2">Changes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stateUpdates.map((update, idx) => {
                            const state = update.state;
                            const prevUpdate = stateUpdates[idx + 1];
                            const changes = prevUpdate && getChangesBetween(prevUpdate.state, state);
                            return (
                                <tr
                                    className={`even:bg-gray-100 border-b border-t cursor-pointer ${
                                        selectedUpdate === update.id
                                            ? "bg-blue-500 text-white"
                                            : "border-gray-300 hover:bg-gray-200"
                                    }`}
                                    onClick={() => setSelectedUpdate(update.id)}
                                >
                                    <td className="px-4 py-2">{dayjs(update.firstSeen).format("YYYY-MM-DD HH:mm")}</td>
                                    {/* <td className="px-4 py-2">{dayjs(update.lastSeen).format("YYYY-MM-DD HH:mm")}</td> */}
                                    <td className="px-4 py-2">{prevUpdate ? changes.join(", ") : "(first seen)"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex-1">
                {selectedUpdate && (
                    <ul className="flex-1 p-8 bg-black flex flex-col space-y-8">
                        {stateUpdates
                            .filter((update) => update.id === selectedUpdate)
                            .map((update) => {
                                const state = update.state;
                                return (
                                    <li className="mx-auto" style={{ width: "500px" }}>
                                        <PlayerCard
                                            name={state.name}
                                            teamName={"TODO"}
                                            teamEmoji={"?"}
                                            teamColor={"#fff"}
                                            battingStars={state.battingStars}
                                            pitchingStars={state.pitchingStars}
                                            baserunningStars={state.baserunningStars}
                                            defenseStars={state.defenseStars}
                                            vibes={0.05}
                                            item={state.item}
                                            armor={state.armor}
                                            evolution={state.evolution}
                                            ritual={state.ritual}
                                            coffee={state.coffee}
                                            blood={state.blood}
                                            fate={state.fate}
                                            soulscream={state.soulscream}
                                        />
                                    </li>
                                );
                            })}
                    </ul>
                )}
            </div>
        </Container>
    );
}
