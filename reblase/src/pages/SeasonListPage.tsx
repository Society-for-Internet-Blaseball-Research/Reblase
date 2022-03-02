import React from "react";
import { Container } from "../components/layout/Container";
import { Loading } from "../components/elements/Loading";
import Error from "../components/elements/Error";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useFeedSeasonList, useGameList } from "../blaseball/hooks";
import { ChronGame } from "blaseball-lib/chronicler";
import { displaySeason, displaySim, shouldSimBeShown, STATIC_ID } from "blaseball-lib/games";
import { BlaseballFeedSeasonList } from "blaseball-lib/models";
import Twemoji from "components/elements/Twemoji";

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

function getSeasonData(game: ChronGame, feedSeasonList?: BlaseballFeedSeasonList) {
    const override = seasonOverrides[game.data.season];
    if (override) return override;

    const start = game.startTime ?? null;
    const end = start ? dayjs(start).add(6, "day").toISOString() : null;
    const name = game.data.sim && game.data.sim !== STATIC_ID
            ? `${displaySim(game.data.sim, feedSeasonList ?? null)}, Season ${displaySeason(game.data.season)}`
            : `Season ${displaySeason(game.data.season)}`;

    return { name, start, end };
}

function SeasonRow(props: { game: ChronGame; feedSeasonList?: BlaseballFeedSeasonList }) {
    const { data } = props.game;

    const seasonData = getSeasonData(props.game, props.feedSeasonList);

    const startDate = seasonData.start ? dayjs(seasonData.start) : null;
    const endDate = seasonData.end ? dayjs(seasonData.end) : null;

    const dateFormat = "MMM D, YYYY";

    const target =
        data.sim && data.sim !== STATIC_ID ? `/season/${data.season + 1}/${data.sim}` : `/season/${data.season + 1}`;
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

function SeasonGroup(props: { games: ChronGame[]; feedSeasonList?: BlaseballFeedSeasonList }) {
    return (
        <div className="flex flex-col mb-6">
            {props.games.map((seasonGame) => (
                <SeasonRow key={seasonGame.gameId} game={seasonGame} feedSeasonList={props.feedSeasonList} />
            ))}
        </div>
    );
}

export function SeasonListPage() {
    const query = { day: 0 };
    const { games, error, isLoading } = useGameList(query);
    const { feedSeasonList, error: feedSeasonListError, isLoading: isLoadingFeedSeasonList } = useFeedSeasonList();

    if (error || feedSeasonListError) return <Error>{(error || feedSeasonListError).toString()}</Error>;
    if (isLoading || isLoadingFeedSeasonList) return <Loading />;

    const shortCircuitSeasons: Record<string, Record<number, ChronGame>> = {};
    const shortCircuitFlat: ChronGame[] = [];
    const seasons: Partial<Record<number, ChronGame>> = {};
    for (const game of games) {
        const sim = game.data.sim!;
        const season = game.data.season;

        if (sim && sim !== STATIC_ID) {
            if (!shortCircuitSeasons[sim]) shortCircuitSeasons[sim] = {};

            if (!shortCircuitSeasons[sim][season]) {
                shortCircuitSeasons[sim][season] = game;
                shortCircuitFlat.push(game);
            }
        } else {
            if (!seasons[season]) seasons[season] = game;
        }
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

    const shortCircuit = shortCircuitFlat
        .filter((s) => shouldSimBeShown(s.data.sim!, feedSeasonList?.data ?? null))
        .sort((a, b) => {
            if (!a.data.sim || !b.data.sim || a.data.sim == b.data.sim) {
                // lol
                if (a.data.season < 0) a.data.season += 100;
                if (b.data.season < 0) b.data.season += 100;

                return b.data.season - a.data.season;
            } else {
                return b.data.sim!.localeCompare(a.data.sim!, undefined, { numeric: true });
            }
        });

    const expansionEra = seasonsList.filter((x) => x.data.season >= 11);
    const disciplineEra = seasonsList.filter((x) => x.data.season >= 0 && x.data.season < 11);
    const exhibitions = seasonsList.filter((x) => x.data.season < 0);

    return (
        <Container className={"mt-4"}>
            <h2 className="text-2xl font-semibold mb-2">
                Short Circuit
                <Twemoji emoji={"\u{26A1}"} />
            </h2>
            <SeasonGroup games={shortCircuit} feedSeasonList={feedSeasonList?.data} />

            <h2 className="text-2xl font-semibold mb-2">Expansion Era</h2>
            <SeasonGroup games={expansionEra} />

            <h2 className="text-2xl font-semibold mb-2">Discipline Era</h2>
            <SeasonGroup games={disciplineEra} />

            <h2 className="text-2xl font-semibold mb-2">Exhibitions</h2>
            <SeasonGroup games={exhibitions} />
        </Container>
    );
}
