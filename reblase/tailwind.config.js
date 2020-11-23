module.exports = {
    purge: ["src/**/*.tsx", "src/**/*.html", "src/**/*.ts"],
    theme: {
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1200px",
        },
    },
    variants: {
        backgroundColor: ({ after }) => after(["odd", "dark", "dark-hover"]),
        borderColor: ({ after }) => after(["dark"]),
        display: ({ after }) => after(["dark"]),
        textColor: ({ after }) => after(["dark", "dark-hover"]),
    },
    plugins: [
        require('tailwindcss-dark-mode')(),
    ],
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
};
