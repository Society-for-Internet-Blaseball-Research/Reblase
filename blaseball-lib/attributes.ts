import { AttributeID, BlaseballAttributes, BlaseballAttributesDeprecated } from "./common";
import Attributes from "./data/attributes.json";

export interface Attribute {
    id: AttributeID;
    color: string;
    textColor: string;
    background: string;
    title: string;
    description: string;
}

export const allAttributes = Attributes;

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
