import { AttributeID, BlaseballAttributes, BlaseballAttributesDeprecated } from "./common";

export interface Attribute {
    id: AttributeID;
    color: string;
    textColor: string;
    background: string;
    title: string;
    description: string;
}

export const allAttributes = [
    {
        id: "EXTRA_STRIKE",
        color: "#f77c9f",
        textColor: "#f77c9f",
        background: "#8c1839",
        title: "The Fourth Strike",
        description: "Those with the Fourth Strike will get an extra strike in each at bat.",
    },
    {
        id: "SHAME_PIT",
        color: "#b96dbd",
        textColor: "#b96dbd",
        background: "#3d1539",
        title: "Targeted Shame",
        description: "Teams with Targeted Shame will start with negative runs the game after being shamed.",
    },
    {
        id: "HOME_FIELD",
        color: "#f9ff54",
        textColor: "#f9ff54",
        background: "#4f9c30",
        title: "Home Field Advantage",
        description: "Teams with Home Field Advantage will start each home game with one run.",
    },
    {
        id: "FIREPROOF",
        color: "#a5c5f0",
        textColor: "#a5c5f0",
        background: "#4c77b0",
        title: "Fireproof",
        description: "A Fireproof player can not be incinerated.",
    },
    {
        id: "ALTERNATE",
        color: "#fffd85",
        textColor: "#fffd85",
        background: "#404040",
        title: "Alternate",
        description: "This player is an Alternate...",
    },
    {
        id: "SOUNDPROOF",
        color: "#c92080",
        textColor: "#c92080",
        background: "#000000",
        title: "Soundproof",
        description: "A Soundproof player can not be caught in Feedback's reality flickers.",
    },
    {
        id: "SHELLED",
        color: "#fffd85",
        textColor: "#fffd85",
        background: "#404040",
        title: "Shelled",
        description: "A Shelled player is trapped in a big Peanut is unable to bat or pitch.",
    },
    {
        id: "REVERBERATING",
        color: "#61b3ff",
        textColor: "#61b3ff",
        background: "#756773",
        title: "Reverberating",
        description: "A Reverberating player has a small chance of batting again after each of their At-Bats end.",
    },
    {
        id: "BLOOD_DONOR",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#52050f",
        title: "Blood Donor",
        description:
            "In the Blood Bath, this team will donate Stars to a division opponent that finished behind them in the standings.",
    },
    {
        id: "BLOOD_THIEF",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#52050f",
        title: "Blood Thief",
        description:
            "In the Blood Bath, this team will steal Stars from a division opponent that finished ahead of them in the standings.",
    },
    {
        id: "BLOOD_PITY",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#52050f",
        title: "Blood Pity",
        description: "In the Blood Bath, this team must give Stars to the team that finished last in their division.",
    },
    {
        id: "BLOOD_WINNER",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#52050f",
        title: "Blood Winner",
        description: "In the Blood Bath, this team must give Stars to the team that finished first in their division.",
    },
    {
        id: "BLOOD_FAITH",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#52050f",
        title: "Blood Faith",
        description: "In the Blood Bath, this player will receive a small boost to a random stat.",
    },
    {
        id: "BLOOD_LAW",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#52050f",
        title: "Blood Law",
        description:
            "In the Blood Bath, this team will gain or lose Stars depending on how low or high they finish in their division.",
    },
    {
        id: "BLOOD_CHAOS",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#52050f",
        title: "Blood Chaos",
        description: "In the Blood Bath, each player on this team will gain or lose a random amount of Stars.",
    },
    {
        id: "RETURNED",
        color: "#fbff8a",
        textColor: "#fbff8a",
        background: "#1b1c80",
        title: "Returned",
        description:
            "This player has Returned from the void. At the end of each season, this player has a chance of being called back to the Void.",
    },
    {
        id: "INWARD",
        color: "#d3d8de",
        textColor: "#d3d8de",
        background: "#38080d",
        title: "Inward",
        description: "This player has turned Inward.",
    },
    {
        id: "MARKED",
        color: "#eaabff",
        textColor: "#eaabff",
        background: "#1b1c80",
        title: "Unstable",
        description: "Unstable players have a much higher chance of being incinerated in a Solar Eclipse.",
    },
    {
        id: "PARTY_TIME",
        color: "#ff66f9",
        textColor: "#ff66f9",
        background: "#fff947",
        title: "Party Time",
        description:
            "This team is mathematically eliminated from the Postseason, and will occasionally receive permanent stats boost in their games.",
    },
    {
        id: "LIFE_OF_PARTY",
        color: "#fff45e",
        textColor: "#fff45e",
        background: "#9141ba",
        title: "Life of the Party",
        description: "This team gets 10% more from their Party Time stat boosts.",
    },
    {
        id: "DEBT_ZERO",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#1b1c80",
        title: "Debt",
        description: "This player must fulfill a debt.",
    },
    {
        id: "DEBT",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#363738",
        title: "Refinanced Debt",
        description: "This player must fulfill a \u24d3\u24d4\u24d1\u24e3.",
    },
    {
        id: "DEBT_TWO",
        color: "#ff1f3c",
        textColor: "#ff1f3c",
        background: "#1b1c80",
        title: "Refinanced Debt",
        description: "This player must fulfill a \u24d3\u24d4\u24d1\u24e3.",
    },
    {
        id: "SPICY",
        color: "#9e0022",
        textColor: "#9e0022",
        background: "#d15700",
        title: "Spicy",
        description: "Spicy batters will be Red Hot when they get three consecutive hits.",
    },
    {
        id: "HEATING_UP",
        color: "#9e0022",
        textColor: "#9e0022",
        background: "#d15700",
        title: "Heating Up...",
        description:
            "This batter needs one more consecutive hit to enter Fire mode. This mod will disappear if the batter gets out.",
    },
    {
        id: "ON_FIRE",
        color: "#fff982",
        textColor: "#fff982",
        background: "#e32600",
        title: "Red Hot!",
        description:
            "Red Hot! This player's batting is greatly boosted. This mod will disappear if the batter gets out.",
    },
    {
        id: "HONEY_ROASTED",
        color: "#ffda75",
        textColor: "#ffda75",
        background: "#b5831f",
        title: "Honey Roasted",
        description: "This player has been Honey-Roasted.",
    },
    {
        id: "FIRST_BORN",
        color: "#fffea8",
        textColor: "#fffea8",
        background: "#517063",
        title: "First Born",
        description: "This player was the first born from the New Field of Eggs.",
    },
    {
        id: "SUPERALLERGIC",
        color: "#bd224e",
        textColor: "#bd224e",
        background: "#45003d",
        title: "Superallergic",
        description: "This player is Superallergic",
    },
    {
        id: "EXTRA_BASE",
        color: "#d9d9d9",
        textColor: "#d9d9d9",
        background: "#4a001a",
        title: "Fifth Base",
        description: "This team must run five bases instead of four in order to score.",
    },
    {
        id: "BLESS_OFF",
        color: "#e0cafa",
        textColor: "#e0cafa",
        background: "#7d58a8",
        title: "Bless Off",
        description: "This team cannot win any Blessings in the upcoming Election.",
    },
    {
        id: "NON_IDOLIZED",
        color: "#fffaba",
        textColor: "#fffaba",
        background: "#540e43",
        title: "Idol Immune",
        description: "Idol Immune players cannot be Idolized by Fans.",
    },
    {
        id: "GRAVITY",
        color: "#759bc9",
        textColor: "#759bc9",
        background: "#4c5052",
        title: "Gravity",
        description: "This player cannot be affected by Reverb.",
    },
    {
        id: "ELECTRIC",
        color: "#fff199",
        textColor: "#fff199",
        background: "#04144a",
        title: "Electric",
        description: "Electric teams have a chance of zapping away Strikes.",
    },
    {
        id: "DOUBLE_PAYOUTS",
        color: "#fffaba",
        textColor: "#fffaba",
        background: "#786600",
        title: "Super Idol",
        description: "This player will earn Fans double the rewards from all Idol Pendants.",
    },
    {
        id: "FIRE_PROTECTOR",
        color: "#c4ff85",
        textColor: "#c4ff85",
        background: "#1f474f",
        title: "Fire Protector",
        description: "This player will protect their team from incinerations.",
    },
    {
        id: "RECEIVER",
        color: "#ff007b",
        textColor: "#ff007b",
        background: "#383838",
        title: "Receiver",
        description: "This player is a Receiver.",
    },
    {
        id: "FLICKERING",
        color: "#ff007b",
        textColor: "#ff007b",
        background: "#383838",
        title: "Flickering",
        description: "Flickering players have a much higher chance of being Feedbacked to their opponent.",
    },
    {
        id: "GROWTH",
        color: "#52a17b",
        textColor: "#52a17b",
        background: "#13422b",
        title: "Growth",
        description: "Growth teams will play better as the season goes on, up to a 5% global boost by season's end.",
    },
    {
        id: "BASE_INSTINCTS",
        color: "#dedede",
        textColor: "#dedede",
        background: "#329c98",
        title: "Base Instincts",
        description: "Batters with Base Instincts will have a chance of heading past first base when getting walked.",
    },
    {
        id: "STABLE",
        color: "#91b5a3",
        textColor: "#91b5a3",
        background: "#335980",
        title: "Stable",
        description: "Stable players cannot be made Unstable.",
    },
    {
        id: "AFFINITY_FOR_CROWS",
        color: "#cb80d9",
        textColor: "#cb80d9",
        background: "#240c36",
        title: "Affinity for Crows",
        description: "Players with Affinity for Crows will hit and pitch 50% better during Birds weather.",
    },
];

export const attributeById: Partial<Record<AttributeID, Attribute>> = Object.assign(
    {},
    ...allAttributes.map((attr) => ({ [attr.id]: attr }))
);

export type AttributeDuration = "permanent" | "season" | "week" | "game";
export interface AttributeInstance {
    attribute: Attribute;
    duration: AttributeDuration;
}

export function getAttribute(id: AttributeID): Attribute | null {
    return attributeById[id] ?? null;
}

export function hasAttribute(entity: BlaseballAttributes | BlaseballAttributesDeprecated, id: AttributeID) {
    for (const attr of getAttributesFor(entity)) if (attr.attribute?.id === id) return true;
    return false;
}

export function getAttributesFor(entity: BlaseballAttributes | BlaseballAttributesDeprecated) {
    const instances = [];

    const newAttrs = entity as BlaseballAttributes;
    if (newAttrs.gameAttr) {
        for (const attr of newAttrs.gameAttr ?? [])
            instances.push({ attribute: attributeById[attr], duration: "game" });

        for (const attr of newAttrs.weekAttr ?? [])
            instances.push({ attribute: attributeById[attr], duration: "week" });

        for (const attr of newAttrs.seasAttr ?? [])
            instances.push({ attribute: attributeById[attr], duration: "season" });

        for (const attr of newAttrs.permAttr ?? [])
            instances.push({ attribute: attributeById[attr], duration: "permanent" });
    }

    const oldAttrs = entity as BlaseballAttributesDeprecated;
    if (oldAttrs.permanentAttributes) {
        for (const attr of oldAttrs.seasonAttributes ?? [])
            instances.push({ attribute: attributeById[attr], duration: "season" });

        for (const attr of oldAttrs.permanentAttributes ?? [])
            instances.push({ attribute: attributeById[attr], duration: "permanent" });
    }

    return instances;
}
