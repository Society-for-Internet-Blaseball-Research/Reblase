import { ReblaseGame, ReblaseGameUpdate } from "../game";
import GameUpdateRow from "./GameUpdateRow";

export interface GameUpdateTableProps {
    game: ReblaseGame;
    updates: ReblaseGameUpdate[];
}

function GameUpdateTable({ game, updates }: GameUpdateTableProps) {
    return (
        <div>
            <table role="table" className="UpdateTable">
                {updates.map((u) => (
                    <GameUpdateRow key={u.id} game={game} update={u} />
                ))}
            </table>
        </div>
    );
}

export default GameUpdateTable;
