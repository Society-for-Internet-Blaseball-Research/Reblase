import React from "react";
import { selectTheme } from "../../blaseball/select";
import Select from "react-select";
import { allWeatherTypes, WeatherType, allExperimentalWeatherTypes, ExperimentalWeatherType } from "blaseball-lib/weather";
import Twemoji from "./Twemoji";
import { WeatherID } from "blaseball-lib/common";

export interface WeatherPickerProps {
    placeholder?: string;
    selectedWeather?: number[];
    setSelectedWeather?: (weather: number[]) => void;
}

export default function WeatherPicker(props: WeatherPickerProps) {
    const items = allWeatherTypes.filter((w) => !w.forbidden);

    return (
        <Select
            options={items}
            theme={selectTheme}
            isMulti={true}
            placeholder={props.placeholder}
            value={items.filter((item) => (props.selectedWeather ?? []).indexOf(item.id) !== -1)}
            getOptionValue={(weather) => weather.name}
            formatOptionLabel={(weather) => {
                return (
                    <>
                        <Twemoji className="mr-1" emoji={weather.emoji ?? "?"} />
                        {weather.name}
                    </>
                );
            }}
            onChange={(newItems, _) => {
                const ids = ((newItems ?? []) as WeatherType[]).map((item) => item.id);
                if (props.setSelectedWeather) props.setSelectedWeather(ids);
            }}
        />
    );
}

export interface WeatherPickerExperimentalProps {
    placeholder?: string;
    selectedWeather?: WeatherID[];
    setSelectedWeather?: (weather: WeatherID[]) => void;
}

export function WeatherPickerExperimental(props: WeatherPickerExperimentalProps) {
    const items = Array(...allExperimentalWeatherTypes.values()).filter((weather) => !weather.forbidden);

    return (
        <Select
            options={items}
            theme={selectTheme}
            isMulti={true}
            placeholder={props.placeholder}
            value={items.filter((item) => (props.selectedWeather ?? []).indexOf(item.id) !== -1)}
            getOptionValue={(weather) => weather.name}
            formatOptionLabel={(weather) => {
                return (
                    <>
                        <Twemoji className="mr-1" emoji={weather.emoji ?? "?"} />
                        {weather.name}
                    </>
                );
            }}
            onChange={(newItems, _) => {
                const ids = ((newItems ?? []) as ExperimentalWeatherType[]).map((item) => item.id);
                if (props.setSelectedWeather) props.setSelectedWeather(ids);
            }}
        />
    );
}
