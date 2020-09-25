module.exports = {
    style: {
        postcss: {
            plugins: [
                require("postcss-nested"),
                require("tailwindcss")("./tailwind.config.js"),
            ],
        },
    },
};
