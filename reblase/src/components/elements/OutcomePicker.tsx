import React from "react";
import { outcomeTypes } from "../../blaseball/outcome";
import { selectTheme } from "../../blaseball/select";
import Twemoji from "./Twemoji";
import Select from "react-select";

interface TemporalType {
    name: string;
    color: string;
    emoji: string;
    aliases?: string[];
}

export interface OutcomePickerProps {
    placeholder?: string;
    selectedOutcomes?: string[];
    temporalTypes?: TemporalType[];
    setSelectedOutcomes?: (outcomes: string[]) => void;
}

export default function OutcomePicker(props: OutcomePickerProps) {
    const eventOptions = outcomeTypes
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((eventOutcome) => ({
            value: eventOutcome.name,
            label: (
                <span key={eventOutcome.name}>
                    <Twemoji className="mr-1" emoji={eventOutcome.emoji} />
                    {eventOutcome.name}
                </span>
            ),
        }));

    const temporalOptions = (props.temporalTypes ?? [])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((temporalOutcome) => ({
            value: temporalOutcome.name,
            aliases: temporalOutcome ?? [],
            label: (
                <span key={temporalOutcome.name}>
                    <Twemoji className="mr-1" emoji={temporalOutcome.emoji} />
                    {temporalOutcome.name}
                </span>
            ),
        }));

    const groups = [
        {
            label: "Events",
            options: eventOptions,
        },
        {
            label: "Entities",
            options: temporalOptions,
        },
    ];

    const items = [...eventOptions, ...temporalOptions];

    return (
        <Select
            options={props.temporalTypes ? groups : eventOptions}
            theme={selectTheme}
            isMulti={true}
            placeholder={props.placeholder}
            value={items.filter((item) => (props.selectedOutcomes ?? []).indexOf(item.value) !== -1)}
            onChange={(newItems, _) => {
                const ids = ((newItems ?? []) as any[]).map((item) => item.value as string);
                if (props.setSelectedOutcomes) props.setSelectedOutcomes(ids);
            }}
            filterOption={(candidate, input) => {
                return candidate.value.toLowerCase().includes(input.toLowerCase()) || candidate.aliases.some((x) => x.includes(input.toLowerCase()));
            }}
        />
    );
}
