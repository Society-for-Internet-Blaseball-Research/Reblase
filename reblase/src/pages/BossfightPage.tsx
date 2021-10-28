import { ChronFightUpdate, ChronTemporalUpdate } from "blaseball-lib/chronicler";
import { BlaseballFight, BlaseballTemporal, DamageResult } from "blaseball-lib/models";
import { useFightUpdates, useTemporal } from "blaseball/hooks";
import { Loading } from "components/elements/Loading";
import Twemoji from "components/elements/Twemoji";
import { Container } from "components/layout/Container";
import Tooltip from "rc-tooltip";
import React from "react";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import Error from "../components/elements/Error";
import { GameUpdateList, SecondaryUpdate } from "../components/game/GameUpdateList";

const FightHeading = (props: { firstEvt: ChronFightUpdate; lastEvtData: BlaseballFight }) => {
    const location = useLocation();

    const displaySeasonNumber = props.lastEvtData.season + 1;

    return (
        <>
            <p className="mb-2">
                <Link to={`/season/${displaySeasonNumber}`}>&larr; Back to Season {displaySeasonNumber}</Link>
            </p>
            <Link to={location.pathname}>
                <h2 className="text-3xl font-semibold">
                    Season {displaySeasonNumber}, Day <span className="bg-red-700 text-white px-2">X</span>
                </h2>
                <h3>
                    <strong>{props.lastEvtData.awayTeamName}</strong>
                    <small> vs. </small>
                    <strong>{props.lastEvtData.homeTeamName}</strong>
                </h3>
            </Link>
                
            <a href={`https://before.sibr.dev/_before/jump?redirect=%2Fleague&season=${props.lastEvtData.season}&time=${props.firstEvt.timestamp}`}>
                <Tooltip placement="top" overlay={<span>Remember Before?</span>}>
                    <Twemoji emoji={"\u{1FA78}"} />
                </Tooltip>
            </a>
        </>
    );
};

type BossfightSecondary =
    | { type: "temporal"; data: BlaseballTemporal }
    | { type: "damage"; fight: BlaseballFight; damage: DamageResult };

function BossfightUpdateList(props: { fightUpdates: ChronFightUpdate[]; temporalUpdates: ChronTemporalUpdate[] }) {
    const start = props.fightUpdates[0]?.timestamp;
    const end = props.fightUpdates[props.fightUpdates.length - 1]?.timestamp;

    const temporalSecondary = props.temporalUpdates
        .filter((upd) => upd.firstSeen >= start && upd.firstSeen < end)
        .map((upd) => ({ timestamp: upd.firstSeen, data: { type: "temporal", data: upd.data } as BossfightSecondary }));

    const damageSecondary = props.fightUpdates
        .filter((upd, i) => upd.hash !== props.fightUpdates[i - 1]?.hash)
        .filter((u) => u.data.damageResults !== "[]")
        .map((upd) => ({
            timestamp: upd.timestamp,
            data: {
                type: "damage",
                fight: upd.data,
                damage: JSON.parse(upd.data.damageResults)[0],
            } as BossfightSecondary,
        }));

    const renderSecondary = (upd: SecondaryUpdate<BossfightSecondary>) => {
        if (upd.data.type === "temporal") {
            return (
                <div key={upd.timestamp + "_temporal"} className="p-2 border-b border-gray-300 dark:border-gray-700">
                    <Twemoji emoji={"\u{1F95C}"} />
                    <span className="ml-2 font-semibold">{upd.data.data.doc?.zeta}</span>
                </div>
            );
        } else if (upd.data.type === "damage") {
            const teamName =
                upd.data.damage.teamTarget === upd.data.fight.homeTeam
                    ? upd.data.fight.homeTeamNickname
                    : upd.data.fight.awayTeamNickname;

            const teamEmoji =
                upd.data.damage.teamTarget === upd.data.fight.homeTeam
                    ? upd.data.fight.homeTeamEmoji
                    : upd.data.fight.awayTeamEmoji;

            const teamHp = parseInt(
                upd.data.damage.teamTarget === upd.data.fight.homeTeam ? upd.data.fight.homeHp : upd.data.fight.awayHp
            );

            const teamMaxHp = parseInt(
                upd.data.damage.teamTarget === upd.data.fight.homeTeam
                    ? upd.data.fight.homeMaxHp
                    : upd.data.fight.awayMaxHp
            );
            return (
                <div key={upd.timestamp + "_damage"} className="p-2 border-b border-gray-300 dark:border-gray-700 flex flex-row">
                    <div>
                        <span className="font-semibold">
                            <Twemoji emoji={"\u{1F6A8}"} className="mr-2" />
                            {teamName}
                        </span>{" "}
                        took <span className="font-semibold">{upd.data.damage.dmg.toLocaleString()}</span> damage!{" "}
                    </div>
                    <div className="text-right flex-1">
                        <span className="text-gray-800 dark:text-gray-200 mr-1">
                            <Twemoji emoji={teamEmoji} /> {teamHp.toLocaleString()} (
                            {Math.round((teamHp / teamMaxHp) * 100).toLocaleString()}
                            %)
                        </span>
                    </div>
                </div>
            );
        }
    };

    const secondary = [...temporalSecondary, ...damageSecondary].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    return (
        <GameUpdateList
            updates={props.fightUpdates}
            updateOrder={"asc"}
            filterImportant={false}
            secondaryUpdates={secondary}
            renderSecondary={renderSecondary}
        />
    );
}

type GamePageParams = { fightId: string };

export default function BossfightPage() {
    const { fightId } = useParams<GamePageParams>();

    const query = {
        fight: fightId!,
    };

    const { updates: fightUpdates, error: updatesError, isLoading } = useFightUpdates(query);
    const { updates: temporalUpdates, error: temporalError } = useTemporal();

    if (updatesError || temporalError) return <Error>{(updatesError || temporalError).toString()}</Error>;
    if (isLoading) return <Loading />;

    const first = fightUpdates[0]
    const last = fightUpdates[fightUpdates.length - 1]?.data;

    return (
        <Container>
            {last && <FightHeading firstEvt={first} lastEvtData={last} />}

            <BossfightUpdateList fightUpdates={fightUpdates} temporalUpdates={temporalUpdates} />
        </Container>
    );
}
