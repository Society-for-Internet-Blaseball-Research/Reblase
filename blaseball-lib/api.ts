import { PlayerID } from "./common";
import { BlaseballSimData } from "./models";

export const BLASEBALL_BASE_URL = "https://api.sibr.dev/proxy";

export const blaseballApi = {
    simData: () => BLASEBALL_BASE_URL + "/database/simulationData",
    allTeams: () => BLASEBALL_BASE_URL + "/database/allTeams",
    players: (ids: PlayerID[]) => BLASEBALL_BASE_URL + "/database/players?ids=" + ids.join(","),
};
