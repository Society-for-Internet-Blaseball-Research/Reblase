import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { CauldronListFetching } from "../components/game/CauldronEventList";
import { cache } from "swr";
import Error from "../components/elements/Error";
import { useCauldronGameEvents, usePlayerTeamsList } from "../blaseball/hooks";
import { Link } from "react-router-dom";
import { BlaseballTeam, CauldronGameEvent } from "blaseball-lib/models";

interface PayloadProps {
    teams: BlaseballTeam[];
    evt: CauldronGameEvent;
}

const GameHeading = ({ teams, evt }: PayloadProps) => {
    const location = useLocation();

    if(!evt)
        return <p/>;

    const displaySeasonNumber = evt.season + 1;

    const awayTeamName = teams.find(x => x.id === evt.batter_team_id)?.fullName;
    const homeTeamName = teams.find(x => x.id === evt.pitcher_team_id)?.fullName;

    return (
        <>
            <p className="mb-2">
                <Link to={`/season/${displaySeasonNumber}`}>&larr; Back to Season {displaySeasonNumber}</Link>
            </p>
            <Link to={location.pathname}>
                <h2 className="text-3xl font-semibold">
                    Season {displaySeasonNumber}, Day {evt.day + 1}
                </h2>
                <h3>
                    <strong>{awayTeamName}</strong>
                    <small> vs. </small>
                    <strong>{homeTeamName}</strong>
                </h3>
            </Link>
        </>
    );
};

interface GamePageOptions {
    reverse: boolean;
}

type CauldronPageParams = { gameId?: string };
export function CauldronPage() {
    const { gameId } = useParams<CauldronPageParams>();

    // Never reuse caches across multiple games, then it feels slower because instant rerender...
    useEffect(() => cache.clear(), [gameId]);

    const { players: allPlayers, teams: allTeams } = usePlayerTeamsList();
 
    const teams = allTeams.map(x => x.data);
    const players = allPlayers.map(x => x.data);

    const [options, setOptions] = useState<GamePageOptions>({
        reverse: false,
    });

    if (options.reverse) setOptions({ ...options, reverse: true });

    const query = {
        gameId: gameId ?? "null",
        outcomes: true,
        baseRunners: true,
    };

    const { events, error, isLoading } = useCauldronGameEvents(query);

    if (error) return <Error>{error.toString()}</Error>;

    const first = events[0];

    return (
        <div className="container mx-auto px-4">
            <GameHeading teams={teams} evt={first} />

            <CauldronListFetching
                isLoading={isLoading}
                teams={teams}
                players={players}
                events={events}
                order={options.reverse ? "desc" : "asc"}
            />
        </div>
    );
}
