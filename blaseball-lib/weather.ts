export interface WeatherType {
    id: number;
    name: string;
    emoji?: string;
    background: string;
    color: string;
    forbidden: boolean;
}

export const allWeatherTypes = [
    {
        id: 0,
        name: "Void",
        // icon: WiMoonFull,
        emoji: "\u{26AB}",
        background: "#67678a",
        color: "#000000",
        forbidden: true,
    },
    {
        id: 1,
        name: "Sun 2",
        // icon: WiDaySunny,
        emoji: "\u{2600}",
        background: "#db7900",
        color: "#fffec4",
        forbidden: false,
    },
    {
        id: 2,
        name: "Overcast",
        // icon: WiCloudy,
        emoji: "\u{1F325}",
        background: "#cfcfcf",
        color: "#737373",
        forbidden: true,
    },
    {
        id: 3,
        name: "Rainy",
        // icon: WiRain,
        emoji: "\u{1F327}",
        background: "#348e9e",
        color: "#0727a8",
        forbidden: true,
    },
    {
        id: 4,
        name: "Sandstorm",
        // icon: WiSandstorm,
        background: "#877652",
        color: "#e0dac3",
        forbidden: true,
    },
    {
        id: 5,
        name: "Snowy",
        // icon: WiSnow,
        emoji: "\u{1F328}",
        background: "#68969e",
        color: "#ffffff",
        forbidden: true,
    },
    {
        id: 6,
        name: "Acidic",
        // icon: WiFog,
        background: "#92ad58",
        color: "#235917",
        forbidden: true,
    },
    {
        id: 7,
        name: "Solar Eclipse",
        // icon: WiSolarEclipse,
        emoji: "\u{1F311}",
        background: "#002f3b",
        color: "#3c6cba",
        forbidden: false,
    },
    {
        id: 8,
        name: "Glitter",
        emoji: "\u{2728}",
        // icon: WiStars,
        background: "#ff94ff",
        color: "#fff98a",
        forbidden: true,
    },
    {
        id: 9,
        name: "Blooddrain",
        // icon: WiRain,
        emoji: "\u{1FA78}",
        background: "#52050f",
        color: "#ff1f3c",
        forbidden: false,
    },
    {
        id: 10,
        name: "Peanuts",
        // icon: GiPeanut,
        emoji: "\u{1F95C}",
        background: "#c4aa70",
        color: "#423822",
        forbidden: false,
    },
    {
        id: 11,
        name: "Birds",
        // icon: GiBirdClaw,
        emoji: "\u{1F426}",
        background: "#45235e",
        color: "#8e5fad",
        forbidden: false,
    },
    {
        id: 12,
        name: "Feedback",
        // icon: GiMicrophone,
        emoji: "\u{1F3A4}",
        background: "#383838",
        color: "#ff007b",
        forbidden: false,
    },
    {
        id: 13,
        name: "Reverb",
        // icon: GiBigWave,
        emoji: "\u{1F30A}",
        background: "#443561",
        color: "#61b3ff",
        forbidden: false,
    },
    {
        id: 14,
        name: "Black Hole",
        // icon: GiVortex
        emoji: "\u{26AB}",
        background: "#000000",
        color: "#00374a",
        forbidden: false,
    },
    {
        id: 15,
        name: "Coffee",
        emoji: "\u{2615}",
        background: "#9a7b4f",
        color: "#511c00",
        forbidden: false,
    },
    {
        id: 16,
        name: "Coffee 2",
        emoji: "\u{1F375}",
        background: "#44c97c",
        color: "#2e1406",
        forbidden: false,
    },
    {
        id: 17,
        name: "Coffee 3s",
        emoji: "3\u{FE0F}\u{20E3}", // keycap 3
        background: "#5fa9f1",
        color: "#cc527a",
        forbidden: false,
    },
];

export function getWeather(id: number): WeatherType | null {
    return allWeatherTypes[id] ?? null;
}
