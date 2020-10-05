export type AttributeLifetime = "permanent" | "season" | "week" | "game";

export interface AttributeInstance {
    id: string;
    description: string;
    lifetime: AttributeLifetime;
}

export interface AttributeDefinition {
    id: string;
    description: string;
}

export const attributesDefinitions: AttributeDefinition[] = [];
