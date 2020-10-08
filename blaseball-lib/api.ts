import { BlaseballSimData } from "./models";

export const BLASEBALL_BASE_URL = "https://api.sibr.dev/proxy";

export const blaseballApi = {
    simData: () => BLASEBALL_BASE_URL + "/database/simulationData",
};
