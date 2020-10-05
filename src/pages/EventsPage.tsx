import React from "react";

import { Loading } from "../components/Loading";
import { Container } from "../components/Container";
import { getOutcomes } from "../blaseball/outcome";
import Error from "../components/Error";
import { getTeam, TeamInfo } from "../blaseball/team";
import { Link } from "react-router-dom";
import { useGameList } from "../blaseball/hooks";

interface GameEvent {
    game: string;
    season: number;
    day: number;
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
    type: string;
    text: string[];
    emoji: string;
    color: string;
}

const EventRow = ({ evt }: { evt: GameEvent }) => {
    return (
        <div className="border-b border-gray-300 py-2">
            <div className="flex">
                <Link to={`/game/${evt.game}`} className="text-sm font-semibold flex-1">
                    {evt.emoji} {evt.type}
                </Link>
                <Link to={`/game/${evt.game}`} className="text-sm">
                    Season <strong>{evt.season + 1}</strong>, Day <strong>{evt.day + 1}</strong>
                </Link>
            </div>
            <p className="text-sm whitespace-pre-line float-left">{evt.text.join("\n")}</p>
            <span className="text-sm text-gray-700 float-right">
                {evt.awayTeam.nickname} vs. {evt.homeTeam.nickname}
            </span>
        </div>
    );
};

export function EventsPage() {
    const { games, error, isLoading } = useGameList({ outcomes: true, order: "desc" });
    if (error) return <Error>{error.toString()}</Error>;
    if (isLoading) return <Loading />;

    const events: GameEvent[] = [];
    for (let game of games) {
        const outcomes = getOutcomes(game.data);
        for (let outcome of outcomes) {
            const lastEvent = events[events.length - 1];
            if (lastEvent && lastEvent.game === game.gameId && lastEvent.type === outcome.name) {
                lastEvent.text.push(outcome.text);
                continue;
            }

            if (outcome.name === "Party")
                // too damn many
                continue;

            events.push({
                game: game.gameId,
                season: game.data.season,
                day: game.data.day,
                homeTeam: getTeam(game.data, "home"),
                awayTeam: getTeam(game.data, "away"),
                type: outcome.name,
                text: [outcome.text],
                color: outcome.color,
                emoji: outcome.emoji,
            });
        }
    }

    return (
        <Container className={"mt-4"}>
            <h2 className="text-2xl font-semibold mb-2">Recent game events</h2>

            <div className="flex flex-col">
                {events.map((evt, idx) => (
                    <EventRow evt={evt} key={idx} />
                ))}
            </div>
        </Container>
    );
}
