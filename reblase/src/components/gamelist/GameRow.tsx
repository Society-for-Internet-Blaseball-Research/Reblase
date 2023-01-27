import dayjs from "dayjs";
import Tooltip from "rc-tooltip";
import React from "react";
import { Link } from "react-router-dom";
import { ChronFight, ChronGame } from "blaseball-lib/chronicler";
import { getOutcomes, getOutcomesExperimental, Outcome } from "../../blaseball/outcome";
import { getWeather, getWeatherExperimental } from "blaseball-lib/weather";
import { BlaseballDisplayExperimental, BlaseballFeedSeasonList, BlaseballGameExperimental, BlaseballTeam, BlaseballWeatherExperimental } from "blaseball-lib/models";
import Twemoji from "../elements/Twemoji";
import { displaySimAndSeasonShorthand } from "blaseball-lib/games";

const Events = React.memo((props: { outcomes: string[]; shame: boolean; awayTeam: string }) => {
    const outcomes = getOutcomes(props.outcomes, props.shame, props.awayTeam);
    if (!outcomes) return <></>;

    const style: Record<string, string> = {
        red: "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200",
        orange: "bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
        blue: "bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
        pink: "bg-pink-200 dark:bg-pin-900 text-pink-800 dark:text-pin-200",
        purple: "bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
        gray: "bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200",
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

const EventsExperimental = React.memo((props: { outcomes: BlaseballDisplayExperimental[]; shame: boolean; awayTeam: string }) => {
    const outcomes = getOutcomesExperimental(props.outcomes, props.shame, props.awayTeam);
    if (!outcomes) return <></>;

    const style: Record<string, string> = {
        red: "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200",
        orange: "bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
        blue: "bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
        pink: "bg-pink-200 dark:bg-pin-900 text-pink-800 dark:text-pin-200",
        purple: "bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
        gray: "bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200",
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

            const seconds = Math.floor(diff / 1000) % 60;
            const minutes = Math.floor(diff / 60000);
            duration = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
        }

        const arrow = props.topOfInning ? "\u25B2" : "\u25BC";

        return (
            <span className="text-center text-sm tabular-nums text-gray-700 dark:text-gray-300">
                <span className="w-4 inline-block text-right mr-1">{props.inning + 1}</span>
                <span className="text-xs pr-2 border-r border-gray-500 mr-2">{arrow}</span>
                {duration}
            </span>
        );
    }
);

export const Weather = React.memo((props: { weather: number | null; className?: string }) => {
    const weather = getWeather(props.weather ?? -1) ?? { name: "???", emoji: "\u{2753}" };

    return (
        <Tooltip placement="top" overlay={<span>{weather.name}</span>}>
            <Twemoji emoji={weather.emoji ?? "?"} className={props.className} />
        </Tooltip>
    );
});

export const WeatherExperimental = React.memo((props: { weather: BlaseballWeatherExperimental | null; className?: string }) => {
    const weather = props.weather && getWeatherExperimental(props.weather) || { name: "???", emoji: "\u{2753}" };

    return (
        <Tooltip placement="top" overlay={<span>{weather.name}</span>}>
            <Twemoji emoji={weather.emoji ?? "?"} className={props.className} />
        </Tooltip>
    );
});

interface TeamData {
    name: string;
    emoji: string;
    score: number;
    pitcher: string | null;
    predictedPitcher: string | null;
    win: boolean;
}

const TeamScoreLine = React.memo((props: { team: TeamData }) => {
    return (
        <div className="space-x-2">
            <span className="inline-block w-6 font-lg font-semibold text-right tabular-nums">{props.team.score}</span>
            <span className={props.team.win ? "font-semibold" : "font-normal"}>
                <Twemoji emoji={props.team.emoji} className="mr-1" /> {props.team.name}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300 italic">
                {props.team.pitcher ? props.team.pitcher : `${props.team.predictedPitcher} (est.)`}
            </span>
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
            <div className="w-16 text-sm text-center font-semibold bg-gray-200 dark:bg-gray-800 rounded-sm tabular-nums tracking-tight">
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
    (props: {
        gameComplete: boolean;
        homePitcher: string | null;
        awayPitcher: string | null;
        predictedHomePitcher: string | null;
        predictedAwayPitcher: string | null;
        className?: string;
    }) => {
        const usePredictedPitchers = !props.awayPitcher || !props.homePitcher;
        if (props.gameComplete && usePredictedPitchers) {
            return (
                <div className={`text-sm text-gray-700 dark:text-gray-300 italic ${props.className}`}>
                    {"Game Cancelled"}
                </div>
            );
        } else {
            return (
                <div className={`text-sm text-gray-700 dark:text-gray-300 italic ${props.className}`}>
                    {props.awayPitcher ? props.awayPitcher : props.predictedAwayPitcher}
                    {" / "}
                    {props.homePitcher ? props.homePitcher : props.predictedHomePitcher}
                    {usePredictedPitchers && " (est.)"}
                </div>
            );
        }
    }
);

const SeasonDay = React.memo(
    (props: {
        season: number;
        day: number | string;
        className?: string;
        sim?: string;
        feedSeasonList?: BlaseballFeedSeasonList;
    }) => {
        // todo: clean up eugh
        let seasonText = displaySimAndSeasonShorthand(props.sim, props.season, props.feedSeasonList);

        return (
            <div className={`text-sm font-semibold ${props.className}`}>
                {seasonText}/{typeof props.day === "number" ? props.day + 1 : props.day}
            </div>
        );
    }
);

const SeasonDayExperimental = React.memo(
    (props: {
        season: number;
        day: number | string;
        className?: string;
    }) => {
        return (
            <div className={`text-sm font-semibold ${props.className}`}>
                S{props.season + 1}/{typeof props.day === "number" ? props.day + 1 : props.day}
            </div>
        );
    }
);

export const GameRow = React.memo(
    (props: {
        game: ChronGame;
        teams: Record<string, BlaseballTeam>;
        showWeather: boolean;
        feedSeasonList: BlaseballFeedSeasonList | undefined;
        predictedHomePitcher: string | null;
        predictedAwayPitcher: string | null;
    }) => {
        const { data } = props.game;

        const homeTeam: BlaseballTeam = props.teams[data.homeTeam];
        const awayTeam: BlaseballTeam = props.teams[data.awayTeam];

        const home = {
            name: homeTeam?.state?.scattered ? homeTeam.state.scattered.nickname : data.homeTeamNickname,
            emoji: data.homeTeamEmoji,
            score: data.homeScore,
            pitcher: data.homePitcherName,
            predictedPitcher: props.predictedHomePitcher,
            win: data.homeScore >= data.awayScore,
        };

        const away = {
            name: awayTeam?.state?.scattered ? awayTeam.state.scattered.nickname : data.awayTeamNickname,
            emoji: data.awayTeamEmoji,
            score: data.awayScore,
            pitcher: data.awayPitcherName,
            predictedPitcher: props.predictedAwayPitcher,
            win: data.awayScore >= data.homeScore,
        };

        const weather = props.showWeather ? data.weather : null;

        return (
            <Link
                to={`/game/${props.game.gameId}`}
                className="flex flex-row px-2 py-2 border-b border-gray-300 dark:border-gray-700 space-x-2 items-baseline hover:bg-gray-200 focus:bg-gray-200 dark-hover:bg-gray-800"
            >
                <div className="contents md:hidden">
                    <TwoLineTeamScore home={home} away={away} />

                    <div className="flex flex-col justify-center items-end">
                        <div className="flex flex-row space-x-2">
                            <Weather weather={weather} className="text-sm" />
                            <SeasonDay
                                sim={data.sim}
                                season={data.season}
                                day={data.day}
                                feedSeasonList={props.feedSeasonList}
                                className="text-right"
                            />
                        </div>

                        <div className="flex flex-row justify-end items-baseline space-x-2">
                            <Events
                                outcomes={data.outcomes ?? []}
                                shame={data.shame}
                                awayTeam={data.awayTeamNickname}
                            />
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
                    <SeasonDay
                        sim={data.sim}
                        season={data.season}
                        day={data.day}
                        feedSeasonList={props.feedSeasonList}
                        className="text-center w-10"
                    />
                    <OneLineTeamScore home={home} away={away} />
                    <StandalonePitchers
                        gameComplete={data.gameComplete}
                        awayPitcher={data.awayPitcherName}
                        homePitcher={data.homePitcherName}
                        predictedAwayPitcher={props.predictedAwayPitcher}
                        predictedHomePitcher={props.predictedHomePitcher}
                        className="flex flex-1"
                    />

                    <div className="flex flex-row justify-end items-baseline space-x-2">
                        <Events outcomes={data.outcomes ?? []} shame={data.shame} awayTeam={data.awayTeamNickname} />
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
            </Link>
        );
    },
    (prev, next) => prev.game.gameId === next.game.gameId && prev.showWeather === next.showWeather
);

export const GameRowExperimental = React.memo(
    (props: {
        season: number;
        game: BlaseballGameExperimental;
        teams: Record<string, BlaseballTeam>;
        showWeather: boolean;
    }) => {
        const data = props.game;

        const homeTeam: BlaseballTeam = props.teams[data.homeTeam.id];
        const awayTeam: BlaseballTeam = props.teams[data.awayTeam.id];

        const gameState = (data.gameStates.length > 0 && data.gameStates[0]) || null;

        const home = {
            name: homeTeam?.state?.scattered ? homeTeam.state.scattered.nickname : data.homeTeam.nickname,
            emoji: data.homeTeam.emoji,
            score: gameState?.homeScore ?? 0,
            pitcher: data.homePitcher.name,
            predictedPitcher: null,
            win: data.gameWinnerId == data.homeTeam.id,
        };

        const away = {
            name: awayTeam?.state?.scattered ? awayTeam.state.scattered.nickname : data.awayTeam.nickname,
            emoji: data.awayTeam.emoji,
            score: gameState?.awayScore ?? 0,
            pitcher: data.awayPitcher.name,
            predictedPitcher: null,
            win: data.gameWinnerId == data.awayTeam.id,
        };

        const weather = props.showWeather ? data.weather : null;

        return (
            <Link
                to={`/experimental/game/${data.id}`}
                className="flex flex-row px-2 py-2 border-b border-gray-300 dark:border-gray-700 space-x-2 items-baseline hover:bg-gray-200 focus:bg-gray-200 dark-hover:bg-gray-800"
            >
                <div className="contents md:hidden">
                    <TwoLineTeamScore home={home} away={away} />

                    <div className="flex flex-col justify-center items-end">
                        <div className="flex flex-row space-x-2">
                            <WeatherExperimental weather={weather} className="text-sm" />
                            <SeasonDayExperimental
                                season={props.season - 1}
                                day={data.day}
                                className="text-right"
                            />
                        </div>

                        <div className="flex flex-row justify-end items-baseline space-x-2">
                            <EventsExperimental
                                outcomes={[]}
                                shame={gameState?.shame ?? false}
                                awayTeam={away.name} />
                            <Duration
                                gameId={props.game.id}
                                startTime={(props.game.started || props.game.complete) ? props.game.startTime : null}
                                endTime={props.game.updated}
                                inning={gameState?.inning ?? 0}
                                topOfInning={gameState?.topOfInning ?? false}
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden md:contents">
                    <SeasonDayExperimental
                        season={props.season - 1}
                        day={data.day}
                        className="text-right"
                    />
                    <OneLineTeamScore home={home} away={away} />
                    <StandalonePitchers
                        gameComplete={data.complete}
                        awayPitcher={data.awayPitcher.name}
                        homePitcher={data.homePitcher.name}
                        predictedAwayPitcher={null}
                        predictedHomePitcher={null}
                        className="flex flex-1"
                    />

                    <div className="flex flex-row justify-end items-baseline space-x-2">
                        <EventsExperimental
                            outcomes={[]}
                            shame={gameState?.shame ?? false}
                            awayTeam={away.name} />
                        <Duration
                            gameId={props.game.id}
                            startTime={(props.game.started || props.game.complete) ? props.game.startTime : null}
                            endTime={props.game.updated}
                            inning={gameState?.inning ?? 0}
                            topOfInning={gameState?.topOfInning ?? false}
                        />
                        <WeatherExperimental weather={weather} />
                    </div>
                </div>
            </Link>
        );
    },
    (prev, next) => prev.game.id === next.game.id && prev.showWeather === next.showWeather
);

export const FightRow = React.memo(
    (props: { fight: ChronFight }) => {
        const { data } = props.fight;

        const home = {
            name: data.homeTeamNickname,
            emoji: data.homeTeamEmoji,
            score: data.homeScore,
            pitcher: data.homePitcherName,
            predictedPitcher: null,
            win: data.homeScore >= data.awayScore,
        };

        const away = {
            name: data.awayTeamNickname,
            emoji: data.awayTeamEmoji,
            score: data.awayScore,
            pitcher: data.awayPitcherName,
            predictedPitcher: null,
            win: data.awayScore >= data.homeScore,
        };

        return (
            <Link
                to={`/bossfight/${props.fight.entityId}`}
                className="flex flex-row px-2 py-2 border-b border-gray-300 dark:border-gray-700 space-x-2 items-baseline hover:bg-gray-200 dark-hover:bg-gray-800"
            >
                <div className="contents md:hidden">
                    <TwoLineTeamScore home={home} away={away} />

                    <div className="flex flex-col justify-center items-end">
                        <div className="flex flex-row space-x-2">
                            <SeasonDay season={data.season} day={"X"} className="text-right" />
                        </div>

                        <div className="flex flex-row justify-end items-baseline space-x-2">
                            <Events
                                outcomes={data.outcomes ?? []}
                                shame={data.shame}
                                awayTeam={data.awayTeamNickname}
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden md:contents">
                    <SeasonDay season={data.season} day={"X"} className="text-center w-8" />
                    <OneLineTeamScore home={home} away={away} />
                    <StandalonePitchers
                        gameComplete={data.gameComplete}
                        awayPitcher={data.awayPitcherName}
                        homePitcher={data.homePitcherName}
                        predictedAwayPitcher={null}
                        predictedHomePitcher={null}
                        className="flex flex-1"
                    />

                    <div className="flex flex-row justify-end items-baseline space-x-2">
                        <Events outcomes={data.outcomes ?? []} shame={data.shame} awayTeam={data.awayTeamNickname} />
                    </div>
                </div>
            </Link>
        );
    },
    (prev, next) => prev.fight.entityId === next.fight.entityId
);

export const SemiCentennialRow = React.memo(
    (props: { game: ChronGame }) => {
        const { data } = props.game;

        const home = {
            name: data.homeTeamNickname,
            emoji: data.homeTeamEmoji,
            score: data.homeScore,
            pitcher: data.homePitcherName,
            predictedPitcher: null,
            win: data.homeScore >= data.awayScore,
        };

        const away = {
            name: data.awayTeamNickname,
            emoji: data.awayTeamEmoji,
            score: data.awayScore,
            pitcher: data.awayPitcherName,
            predictedPitcher: null,
            win: data.awayScore >= data.homeScore,
        };

        return (
            <Link
                to={`/semicentennial/${props.game.gameId}`}
                className="flex flex-row px-2 py-2 border-b border-gray-300 dark:border-gray-700 space-x-2 items-baseline hover:bg-gray-200 dark-hover:bg-gray-800"
            >
                <div className="contents md:hidden">
                    <TwoLineTeamScore home={home} away={away} />

                    <div className="flex flex-col justify-center items-end">
                        <div className="flex flex-row space-x-2">
                            <SeasonDay season={data.season} day={"X"} className="text-right" />
                        </div>

                        <div className="flex flex-row justify-end items-baseline space-x-2">
                            <Events
                                outcomes={data.outcomes ?? []}
                                shame={data.shame}
                                awayTeam={data.awayTeamNickname}
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden md:contents">
                    <SeasonDay season={data.season} day={"X"} className="text-center w-8" />
                    <OneLineTeamScore home={home} away={away} />
                    <StandalonePitchers
                        gameComplete={data.gameComplete}
                        awayPitcher={data.awayPitcherName}
                        homePitcher={data.homePitcherName}
                        predictedAwayPitcher={null}
                        predictedHomePitcher={null}
                        className="flex flex-1"
                    />

                    <div className="flex flex-row justify-end items-baseline space-x-2">
                        <Events outcomes={data.outcomes ?? []} shame={data.shame} awayTeam={data.awayTeamNickname} />
                    </div>
                </div>
            </Link>
        );
    },
    (prev, next) => prev.game.gameId === next.game.gameId
);
