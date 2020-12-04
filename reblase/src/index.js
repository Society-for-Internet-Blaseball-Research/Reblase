import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { setup as setupColorScheme } from "./blaseball/color-scheme";

import "rc-tooltip/assets/bootstrap.css";
import "./style/style.css";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");

setupColorScheme();

ReactDOM.render(
    <BrowserRouter basename={baseUrl}>
        <App />
    </BrowserRouter>,
    rootElement
);
