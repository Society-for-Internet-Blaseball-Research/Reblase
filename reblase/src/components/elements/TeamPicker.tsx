import React from "react";
import { selectTheme } from "../../blaseball/select";
import Select from "react-select";
import { ChronGame, ChronTeam } from "blaseball-lib/chronicler";
import Twemoji from "./Twemoji";
import { BlaseballGameExperimental } from "blaseball-lib/models";

export interface TeamPickerProps {
    games: ChronGame[];
    teams: ChronTeam[];
    placeholder?: string;
    selectedTeams?: string[];
    setSelectedTeams?: (teams: string[]) => void;
}

export default function TeamPicker(props: TeamPickerProps) {
    const formatOptionLabel = (option: ChronTeam, meta: { context: string }) => {
    	const fullName = option.data?.state?.scattered ? option.data.state.scattered.fullName : option.data.fullName;
    	const nickname = option.data?.state?.scattered ? option.data.state.scattered.nickname : option.data.nickname;
    	return (
            <span>
                <Twemoji className="mr-1" emoji={option.data.emoji} />
                {meta.context === "menu" ? fullName : nickname}
            </span>
        );
    };

    const teamIds = props.games
        .map((game) => [game.data.awayTeam, game.data.homeTeam])
        .flat()
        .filter((teamId, index, self) => self.indexOf(teamId) === index);

    const options = props.teams
        .filter((team) => teamIds.includes(team.entityId))
        .sort((a, b) => {
        	const aName = a.data?.state?.scattered ? a.data.state.scattered.fullName : a.data.fullName;
        	const bName = b.data?.state?.scattered ? b.data.state.scattered.fullName : b.data.fullName;
        	return aName.localeCompare(bName);
        });

    return (
        <Select
            theme={selectTheme}
            isMulti={true}
            placeholder={props.placeholder}
            options={options}
            value={options.filter((team) => props.selectedTeams?.includes(team.entityId) ?? [])}
            getOptionValue={(team) =>
                team.data.state?.scattered ? team.data.state.scattered.fullName : team.data.fullName
            }
            formatOptionLabel={formatOptionLabel}
            onChange={(value) => {
                if (props.setSelectedTeams) {
                    props.setSelectedTeams((value as ChronTeam[])?.map((team) => team.entityId) ?? []);
                }
            }}
        />
    );
}

export interface TeamPickerExperimentalProps {
    games: BlaseballGameExperimental[];
    teams: ChronTeam[];
    placeholder?: string;
    selectedTeams?: string[];
    setSelectedTeams?: (teams: string[]) => void;
}

export function TeamPickerExperimental(props: TeamPickerExperimentalProps) {
    const formatOptionLabel = (option: ChronTeam, meta: { context: string }) => {
    	const fullName = option.data?.state?.scattered ? option.data.state.scattered.fullName : option.data.fullName;
    	const nickname = option.data?.state?.scattered ? option.data.state.scattered.nickname : option.data.nickname;
    	return (
            <span>
                <Twemoji className="mr-1" emoji={option.data.emoji} />
                {meta.context === "menu" ? fullName : nickname}
            </span>
        );
    };

    const teamIds = props.games
        .map((game) => [game.awayTeam.id, game.homeTeam.id])
        .flat()
        .filter((teamId, index, self) => self.indexOf(teamId) === index);

    const options = props.teams
        .filter((team) => teamIds.includes(team.entityId))
        .sort((a, b) => {
        	const aName = a.data?.state?.scattered ? a.data.state.scattered.fullName : a.data.fullName;
        	const bName = b.data?.state?.scattered ? b.data.state.scattered.fullName : b.data.fullName;
        	return aName.localeCompare(bName);
        });

    return (
        <Select
            theme={selectTheme}
            isMulti={true}
            placeholder={props.placeholder}
            options={options}
            value={options.filter((team) => props.selectedTeams?.includes(team.entityId) ?? [])}
            getOptionValue={(team) =>
                team.data.state?.scattered ? team.data.state.scattered.fullName : team.data.fullName
            }
            formatOptionLabel={formatOptionLabel}
            onChange={(value) => {
                if (props.setSelectedTeams) {
                    props.setSelectedTeams((value as ChronTeam[])?.map((team) => team.entityId) ?? []);
                }
            }}
        />
    );
}
