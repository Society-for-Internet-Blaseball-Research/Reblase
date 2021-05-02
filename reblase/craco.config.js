const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    style: {
        postcss: {
            plugins: [require("tailwindcss")],
        },
    },
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin());

            const tsRule = webpackConfig.module.rules[1].oneOf[2];
            tsRule.include = undefined;
            tsRule.exclude = /node_modules/;

            return webpackConfig;
        },
    },
};
