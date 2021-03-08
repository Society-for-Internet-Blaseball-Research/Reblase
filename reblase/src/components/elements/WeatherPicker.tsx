import React from "react";
import { selectTheme } from "../../blaseball/select";
import Twemoji from "./Twemoji";
import Select from "react-select";
import { allWeatherTypes } from "blaseball-lib/weather";

export interface WeatherPickerProps {
    placeholder?: string;
    selectedWeather?: number[];
    setSelectedWeather?: (weather: number[]) => void;
}

export default function WeatherPicker(props: WeatherPickerProps) {
    const items = allWeatherTypes
        .filter((w) => !w.forbidden)
        .map((weather) => {
            return {
                value: weather.id,
                name: weather.name,
                label: (
                    <span key={weather.name}>
                        <Twemoji className="mr-1" emoji={weather.emoji ?? "?"} />
                        {weather.name}
                    </span>
                ),
            };
        });

    return (
        <Select
            options={items}
            theme={selectTheme}
            isMulti={true}
            placeholder={props.placeholder}
            value={items.filter((item) => (props.selectedWeather ?? []).indexOf(item.value) !== -1)}
            getOptionValue={(weather) => weather.name}
            onChange={(newItems, _) => {
                const ids = ((newItems ?? []) as any[]).map((item) => parseInt(item.value));
                if (props.setSelectedWeather) props.setSelectedWeather(ids);
            }}
        />
    );
}
