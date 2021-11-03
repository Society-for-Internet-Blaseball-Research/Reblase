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
    const teamsById = Object.fromEntries(props.teams.map((t) => [t.entityId, t.data]));

    const { stadiums } = useStadiums();

    const items = [...stadiums]
        .sort((a, b) => a.data.nickname.localeCompare(b.data.nickname))
        .map((stadium) => {
            const team = teamsById[stadium.data.teamId];
            return {
                value: stadium.entityId!,
                name: stadium.data.nickname,
                label: (
                    <span key={stadium.entityId}>
                        <Twemoji className="mr-1" emoji={team.emoji} />
                        {stadium.data.nickname}
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
            values={items.filter((item) => (props.selectedStadiums?.includes(item.value) ?? []))}
            getOptionValue={(stadium) => stadium.name}
            onChange={(newItems) => {
                const ids = ((newItems ?? []) as any[]).map((item) => item.value as string);
                if (props.setSelectedStadiums) {
                    props.setSelectedStadiums(ids);
                };
            }}
        />
    );
}
