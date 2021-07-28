import React from "react";
import { outcomeTypes } from "../../blaseball/outcome";
import { selectTheme } from "../../blaseball/select";
import Twemoji from "./Twemoji";
import Select from "react-select";

interface TemporalType {
    name: string;
    color: string;
    emoji: string;
}

export interface OutcomePickerProps {
    placeholder?: string;
    selectedOutcomes?: string[];
    temporalTypes?: TemporalType[];
    setSelectedOutcomes?: (outcomes: string[]) => void;
}

export default function OutcomePicker(props: OutcomePickerProps) {
    const eventOptions = outcomeTypes.sort((a, b) => a.name.localeCompare(b.name))
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
        .map((eventOutcome) => ({
            value: eventOutcome.name,
            label: (
                <span key={eventOutcome.name}>
                    <Twemoji className="mr-1" emoji={eventOutcome.emoji} />
                    {eventOutcome.name}
                </span>
            ),
        }));
    
    const groups = 
    [
        {
            label: 'Events', 
            options: eventOptions,
        },
        {
            label: 'Entities',
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
                const outcomes = ((newItems ?? []) as any[]).map((item) => item.value as string);
                if (props.setSelectedOutcomes) props.setSelectedOutcomes(outcomes);
            }}
        />
    );
}
