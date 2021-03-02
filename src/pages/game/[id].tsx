import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import queryString from "query-string";
import { ChroniclerGameUpdate, ChroniclerResponse } from "../../api/types";
import GameUpdateTable from "../../components/GameUpdateTable";
import { fromChroniclerGameUpdates, ReblaseGame, ReblaseGameUpdate } from "../../game";

interface GamePageProps {
    game: ReblaseGame;
    updates: ReblaseGameUpdate[];
}

function GamePage({ game, updates }: GamePageProps) {
    return (
        <div className="container">
            <h2>
                Season {game.seasonStr}, Day {game.dayStr}
            </h2>
            <p className="h6">
                <strong>{game.awayTeam.name}</strong> vs. <strong>{game.homeTeam.name}</strong>
            </p>

            <GameUpdateTable game={game} updates={updates} />
        </div>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext<{ id: string }>
): Promise<GetServerSidePropsResult<GamePageProps>> {
    const { id } = ctx.params!;

    const resp = await fetch(
        `https://api.sibr.dev/chronicler/v1/games/updates?${queryString.stringify({ game: id, count: 1000 })}`
    );
    const data = (await resp.json()) as ChroniclerResponse<ChroniclerGameUpdate>;
    if (!data) return { notFound: true };

    const { game, updates } = fromChroniclerGameUpdates(data.data);
    return {
        props: {
            game: game,
            updates: updates,
        },
    };
}

export default GamePage;
