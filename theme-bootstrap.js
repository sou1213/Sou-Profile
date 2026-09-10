(function () {
    const storageKey = "sou-profile-theme";
    let storedTheme = null;

    try {
        const value = localStorage.getItem(storageKey);
        if (value === "light" || value === "dark") storedTheme = value;
    } catch {
        // System preference still provides the initial theme when storage is unavailable.
    }

    const systemTheme = (
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-color-scheme: light)").matches
    ) ? "light" : "dark";
    const theme = storedTheme || systemTheme;

    document.documentElement.dataset.theme = theme;

    if (!storedTheme) {
        try {
            localStorage.setItem(storageKey, theme);
        } catch {
            // The detected theme remains active for this page when storage is unavailable.
        }
    }
})();
