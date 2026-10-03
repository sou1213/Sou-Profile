import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const root = document.getElementById("root");
const app = (
    <StrictMode>
        <App
            page={["work", "blog", "blogPost"].includes(document.body.dataset.page) ? document.body.dataset.page : "home"}
            locale={document.body.dataset.locale === "en" ? "en" : "ja"}
        />
    </StrictMode>
);

if (root.hasChildNodes()) {
    hydrateRoot(root, app);
} else {
    createRoot(root).render(app);
}
