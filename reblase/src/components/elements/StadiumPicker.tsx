import React from "react";
import { selectTheme } from "../../blaseball/select";
import Select from "react-select";
import { ChronGame } from "blaseball-lib/chronicler";
import Twemoji from "./Twemoji";
import { useStadiums } from "blaseball/hooks";

export interface StadiumPickerProps {
    games: ChronGame[];
    placeholder?: string;
    selectedStadiums?: string[];
    setSelectedStadiums?: (stadiums: string[]) => void;
}

export default function StadiumPicker(props: StadiumPickerProps) {
    const teamsById = Object.fromEntries(props.games.map((g) => [g.data.homeTeam, g.data.homeTeamEmoji]))

    const { stadiums } = useStadiums();

    const items = [...stadiums]
        .sort((a, b) => a.data.nickname.localeCompare(b.data.nickname))
        .filter((stadium) => teamsById[stadium.data.teamId])
        .map((stadium) => {
            const teamEmoji = teamsById[stadium.data.teamId];
            return {
                value: stadium.entityId!,
                name: stadium.data.nickname,
                label: (
                    <span key={stadium.entityId}>
                        <Twemoji className="mr-1" emoji={teamEmoji} />
                        {stadium.data.nickname}
                    </span>
                ),
            };
        });

    const anyStadiums = items.length > 0;

    return (
        <Select
            options={items}
            theme={selectTheme}
            isMulti={true}
            isDisabled={!anyStadiums}
            placeholder={anyStadiums ? props.placeholder : "No Stadiums"}
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
