import React from "react";
import Twemoji from "./Twemoji";
import Select from "react-select";
import { weatherTypes } from "../blaseball/weather";

export interface WeatherPickerProps {
    placeholder?: string;
    selectedWeather?: number[];
    setSelectedWeather?: (weather: number[]) => void;
}

export default function WeatherPicker(props: WeatherPickerProps) {
    const items = Object.keys(weatherTypes).map((weatherId) => {
        const weather = weatherTypes[parseInt(weatherId)]!;
        return {
            value: weatherId,
            label: (
                <span key={weatherId}>
                    <Twemoji className="mr-1" emoji={weather.emoji} />
                    {weather.name}
                </span>
            ),
        };
    });

    return (
        <Select
            options={items}
            isMulti={true}
            placeholder={props.placeholder}
            value={items.filter((item) => (props.selectedWeather ?? []).indexOf(parseInt(item.value)) !== -1)}
            onChange={(newItems, _) => {
                const ids = ((newItems ?? []) as any[]).map((item) => parseInt(item.value));
                if (props.setSelectedWeather) props.setSelectedWeather(ids);
            }}
        />
    );
}
