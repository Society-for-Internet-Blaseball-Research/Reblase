import React from "react";
import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import Error from "../components/elements/Error";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useGameList } from "../blaseball/hooks";
import { ChronGame } from "blaseball-lib/chronicler";
import { displaySeason } from "blaseball-lib/games";

interface SeasonData {
    name: string;
    start: string;
    end: string;
}

const seasonOverrides: Record<number, SeasonData> = {
    [-1]: {
        name: "The Coffee Cup \u{2615}",
        start: "2020-11-17T22:00:00Z",
        end: "2020-12-09T01:00:00Z",
    },
};

function getSeasonData(game: ChronGame) {
    const override = seasonOverrides[game.data.season];
    if (override) return override;

    const start = game.startTime ?? null;
    const end = start ? dayjs(start).add(6, "day").toISOString() : null;
    const name = `Season ${displaySeason(game.data.season)}`;

    return { name, start, end };
}

function SeasonRow(props: { game: ChronGame }) {
    const { data } = props.game;

    const seasonData = getSeasonData(props.game);

    const startDate = seasonData.start ? dayjs(seasonData.start) : null;
    const endDate = seasonData.end ? dayjs(seasonData.end) : null;

    const dateFormat = "MMM D, YYYY";

    const target = `/season/${data.season + 1}`;
    return (
        <Link
            className="flex px-4 py-2 border-b border-solid border-gray-300 dark:border-gray-700 items-center hover:bg-gray-200 dark-hover:bg-gray-800"
            to={target}
        >
            <span className="text-lg font-semibold">{seasonData.name}</span>
            <span className="text-gray-700 dark:text-gray-300 ml-4 mr-auto">
                {startDate?.format(dateFormat) ?? "TBD"} - {endDate?.format(dateFormat) ?? "TBD"}
            </span>
            <span className="text-semibold">View games</span>
        </Link>
    );
}

function SeasonGroup(props: { games: ChronGame[] }) {
    return (
        <div className="flex flex-col mb-6">
            {props.games.map((seasonGame) => (
                <SeasonRow key={seasonGame.gameId} game={seasonGame} />
            ))}
        </div>
    );
}

export function SeasonListPage() {
    const query = { day: 0 };
    const { games, error, isLoading } = useGameList(query);

    if (error) return <Error>{error.toString()}</Error>;
    if (isLoading) return <Loading />;

    const seasons: Partial<Record<number, ChronGame>> = {};
    for (const game of games) {
        if (!seasons[game.data.season]) seasons[game.data.season] = game;
    }

    const seasonsList = Object.keys(seasons)
        .map((s) => parseInt(s))
        .sort((a, b) => {
            // lol
            if (a < 0) a += 100;
            if (b < 0) b += 100;

            return b - a;
        })
        .map((s) => seasons[s]!);

    const expansionEra = seasonsList.filter((x) => x.data.season >= 11);
    const disciplineEra = seasonsList.filter((x) => x.data.season >= 0 && x.data.season < 11);
    const exhibitions = seasonsList.filter((x) => x.data.season < 0);

    return (
        <Container className={"mt-4"}>
            <h2 className="text-2xl font-semibold mb-2">Expansion Era</h2>
            <SeasonGroup games={expansionEra} />

            <h2 className="text-2xl font-semibold mb-2">Discipline Era</h2>
            <SeasonGroup games={disciplineEra} />

            <h2 className="text-2xl font-semibold mb-2">Exhibitions</h2>
            <SeasonGroup games={exhibitions} />
        </Container>
    );
}
