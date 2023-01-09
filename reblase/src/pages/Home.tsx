import { useFeedSeasonList, useGameList, usePlayerTeamsList, useSimulation } from "../blaseball/hooks";
import { BlaseballFeedSeasonList, BlaseballTeam } from "blaseball-lib/models";
import React from "react";
import Error from "../components/elements/Error";
import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import { Link } from "react-router-dom";
import { GameRow } from "../components/gamelist/GameRow";
import {
    displaySeason,
    displaySim,
    didSimHaveMultipleSeasons,
    STATIC_ID,
    displaySimSeasonAndDayPlaintext,
    displaySimAndSeasonPlaintext,
} from "blaseball-lib/games";
import { PlayerID } from "blaseball-lib/common";

export function Home() {
    return (
        <Container>
            <p className="mb-4">Hi! {"\u{1F44B}"} Select a season up top to view more games.</p>

            <div>
                <h3 className="text-2xl font-semibold">On the Return of Blaseball</h3>
                <p>Reblase is currently only working for beta game data -- SIBR are actively working on getting it back up and running for the return, but it'll probably be a few weeks until that happens. Until then, this site will still work to display data for the beta seasons.</p>
            </div>
        </Container>
    );
}
