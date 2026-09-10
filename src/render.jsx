import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App.jsx";

export function render(page) {
    return renderToString(createElement(App, { page }));
}
