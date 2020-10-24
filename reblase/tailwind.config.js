const plugin = require("tailwindcss/plugin")

module.exports = {
    purge: ["src/**/*.tsx", "src/**/*.html", "src/**/*.ts"],
    theme: {
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1200px",
        },
        extend: {
            screens: { dark: { raw: "(prefers-color-scheme: dark)" } },
        },
    },
    variants: {
        backgroundColor: ["responsive", "odd", "hover", "dark-hover", "focus"],
        textColor: ["responsive", "dark-hover"],
    },
    plugins: [
        plugin(function({ addVariant, e, postcss }) {
            addVariant("dark-hover", ({ container, separator }) => {
                const mediaRule = postcss.atRule({ name: "media", params: "(prefers-color-scheme: dark)" });
                mediaRule.append(container.nodes);
                container.append(mediaRule);
                mediaRule.walkRules(rule => {
                    rule.selector = `.${e(`dark-hover${separator}${rule.selector.slice(1)}`)}:hover`;
                });
            });
        }),
    ],
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
};
