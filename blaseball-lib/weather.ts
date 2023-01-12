export interface WeatherType {
    id: number;
    name: string;
    emoji: string;
    background: string;
    color: string;
    forbidden: boolean;
}

export const allWeatherTypes: WeatherType[] = [
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
        emoji: "\u{2753}",
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
        forbidden: false,
    },
    {
        id: 6,
        name: "Acidic",
        // icon: WiFog,
        emoji: "\u{2753}",
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
        forbidden: false,
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
    {
        id: 18,
        name: "Flooding",
        emoji: "\u{1F6B0}",
        background: "#465f63",
        color: "#ffffff",
        forbidden: false,
    },
    {
        id: 19,
        name: "Salmon",
        emoji: "\u{1F41F}",
        background: "#ba7b97",
        color: "#f2c7e3",
        forbidden: false,
    },
    {
        id: 20,
        name: "Polarity +",
        emoji: "\u{23EB}",
        background: "#042e16",
        color: "#d3e3e2",
        forbidden: false,
    },
    {
        id: 21,
        name: "Polarity -",
        emoji: "\u{23EC}",
        background: "#3b0422",
        color: "#ff6be6",
        forbidden: false,
    },
    {
        id: 22,
        name: "???",
        emoji: "\u{2753}", // ? emoji
        background: "#0e4e8a",
        color: "#ffc400",
        forbidden: true,
    },
    {
        id: 23,
        name: "Sun 90",
        emoji: "\u{2753}", // ? emoji
        background: "#0e4e8a",
        color: "#ffc400",
        forbidden: true,
    },
    {
        id: 24,
        name: "Sun .1",
        emoji: "\u{1F90F}",
        background: "#0e4e8a",
        color: "#ffc400",
        forbidden: false,
    },
    {
        id: 25,
        name: "Sum Sun",
        emoji: "\u{2795}", // ? emoji
        background: "#0e4e8a",
        color: "#ffc400",
        forbidden: false,
    },
    {
        id: 26,
        name: "Supernova Eclipse",
        emoji: "\u{1F386}",
        background: "#36001b",
        color: "#ffc400",
        forbidden: false,
    },
    {
        id: 27,
        name: "Black Hole (Black Hole)",
        emoji: "\u{23F9}", // send help. we're running out of emojis.
        background: "#36001b",
        color: "#ffc400",
        forbidden: false,
    },
    {
        id: 28,
        name: "Jazz",
        emoji: "\u{1F3B7}",
        background: "#0f592f",
        color: "#000",
        forbidden: false,
    },
    {
        id: 29,
        name: "Night",
        emoji: "\u{1F319}", // ? emoji
        background: "#000",
        color: "#ff8d13",
        forbidden: false,
    },
];

export function getWeather(id: number): WeatherType {
    if (id === 3000){
        return {
            id: 3000,
            name: "Horizon",
            emoji: "\u{1F573}",
            background: "#36001b",
            color: "#ffc400",
            forbidden: true,
        };
    }

    return (
        allWeatherTypes[id] ?? {
            id,
            name: "???",
            emoji: "\u{2753}",
            background: "#ffffff",
            color: "#000000",
            forbidden: true,
        }
    );
}
