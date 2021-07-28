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
    let events = [];
    events.push(...outcomeTypes);
    events.push(...(props.temporalTypes ?? []));

    let items = events
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((outcome) => ({
                value: outcome.name,
                label: (
                    <span key={outcome.name}>
                        <Twemoji className="mr-1" emoji={outcome.emoji} />
                        {outcome.name}
                    </span>
                ),
            }));
    
    return (
        <Select
            options={items}
            theme={selectTheme}
            isMulti={true}
            placeholder={props.placeholder}
            value={items.filter((item) => (props.selectedOutcomes ?? []).indexOf(item.value) !== -1)}
            onChange={(newItems, _) => {
                const ids = ((newItems ?? []) as any[]).map((item) => item.value as string);
                if (props.setSelectedOutcomes) props.setSelectedOutcomes(ids);
            }}
        />
    );
}
