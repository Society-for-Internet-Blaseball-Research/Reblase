import React from "react";
import { outcomeTypes } from "../blaseball/outcome";
import Twemoji from "./Twemoji";
import Select from "react-select";

export interface OutcomePickerProps {
    placeholder?: string;
    selectedOutcomes?: string[];
    setSelectedOutcomes?: (outcomes: string[]) => void;
}

export default function OutcomePicker(props: OutcomePickerProps) {
    const items = outcomeTypes
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
