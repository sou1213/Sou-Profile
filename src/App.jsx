import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useLiquidGlass } from "./glass/useLiquidGlass.js";
import { localePaths, pageMetadata, siteContent } from "./siteContent.js";

const heroImage = "/assets/chatgpt-touchbar/figma-readme-hero.png";
const touchBarImage = "/assets/chatgpt-touchbar/safari-touch-bar.png";
const themeStorageKey = "sou-profile-theme";
const pageTransitionFallbackDelay = 600;
const pageOrder = { home: 0, work: 1 };
const openGraphLocales = { ja: "ja_JP", en: "en_US" };

function pageFromPath(pathname) {
    return /\/work(?:\.html)?\/?$/.test(pathname) ? "work" : "home";
}

function updateDocumentMetadata(page, locale) {
    const metadata = pageMetadata[locale][page];
    const alternateLocale = locale === "ja" ? "en" : "ja";

    document.documentElement.lang = locale;
    document.body.dataset.page = page;
    document.body.dataset.locale = locale;
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", metadata.canonical);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", metadata.canonical);
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", openGraphLocales[locale]);
    document.querySelector('meta[property="og:locale:alternate"]')?.setAttribute("content", openGraphLocales[alternateLocale]);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", metadata.description);

    for (const targetLocale of ["ja", "en"]) {
        document.querySelector(`link[rel="alternate"][hreflang="${targetLocale}"]`)
            ?.setAttribute("href", pageMetadata[targetLocale][page].canonical);
    }
    document.querySelector('link[rel="alternate"][hreflang="x-default"]')
        ?.setAttribute("href", pageMetadata.ja[page].canonical);
}

const SiteNavigation = forwardRef(function SiteNavigation(
    { locale, page, visualPage, theme, onNavigate, onToggleTheme },
    ref
) {
    const text = siteContent[locale].nav;
    const targetLocale = locale === "ja" ? "en" : "ja";

    const handleNavigation = (event, targetPage) => {
        const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        if (event.defaultPrevented || event.button !== 0 || isModifiedClick) return;

        event.preventDefault();
        onNavigate(targetPage, event.currentTarget.href);
    };

    return (
        <nav className="site-nav" aria-label={text.label} ref={ref}>
            <a className="site-mark" href={localePaths[locale].home} aria-label={text.markLabel}>
                SOU / LOG
            </a>
            <div className="site-links" data-active-page={visualPage}>
                <span
                    className="nav-active-indicator"
                    aria-hidden="true"
                />
                <a
                    className="nav-link"
                    data-page="home"
                    href={localePaths[locale].home}
                    aria-current={page === "home" ? "page" : undefined}
                    onClick={(event) => handleNavigation(event, "home")}
                >
                    <span className="nav-label">{text.home}</span>
                </a>
                <a
                    className="nav-link"
                    data-page="work"
                    href={localePaths[locale].work}
                    aria-current={page === "work" ? "page" : undefined}
                    onClick={(event) => handleNavigation(event, "work")}
                >
                    <span className="nav-label">{text.work}</span>
                </a>
            </div>
            <div className="nav-controls">
                <button
                    className="theme-toggle"
                    type="button"
                    suppressHydrationWarning
                    aria-label={theme === "dark" ? text.switchToLight : text.switchToDark}
                    aria-pressed={theme === "dark"}
                    onClick={onToggleTheme}
                >
                    {theme === "dark" ? text.light : text.dark}
                </button>
                <a
                    className="language-toggle"
                    href={localePaths[targetLocale][visualPage]}
                    hrefLang={targetLocale}
                    lang={targetLocale}
                    aria-label={text.switchLanguage}
                >
                    {text.targetLanguage}
                </a>
            </div>
        </nav>
    );
});

function XIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true">
            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" aria-hidden="true">
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
        </svg>
    );
}

function HomePage({ locale }) {
    const text = siteContent[locale].home;

    return (
        <main className="container container--home" tabIndex="-1">
            <header className="profile-header">
                <h1>
                    SOSUKE TAKAHASHI {locale === "ja" && <span className="kanji">- {text.name}</span>}
                </h1>
                <div className="role-badge">iOS Engineer</div>
                <div className="keywords">
                    Swift <span className="slash">/</span> iOS App <span className="slash">/</span> OSS{" "}
                    <span className="slash">/</span> UI Design <span className="slash">/</span> Python
                </div>
                <p className="sub-text">Learning to Create / Path to Switzerland</p>
            </header>

            <section>
                <h2>Current State</h2>
                {text.currentState.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>

            <section>
                <h2>Current Focus</h2>
                <div className="project-item">
                    <span className="label">App Development</span>
                    <p className="project-desc">{text.currentFocus}</p>
                </div>
            </section>

            <section>
                <h2>Mindset</h2>
                <p>{text.mindset}</p>
            </section>

            <div className="sns-box" aria-label={text.socialLabel}>
                <a href="https://x.com/hitonoyakntatsu" className="btn-sns" target="_blank" rel="noopener noreferrer" aria-label={text.xLabel}>
                    <XIcon />
                </a>
                <a href="https://github.com/sou1213" className="btn-sns" target="_blank" rel="noopener noreferrer" aria-label={text.githubLabel}>
                    <GitHubIcon />
                </a>
            </div>

            <Footer />
        </main>
    );
}

function TechList({ children, locale }) {
    return <div className="tech-list" aria-label={siteContent[locale].shared.technologies}>{children}</div>;
}

function WorkPage({ locale }) {
    const text = siteContent[locale].work;
    const touchBar = text.touchBar;
    const taskManager = text.taskManager;
    const wallpaper = text.wallpaper;

    return (
        <main className="container container--work" tabIndex="-1">
            <header className="page-header">
                <p className="eyebrow">{text.eyebrow}</p>
                <h1>{text.title}</h1>
                <p className="page-lead">{text.lead}</p>
            </header>

            <section aria-labelledby="macos-apps-title">
                <h2 id="macos-apps-title">{touchBar.sectionTitle}</h2>
                <article className="work-card">
                    <div className="work-card__meta"><span className="status-badge">{touchBar.status}</span><span>2026</span></div>
                    <h3>{touchBar.title}</h3>
                    <figure className="work-visual">
                        <img src={heroImage} alt={touchBar.imageAlt} width="1440" height="760" decoding="async" />
                    </figure>
                    <p>{touchBar.intro}</p>

                    <details className="work-details">
                        <summary><span className="details-label details-label--closed">{touchBar.readMore}</span><span className="details-label details-label--open">{touchBar.closeDetails}</span><span className="details-icon" aria-hidden="true">▼</span></summary>
                        <div className="work-details__content">
                            {touchBar.details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                            <figure className="work-visual work-visual--touchbar">
                                {/* Safari can leave html2canvas's cloned document loading forever with lazy images. */}
                                <img src={touchBarImage} alt={touchBar.touchBarAlt} width="2008" height="60" loading="eager" decoding="async" />
                                <figcaption>{touchBar.touchBarCaption}</figcaption>
                            </figure>
                            <ul className="feature-list">
                                {touchBar.features.map((feature) => <li key={feature}>{feature}</li>)}
                            </ul>
                            <div className="notice-box">{touchBar.notice}</div>
                            <TechList locale={locale}><span>Swift</span><span>AppKit</span><span>NSTouchBar</span><span>NSWorkspace</span><span>AppleScript</span><span>Codex App Server</span></TechList>
                        </div>
                    </details>
                    <div className="work-actions"><a className="primary-link" href="https://github.com/sou1213/chatgpt-touchbar" target="_blank" rel="noopener noreferrer">{touchBar.action} <span aria-hidden="true">↗</span></a><span className="private-note">{touchBar.license}</span></div>
                </article>
            </section>

            <section aria-labelledby="ios-apps-title">
                <h2 id="ios-apps-title">{taskManager.sectionTitle}</h2>
                <article className="work-card">
                    <div className="work-card__meta"><span className="status-badge">{taskManager.status}</span><span>2026</span></div>
                    <h3>{taskManager.title}</h3>
                    {taskManager.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    <ul className="feature-list">{taskManager.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                    <div className="notice-box">{taskManager.notice}</div>
                    <TechList locale={locale}><span>Swift</span><span>SwiftUI</span><span>PencilKit</span><span>Vision</span><span>UserNotifications</span></TechList>
                    <div className="work-actions"><span className="private-note">{taskManager.availability}</span></div>
                </article>
            </section>

            <section aria-labelledby="web-apps-title">
                <h2 id="web-apps-title">{wallpaper.sectionTitle}</h2>
                <article className="work-card">
                    <div className="work-card__meta"><span className="status-badge">{wallpaper.status}</span><span>2026</span></div>
                    <h3>{wallpaper.title}</h3>
                    {wallpaper.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    <ul className="feature-list">{wallpaper.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                    <div className="notice-box">{wallpaper.notice}</div>
                    <TechList locale={locale}><span>HTML</span><span>CSS</span><span>JavaScript</span><span>WebGL</span><span>Cloudflare Pages</span></TechList>
                    <div className="work-actions"><a className="primary-link" href="https://your-feel-of-wallpaper-q8m4x7.pages.dev/" target="_blank" rel="noopener noreferrer">{wallpaper.action} <span aria-hidden="true">↗</span></a><span className="private-note">{wallpaper.source}</span></div>
                </article>
            </section>

            <Footer />
        </main>
    );
}

function Footer() {
    return <footer>&copy; 2026 SOSUKE TAKAHASHI</footer>;
}

function initialTheme() {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function App({ page, locale = "ja" }) {
    const [theme, setTheme] = useState(initialTheme);
    const [currentPage, setCurrentPage] = useState(page);
    const [pageTransition, setPageTransition] = useState(null);
    const canvasRef = useRef(null);
    const backdropRef = useRef(null);
    const navigationRef = useRef(null);
    const pageStageRef = useRef(null);
    const currentPageRef = useRef(page);
    const pageTransitionRef = useRef(null);
    const pageTransitionTimerRef = useRef(null);

    const finishPageTransition = useCallback(() => {
        const activeTransition = pageTransitionRef.current;
        if (!activeTransition) return;

        clearTimeout(pageTransitionTimerRef.current);
        pageTransitionRef.current = null;
        currentPageRef.current = activeTransition.to;

        if (activeTransition.historyMode === "push") {
            window.history.pushState(
                { page: activeTransition.to },
                "",
                activeTransition.href
            );
        }

        updateDocumentMetadata(activeTransition.to, locale);
        if (document.documentElement.dataset.glassRenderer === "ready") {
            document.documentElement.dataset.glassRenderer = "loading";
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        setCurrentPage(activeTransition.to);
        setPageTransition(null);

        requestAnimationFrame(() => {
            pageStageRef.current?.querySelector("main")?.focus({ preventScroll: true });
        });
    }, [locale]);

    const beginPageTransition = useCallback((targetPage, href, historyMode = "push") => {
        if (targetPage === currentPageRef.current || pageTransitionRef.current) return;

        const transition = {
            from: currentPageRef.current,
            to: targetPage,
            direction: pageOrder[targetPage] > pageOrder[currentPageRef.current]
                ? "forward"
                : "backward",
            historyMode,
            href,
            scrollOffset: window.scrollY,
            viewportHeight: window.innerHeight
        };

        pageTransitionRef.current = transition;

        if (
            typeof matchMedia === "function" &&
            matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            finishPageTransition();
            return;
        }

        setPageTransition(transition);
        clearTimeout(pageTransitionTimerRef.current);
        pageTransitionTimerRef.current = setTimeout(
            finishPageTransition,
            pageTransitionFallbackDelay
        );
    }, [finishPageTransition]);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem(themeStorageKey, theme);
        } catch {
            // The theme remains active for this page when storage is unavailable.
        }
    }, [theme]);

    useEffect(() => {
        const handlePopState = () => {
            const targetPage = pageFromPath(window.location.pathname);

            if (pageTransitionRef.current) {
                clearTimeout(pageTransitionTimerRef.current);
                pageTransitionRef.current = null;
                setPageTransition(null);
            }

            beginPageTransition(targetPage, window.location.href, "pop");
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
            clearTimeout(pageTransitionTimerRef.current);
        };
    }, [beginPageTransition]);

    useLiquidGlass({
        canvasRef,
        backdropRef,
        lensRef: navigationRef,
        refreshKey: `${locale}-${currentPage}-${theme}`
    });

    const visiblePages = pageTransition
        ? [
            { page: pageTransition.from, role: "outgoing" },
            { page: pageTransition.to, role: "incoming" }
        ]
        : [{ page: currentPage, role: "current" }];
    const visualPage = pageTransition?.to ?? currentPage;

    return (
        <>
            <div
                className="site-shell"
                data-transitioning={pageTransition ? "true" : undefined}
                ref={backdropRef}
            >
                <div
                    className="page-stage"
                    data-direction={pageTransition?.direction}
                    ref={pageStageRef}
                    style={pageTransition ? {
                        "--page-transition-scroll": `${pageTransition.scrollOffset}px`,
                        "--page-transition-viewport": `${pageTransition.viewportHeight}px`
                    } : undefined}
                >
                    {visiblePages.map(({ page: visiblePage, role }) => (
                        <div
                            className={`page-panel page-panel--${role}`}
                            key={visiblePage}
                            aria-hidden={role === "current" ? undefined : "true"}
                            inert={role === "current" ? undefined : true}
                            onAnimationEnd={role === "incoming" ? (event) => {
                                if (event.currentTarget === event.target) finishPageTransition();
                            } : undefined}
                        >
                            {visiblePage === "work" ? <WorkPage locale={locale} /> : <HomePage locale={locale} />}
                        </div>
                    ))}
                </div>
            </div>
            <canvas className="glass-canvas" ref={canvasRef} aria-hidden="true" />
            <SiteNavigation
                ref={navigationRef}
                locale={locale}
                page={currentPage}
                visualPage={visualPage}
                theme={theme}
                onNavigate={beginPageTransition}
                onToggleTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")}
            />
        </>
    );
}
