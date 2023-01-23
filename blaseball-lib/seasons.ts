import { SeasonID } from "./common";

export const returnedSeasons: Map<number, SeasonID> = new Map([
    [0, "cd1b6714-f4de-4dfc-a030-851b3459d8d1"],
    [1, "7af53acf-1fb9-40e8-96c7-ab8308a353f9"],
]);

export const returnedSeasonsById: Map<SeasonID, number> = new Map(Array.from(returnedSeasons, entry => [entry[1], entry[0]]));