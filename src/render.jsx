import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App.jsx";

export function render(page, locale = "ja") {
    return renderToString(createElement(App, { page, locale }));
}
