import React from "react";
import { selectTheme } from "../../blaseball/select";
import Select from "react-select";
import { ChronTeam } from "blaseball-lib/chronicler";
import Twemoji from "./Twemoji";

export interface TeamPickerProps {
    teams: ChronTeam[];
    placeholder?: string;
    selectedTeams?: string[];
    setSelectedTeams?: (teams: string[]) => void;
}

export default function TeamPicker(props: TeamPickerProps) {
    const items = [...props.teams]
        .sort((a, b) => a.data.fullName.localeCompare(b.data.fullName))
        .map((team) => ({
            value: team.id,
            name: team.data.fullName,
            label: (
                <span key={team.id}>
                    <Twemoji className="mr-1" emoji={team.data.emoji} />
                    {team.data.fullName}
                </span>
            ),
        }));

    return (
        <Select
            options={items}
            theme={selectTheme}
            isMulti={true}
            placeholder={props.placeholder}
            value={items.filter((item) => (props.selectedTeams ?? []).indexOf(item.value) !== -1)}
            getOptionValue={(team) => team.name}
            onChange={(newItems, _) => {
                const ids = ((newItems ?? []) as any[]).map((item) => item.value as string);
                if (props.setSelectedTeams) props.setSelectedTeams(ids);
            }}
        />
    );
}
