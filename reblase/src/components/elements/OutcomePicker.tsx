import React from "react";
import { outcomeTypes, BaseOutcome } from "../../blaseball/outcome";
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

interface DisplayableOutcome {
    value: string;
    label: JSX.Element;
}

interface Group {
    label: string;
    options: DisplayableOutcome[];
}

export default function OutcomePicker(props: OutcomePickerProps) {
    const createSelectable = (outcomes: BaseOutcome[]) => outcomes
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((eventOutcome) => ({
            value: eventOutcome.name,
            label: (
                <span key={eventOutcome.name}>
                    <Twemoji className="mr-1" emoji={eventOutcome.emoji} />
                    {eventOutcome.name}
                </span>
            ),
        }))
    
    const eventOptions: DisplayableOutcome[] = createSelectable(outcomeTypes);
    const temporalOptions: DisplayableOutcome[] = createSelectable(props.temporalTypes ?? []);
    
    const groups: Group[] = [
        {
            label: 'Events', 
            options: eventOptions,
        },
        {
            label: 'Entities',
            options: temporalOptions,
        },
    ];

    const items: DisplayableOutcome[] = [...eventOptions, ...temporalOptions];
    
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
