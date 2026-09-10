import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useLiquidGlass } from "./glass/useLiquidGlass.js";

const heroImage = "./assets/chatgpt-touchbar/figma-readme-hero.png";
const touchBarImage = "./assets/chatgpt-touchbar/safari-touch-bar.png";
const themeStorageKey = "sou-profile-theme";
const pageTransitionFallbackDelay = 600;
const pageOrder = { home: 0, work: 1 };
const pageMetadata = {
    home: {
        title: "高橋壮介 | Swift・iOSアプリ開発ポートフォリオ",
        description: "高橋壮介のSwift・iOSアプリ開発ポートフォリオ。iPadのSwift Playgroundsを使った学習、アプリ制作、Web制作の記録を紹介します。",
        canonical: "https://sou-profile.pages.dev/"
    },
    work: {
        title: "制作実績 | ChatGPT Touch Bar・iOS/Webアプリ | 高橋壮介",
        description: "高橋壮介がOSSとして公開するChatGPT Touch Barをはじめ、制作中のiOSアプリとWebアプリを紹介します。",
        canonical: "https://sou-profile.pages.dev/work"
    }
};

function pageFromPath(pathname) {
    return /\/work(?:\.html)?\/?$/.test(pathname) ? "work" : "home";
}

function updateDocumentMetadata(page) {
    const metadata = pageMetadata[page];
    document.body.dataset.page = page;
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", metadata.canonical);
}

const SiteNavigation = forwardRef(function SiteNavigation(
    { page, visualPage, theme, onNavigate, onToggleTheme },
    ref
) {
    const handleNavigation = (event, targetPage) => {
        const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        if (event.defaultPrevented || event.button !== 0 || isModifiedClick) return;

        event.preventDefault();
        onNavigate(targetPage, event.currentTarget.href);
    };

    return (
        <nav className="site-nav" aria-label="メインナビゲーション" ref={ref}>
            <a className="site-mark" href="./index.html" aria-label="SOU LOG ホーム">
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
                    href="./index.html"
                    aria-current={page === "home" ? "page" : undefined}
                    onClick={(event) => handleNavigation(event, "home")}
                >
                    <span className="nav-label">Home</span>
                </a>
                <a
                    className="nav-link"
                    data-page="work"
                    href="./work.html"
                    aria-current={page === "work" ? "page" : undefined}
                    onClick={(event) => handleNavigation(event, "work")}
                >
                    <span className="nav-label">Work</span>
                </a>
            </div>
            <button
                className="theme-toggle"
                type="button"
                suppressHydrationWarning
                aria-label={theme === "dark" ? "ライトモードへ切り替える" : "ダークモードへ切り替える"}
                aria-pressed={theme === "dark"}
                onClick={onToggleTheme}
            >
                {theme === "dark" ? "Light" : "Dark"}
            </button>
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

function HomePage() {
    return (
        <main className="container container--home" tabIndex="-1">
            <header className="profile-header">
                <h1>
                    SOSUKE TAKAHASHI <span className="kanji">- 高橋 壮介</span>
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
                <p>「知的好奇心」に従って、自分の手で何かを作れるようになるための試行錯誤中...。</p>
                <p>将来スイスを拠点に多様なライフスタイルを実現することを目標としていますが、現在はその土台作りとして「アプリ開発」に一点集中して取り組んでいます。</p>
            </section>

            <section>
                <h2>Current Focus</h2>
                <div className="project-item">
                    <span className="label">App Development</span>
                    <p className="project-desc">iPadのSwift Playgroundsのみを用いて、プログラミングの基礎学習からアプリの作成までを一貫して行っています。まずはこの領域で「形にする」経験を積むことに集中しています。</p>
                </div>
            </section>

            <section>
                <h2>Mindset</h2>
                <p>昨日分からなかったことが、今日分かるようになる過程を楽しみながら学んでいます。「尽きない好奇心」と毎日1％の努力を大切にしています。</p>
            </section>

            <div className="sns-box" aria-label="SNSリンク">
                <a href="https://x.com/hitonoyakntatsu" className="btn-sns" target="_blank" rel="noopener noreferrer" aria-label="Xプロフィールを開く">
                    <XIcon />
                </a>
                <a href="https://github.com/sou1213" className="btn-sns" target="_blank" rel="noopener noreferrer" aria-label="GitHubプロフィールを開く">
                    <GitHubIcon />
                </a>
            </div>

            <Footer />
        </main>
    );
}

function TechList({ children }) {
    return <div className="tech-list" aria-label="使用技術">{children}</div>;
}

function WorkPage() {
    return (
        <main className="container container--work" tabIndex="-1">
            <header className="page-header">
                <p className="eyebrow">Selected Work</p>
                <h1>WORK</h1>
                <p className="page-lead">完成品だけでなく、考えながら形にしている途中のプロジェクトも制作記録として掲載しています。</p>
            </header>

            <section aria-labelledby="macos-apps-title">
                <h2 id="macos-apps-title">macOS Application / Open Source</h2>
                <article className="work-card">
                    <div className="work-card__meta"><span className="status-badge">Open Source</span><span>2026</span></div>
                    <h3>ChatGPT Touch Bar</h3>
                    <figure className="work-visual">
                        <img src={heroImage} alt="ChatGPT Touch Barの概要と利用枠メーターを示す画像" width="1440" height="760" decoding="async" />
                    </figure>
                    <p>ChatGPT/Codexアプリ、またはSafariのChatGPTタブを使用している間、Codexの利用状況をMacBook ProのTouch Barに表示するmacOS常駐ヘルパーです。</p>

                    <details className="work-details">
                        <summary><span className="details-label details-label--closed">続きを見る</span><span className="details-label details-label--open">詳細を閉じる</span><span className="details-icon" aria-hidden="true">▼</span></summary>
                        <div className="work-details__content">
                            <p>5時間枠と週次枠の残り容量、次のリセット時刻を手元で確認できます。対象外のアプリやWebサイトへ切り替えると、Touch Barは自動的に通常の表示へ戻ります。</p>
                            <p>既存のCodex認証を利用してローカルで動作し、APIキーや有料の開発者APIは必要ありません。アクセス解析、テレメトリ、外部データベースを使用せず、Safari連携では現在のタブURLだけを確認します。</p>
                            <figure className="work-visual work-visual--touchbar">
                                {/* Safari can leave html2canvas's cloned document loading forever with lazy images. */}
                                <img src={touchBarImage} alt="SafariでChatGPTを使用しているときのTouch Bar表示" width="2008" height="60" loading="eager" decoding="async" />
                                <figcaption>SafariでChatGPTを使用中のTouch Bar表示</figcaption>
                            </figure>
                            <ul className="feature-list">
                                <li>Codexの5時間枠・週次枠の残り容量を表示</li><li>次回リセット時刻と30秒ごとの自動更新</li><li>ChatGPT/CodexデスクトップアプリとSafariに対応</li><li>利用状況に応じたTouch Barの表示・復元</li>
                            </ul>
                            <div className="notice-box">Touch Bar搭載MacBook ProとmacOS 12以降が必要です。署名済みバイナリはまだ公開していないため、現在はソースコードからビルドして利用します。</div>
                            <TechList><span>Swift</span><span>AppKit</span><span>NSTouchBar</span><span>NSWorkspace</span><span>AppleScript</span><span>Codex App Server</span></TechList>
                        </div>
                    </details>
                    <div className="work-actions"><a className="primary-link" href="https://github.com/sou1213/chatgpt-touchbar" target="_blank" rel="noopener noreferrer">View on GitHub <span aria-hidden="true">↗</span></a><span className="private-note">MIT License</span></div>
                </article>
            </section>

            <section aria-labelledby="ios-apps-title">
                <h2 id="ios-apps-title">iOS Application</h2>
                <article className="work-card">
                    <div className="work-card__meta"><span className="status-badge">In Development</span><span>2026</span></div>
                    <h3>TaskManager</h3>
                    <p>Apple Pencilでその日の予定を書き、時間と完了状況を管理するiPad向けの一日計画アプリです。毎日のタスクを作成する人に向けて、手で書くからこそ得られる「今日の計画を作った」という実感を大切にしています。</p>
                    <p>制作のきっかけは、Goodnotesに毎日のタスクを書いていたことでした。キーボードで入力するよりも自分の手で書く方が好きな人や、書く行為を通して予定と向き合いたい人が、自然に使えるアプリを目指しています。</p>
                    <p>また、日本では手書きに特化したタスク管理アプリがまだ多くないと感じたことから、機能を詰め込みすぎず、毎日迷わず使えるシンプルさと使いやすさを大切にしています。</p>
                    <ul className="feature-list"><li>Apple Pencilで書いた予定の保存と文字認識</li><li>朝・午後・夜に分けた一日の計画と完了管理</li><li>手書きによる開始・終了時刻の入力とローカル通知</li><li>未完了タスクの日次繰越、履歴、バックアップ</li></ul>
                    <div className="notice-box">現在は開発・検証中で、App Storeにはまだ公開していません。ダウンロードリンクは公開後に追加予定です。</div>
                    <TechList><span>Swift</span><span>SwiftUI</span><span>PencilKit</span><span>Vision</span><span>UserNotifications</span></TechList>
                    <div className="work-actions"><span className="private-note">App Store: Not yet available</span></div>
                </article>
            </section>

            <section aria-labelledby="web-apps-title">
                <h2 id="web-apps-title">Web Application</h2>
                <article className="work-card">
                    <div className="work-card__meta"><span className="status-badge">Work in Progress</span><span>2026</span></div>
                    <h3>Your Feel Of Wallpaper</h3>
                    <p>気分や時間帯に合う「壁紙 × 音楽」の組み合わせを、誰かのコメントと一緒に探索するWebアプリケーションです。</p>
                    <p>朝・昼・夕方・夜で画面全体の雰囲気が変わり、奥行きのある空間をスクロールしながら投稿を探せるプロトタイプを制作しています。</p>
                    <ul className="feature-list"><li>時間帯に連動する背景と投稿の切り替え</li><li>奥行きスクロールによる投稿探索</li><li>壁紙、コメント、タグ、外部音楽リンクの詳細表示</li><li>キーボード操作とReduced Motionへの対応</li></ul>
                    <div className="notice-box">現在は開発途中です。ログイン、実際の投稿、検索、データ保存などは未実装で、表示内容にはモックデータを使用しています。</div>
                    <TechList><span>HTML</span><span>CSS</span><span>JavaScript</span><span>WebGL</span><span>Cloudflare Pages</span></TechList>
                    <div className="work-actions"><a className="primary-link" href="https://your-feel-of-wallpaper-q8m4x7.pages.dev/" target="_blank" rel="noopener noreferrer">Live Preview <span aria-hidden="true">↗</span></a><span className="private-note">Source code: Private</span></div>
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

export function App({ page }) {
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

        updateDocumentMetadata(activeTransition.to);
        if (document.documentElement.dataset.glassRenderer === "ready") {
            document.documentElement.dataset.glassRenderer = "loading";
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        setCurrentPage(activeTransition.to);
        setPageTransition(null);

        requestAnimationFrame(() => {
            pageStageRef.current?.querySelector("main")?.focus({ preventScroll: true });
        });
    }, []);

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
        refreshKey: `${currentPage}-${theme}`
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
                            {visiblePage === "work" ? <WorkPage /> : <HomePage />}
                        </div>
                    ))}
                </div>
            </div>
            <canvas className="glass-canvas" ref={canvasRef} aria-hidden="true" />
            <SiteNavigation
                ref={navigationRef}
                page={currentPage}
                visualPage={visualPage}
                theme={theme}
                onNavigate={beginPageTransition}
                onToggleTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")}
            />
        </>
    );
}
