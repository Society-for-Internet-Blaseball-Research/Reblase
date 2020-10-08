const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    style: {
        postcss: {
            plugins: [require("postcss-nested"), require("tailwindcss")("./tailwind.config.js")],
        },
    },
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.plugins.pop();
            webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin());

            const tsRule = webpackConfig.module.rules[2].oneOf[1];
            tsRule.include = undefined;
            tsRule.exclude = /node_modules/;

            return webpackConfig;
        },
    },
};
