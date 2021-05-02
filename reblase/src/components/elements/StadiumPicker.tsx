import React from "react";
import { selectTheme } from "../../blaseball/select";
import Select from "react-select";
import { ChronTeam } from "blaseball-lib/chronicler";
import Twemoji from "./Twemoji";
import { useStadiums } from "blaseball/hooks";

export interface StadiumPickerProps {
    teams: ChronTeam[];
    placeholder?: string;
    selectedStadiums?: string[];
    setSelectedStadiums?: (stadiums: string[]) => void;
}

export default function StadiumPicker(props: StadiumPickerProps) {
    const teamsById = Object.fromEntries(props.teams.map((t) => [t.id, t.data]));

    const { stadiums } = useStadiums();

    const items = [...stadiums]
        .sort((a, b) => a.nickname.localeCompare(b.nickname))
        .map((stadium) => {
            const team = teamsById[stadium.teamId];
            return {
                value: stadium.id!,
                name: stadium.nickname,
                label: (
                    <span key={stadium.id}>
                        <Twemoji className="mr-1" emoji={team.emoji} />
                        {stadium.nickname}
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
            value={items.filter((item) => (props.selectedStadiums ?? []).indexOf(item.value) !== -1)}
            getOptionValue={(stadium) => stadium.name}
            onChange={(newItems, _) => {
                const ids = ((newItems ?? []) as any[]).map((item) => item.value as string);
                if (props.setSelectedStadiums) props.setSelectedStadiums(ids);
            }}
        />
    );
}
