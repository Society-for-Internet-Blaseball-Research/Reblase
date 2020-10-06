import dayjs from "dayjs";
import Tooltip from "rc-tooltip";
import React from "react";
import { Link } from "react-router-dom";
import { ChronGame } from "../../blaseball/chronicler";
import { getOutcomesFromData, Outcome } from "../../blaseball/outcome";
import { getWeatherById } from "../../blaseball/weather";
import Twemoji from "../elements/Twemoji";

const Events = React.memo((props: { outcomes: string[] }) => {
    const outcomes = getOutcomesFromData(props.outcomes);
    if (!outcomes) return <></>;

    const style: Record<string, string> = {
        red: "bg-red-200 text-red-800",
        orange: "bg-orange-200 text-orange-800",
        blue: "bg-blue-200 text-blue-800",
        pink: "bg-pink-200 text-pink-800",
        purple: "bg-purple-200 text-purple-800",
        gray: "bg-gray-200 text-gray-800",
    };

    const outcomesByType: Record<string, Outcome[]> = {};
    for (const outcome of outcomes) {
        if (!outcomesByType[outcome.name]) outcomesByType[outcome.name] = [];
        outcomesByType[outcome.name].push(outcome);
    }

    return (
        <span>
            {Object.keys(outcomesByType).map((outcomeType, idx) => {
                const outcomes = outcomesByType[outcomeType];
                const combined = outcomes.map((o) => o.text).join("\n");

                return (
                    <Tooltip
                        key={idx}
                        placement="top"
                        overlay={<div className="whitespace-pre-line text-center">{combined}</div>}
                    >
                        <span className={`ml-1 tag-sm ${style[outcomes[0].color]}`}>
                            {outcomeType}
                            {outcomes.length > 1 ? <span className="ml-1"> x{outcomes.length}</span> : ""}
                        </span>
                    </Tooltip>
                );
            })}
        </span>
    );
});

const Duration = React.memo(
    (props: {
        gameId: string;
        startTime: string | null;
        endTime: string | null;
        inning: number;
        topOfInning: boolean;
    }) => {
        if (!props.startTime) return null;

        let duration = "LIVE";
        if (props.startTime && props.endTime) {
            const startMoment = dayjs(props.startTime);
            const endMoment = dayjs(props.endTime);
            const diff = endMoment.diff(startMoment);

            duration = dayjs().hour(0).minute(0).second(0).millisecond(diff).format("mm:ss");
        }

        const arrow = props.topOfInning ? "\u25B2" : "\u25BC";

        return (
            <Link className="text-center text-sm tabular-nums text-gray-700" to={`/game/${props.gameId}`}>
                <span className="w-4 inline-block text-right mr-1">{props.inning + 1}</span>
                <span className="text-xs pr-2 border-r border-gray-500 mr-2">{arrow}</span>
                {duration}
            </Link>
        );
    }
);

const Weather = React.memo((props: { weather: number | null; className?: string }) => {
    const weather = getWeatherById(props.weather ?? -1);
    if (!weather) return <Twemoji emoji={"\u{2753}"} className={props.className} />;

    return (
        <Tooltip placement="top" overlay={<span>{weather.name}</span>}>
            <Twemoji emoji={weather.emoji} className={props.className} />
        </Tooltip>
    );
});

interface TeamData {
    name: string;
    emoji: string;
    score: number;
    pitcher: string | null;
    win: boolean;
}

const TeamScoreLine = React.memo((props: { team: TeamData }) => {
    return (
        <div className="space-x-2">
            <span className="inline-block w-6 font-lg font-semibold text-right tabular-nums">{props.team.score}</span>
            <span className={props.team.win ? "font-semibold" : "font-normal"}>
                <Twemoji emoji={props.team.emoji} className="mr-1" /> {props.team.name}
            </span>
            <span className="text-sm text-gray-700 italic">{props.team.pitcher}</span>
        </div>
    );
});

const TwoLineTeamScore = React.memo((props: { away: TeamData; home: TeamData; className?: string }) => {
    return (
        <div className={`flex flex-col flex-1 ${props.className}`}>
            <TeamScoreLine team={props.away} />
            <TeamScoreLine team={props.home} />
        </div>
    );
});

const OneLineTeamScore = React.memo((props: { away: TeamData; home: TeamData; className?: string }) => {
    return (
        <div className={`flex flex-row space-x-2 items-baseline ${props.className}`}>
            <div className={`w-40 text-right text-sm ${props.away.win ? "font-semibold" : "font-normal"}`}>
                {props.away.name}
                <Twemoji emoji={props.away.emoji} className="text-base ml-2" />
            </div>
            <div className="w-16 text-sm text-center font-semibold bg-gray-200 rounded-sm tabular-nums tracking-tight">
                {props.away.score}&ensp;-&ensp;{props.home.score}
            </div>
            <div className={`w-40 text-sm ${props.home.win ? "font-semibold" : "font-normal"}`}>
                <Twemoji emoji={props.home.emoji} className="text-base mr-2" />
                {props.home.name}
            </div>
        </div>
    );
});

const StandalonePitchers = React.memo(
    (props: { homePitcher: string | null; awayPitcher: string | null; className?: string }) => {
        return (
            <div className={`text-sm text-gray-700 italic ${props.className}`}>
                {props.awayPitcher ? props.awayPitcher : "TBD"}
                {" / "}
                {props.homePitcher ? props.homePitcher : "TBD"}
            </div>
        );
    }
);

const SeasonDay = React.memo((props: { season: number; day: number; className?: string }) => {
    return (
        <div className={`text-sm font-semibold ${props.className}`}>
            S{props.season + 1}/{props.day + 1}
        </div>
    );
});

export default React.memo(
    (props: { game: ChronGame; showWeather: boolean }) => {
        const { data } = props.game;

        const home = {
            name: data.homeTeamNickname,
            emoji: data.homeTeamEmoji,
            score: data.homeScore,
            pitcher: data.homePitcherName,
            win: data.homeScore >= data.awayScore,
        };

        const away = {
            name: data.awayTeamNickname,
            emoji: data.awayTeamEmoji,
            score: data.awayScore,
            pitcher: data.awayPitcherName,
            win: data.awayScore >= data.homeScore,
        };

        const weather = props.showWeather ? data.weather : null;

        return (
            <div className="flex flex-row pb-2 border-b mb-2 border-gray-300 space-x-2 items-baseline">
                <div className="contents md:hidden">
                    <TwoLineTeamScore home={home} away={away} />

                    <div className="flex flex-col justify-center items-end">
                        <div className="flex flex-row space-x-2">
                            <Weather weather={weather} className="text-sm" />
                            <SeasonDay season={data.season} day={data.day} className="text-right" />
                        </div>

                        <div className="flex flex-row justify-end items-baseline space-x-2">
                            <Events outcomes={data.outcomes} />
                            <Duration
                                gameId={props.game.gameId}
                                startTime={props.game.startTime}
                                endTime={props.game.endTime}
                                inning={data.inning}
                                topOfInning={data.topOfInning}
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden md:contents">
                    <SeasonDay season={data.season} day={data.day} className="text-center w-8" />
                    <OneLineTeamScore home={home} away={away} />
                    <StandalonePitchers
                        awayPitcher={data.awayPitcherName}
                        homePitcher={data.homePitcherName}
                        className="flex flex-1"
                    />

                    <div className="flex flex-row justify-end items-baseline space-x-2">
                        <Events outcomes={data.outcomes} />
                        <Duration
                            gameId={props.game.gameId}
                            startTime={props.game.startTime}
                            endTime={props.game.endTime}
                            inning={data.inning}
                            topOfInning={data.topOfInning}
                        />
                        <Weather weather={weather} />
                    </div>
                </div>
            </div>
        );
    },
    (prev, next) => prev.game.gameId === next.game.gameId && prev.showWeather === next.showWeather
);
