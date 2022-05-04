import { ChronGameUpdate, ChronTemporalUpdate, ChronSunSunPressure } from "blaseball-lib/chronicler";
import { BlaseballGame, BlaseballTemporal, BlaseballSunSunPressure } from "blaseball-lib/models";
import { useGameUpdates, useTemporalForGame, useSunSunPressureForGame } from "blaseball/hooks";
import { Loading } from "components/elements/Loading";
import Twemoji from "components/elements/Twemoji";
import { Container } from "components/layout/Container";
import Tooltip from "rc-tooltip";
import React from "react";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import Error from "../components/elements/Error";
import { GameUpdateList, SecondaryUpdate } from "../components/game/GameUpdateList";

const SemiCentennialHeading = (props: { firstEvt: ChronGameUpdate; lastEvtData: BlaseballGame }) => {
    const location = useLocation();

    const displaySeasonNumber = props.lastEvtData.season + 1;

    return (
        <>
            <p className="mb-2">
                <Link to={`/season/${displaySeasonNumber}`}>&larr; Back to Season {displaySeasonNumber}</Link>
            </p>
            <Link to={location.pathname}>
                <h2 className="text-3xl font-semibold">
                    Season {displaySeasonNumber}, <span className="bg-blue-700 text-white px-2">Semi-Centennial</span>
                </h2>
                <h3>
                    <strong>{props.lastEvtData.awayTeamName}</strong>
                    <small> vs. </small>
                    <strong>{props.lastEvtData.homeTeamName}</strong>
                </h3>
            </Link>

            <a
                href={`https://before.sibr.dev/_before/jump?redirect=%2Fleague&season=${props.lastEvtData.season}&time=${props.firstEvt.timestamp}`}
            >
                <Tooltip placement="top" overlay={<span>Remember Before?</span>}>
                    <Twemoji emoji={"\u{1FA78}"} />
                </Tooltip>
            </a>
        </>
    );
};

type SemiCentennialSecondary =
    | { type: "temporal"; data: BlaseballTemporal }
    | { type: "sunSun"; pressure: BlaseballSunSunPressure };

function SemiCentennialUpdateList(props: {
    gameUpdates: ChronGameUpdate[];
    temporalUpdates: ChronTemporalUpdate[];
    sunSunPressureUpdates: ChronSunSunPressure[];
}) {
    const start = props.gameUpdates[0]?.timestamp;
    const end = props.gameUpdates[props.gameUpdates.length - 1]?.timestamp;

    const temporalSecondary = props.temporalUpdates
        .filter((upd) => upd.validFrom >= start && upd.validFrom < end)
        .filter((upd) => upd.data.doc?.zeta !== "")
        .map((upd) => ({
            timestamp: upd.validFrom,
            data: { type: "temporal", data: upd.data } as SemiCentennialSecondary,
        }));

    const pressureSecondary = props.sunSunPressureUpdates
        .filter((upd) => upd.validFrom >= start && upd.validFrom < end)
        .sort((a, b) => a.validFrom.localeCompare(b.validTo))
        .filter((upd, i) => upd.hash !== props.sunSunPressureUpdates[i - 1]?.hash)
        .map((upd) => ({
            timestamp: upd.validFrom,
            data: {
                type: "sunSun",
                pressure: upd.data,
            } as SemiCentennialSecondary,
        }));

    const renderSecondary = (upd: SecondaryUpdate<SemiCentennialSecondary>) => {
        if (upd.data.type === "temporal") {
            return (
                <div
                    key={upd.timestamp + "_temporal"}
                    className="p-2 border-b border-gray-300 dark:border-gray-700 TemporalRow"
                >
                    <span className="TemporalRow-Icon">
                        <Twemoji emoji={upd.data.data.doc?.gamma === 5 ? "\u{1F4DC}" : "\u{1FA99}"} />
                    </span>
                    <span className="ml-2 font-semibold TemporalRow-Delta">{upd.data.data.doc?.zeta.trim()}</span>
                </div>
            );
        } else if (upd.data.type === "sunSun") {
            return (
                <div
                    key={upd.timestamp + "_pressure"}
                    className="p-2 border-b border-gray-300 dark:border-gray-700 flex flex-row"
                >
                    <div>
                        <span className="font-semibold">
                            <Twemoji emoji={"\u{1F6A8}"} className="mr-2" />
                        </span>
                        Sun(Sun)'s Pressure built...
                    </div>
                    <div className="text-right flex-1">
                        <span className="text-gray-800 dark:text-gray-200 mr-1">
                            <Twemoji emoji={"\u{1F31E}"} />
                            {Math.round((upd.data.pressure.current / upd.data.pressure.maximum) * 100).toLocaleString()}
                            %
                        </span>
                    </div>
                    <div
                        style={{
                            background: "linear-gradient(90deg, rgba(251,205,98,1) 0%, rgba(212,76,20,1) 100%",
                            width: "100px",
                        }}
                    >
                        <div
                            className="progress-bar"
                            aria-valuenow={(upd.data.pressure.current / upd.data.pressure.maximum) * 100}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            style={{
                                width: "".concat(
                                    Math.round(
                                        (upd.data.pressure.current / upd.data.pressure.maximum) * 100
                                    ).toLocaleString(),
                                    "%"
                                ),
                                background: "linear-gradient(90deg, #10457f 0%, #2379a6 100%",
                            }}
                        />
                    </div>
                </div>
            );
        }
    };

    const secondary = [...temporalSecondary, ...pressureSecondary].sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp)
    );

    return (
        <GameUpdateList
            updates={props.gameUpdates}
            updateOrder={"asc"}
            filterImportant={false}
            secondaryUpdates={secondary}
            renderSecondary={renderSecondary}
        />
    );
}

type GamePageParams = { gameId: string };

export default function SemiCentennialPage() {
    const { gameId } = useParams<GamePageParams>();

    const query = {
        game: gameId!,
        started: true,
    };

    const { updates: gameUpdates, error: updatesError, isLoading } = useGameUpdates(query, false);
    const { updates: temporalUpdates, error: temporalError, isLoading: temporalIsLoading } = useTemporalForGame(gameId);
    const {
        data: sunSunPressureUpdates,
        error: sunSunPressureError,
        isLoading: sunSunPressureIsLoading,
    } = useSunSunPressureForGame(gameId);

    if (updatesError || temporalError || sunSunPressureError)
        return <Error>{(updatesError || temporalError || sunSunPressureError).toString()}</Error>;
    if (isLoading || temporalIsLoading || sunSunPressureIsLoading) return <Loading />;

    const first = gameUpdates[0];
    const last = gameUpdates[gameUpdates.length - 1]?.data;

    return (
        <Container>
            {last && <SemiCentennialHeading firstEvt={first} lastEvtData={last} />}

            <SemiCentennialUpdateList
                gameUpdates={gameUpdates}
                temporalUpdates={temporalUpdates}
                sunSunPressureUpdates={sunSunPressureUpdates}
            />
        </Container>
    );
}
