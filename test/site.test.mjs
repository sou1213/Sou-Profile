import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const runThemeBootstrap = (source, { storedTheme = null, prefersLight = false } = {}) => {
    const values = new Map();
    if (storedTheme) values.set("sou-profile-theme", storedTheme);

    const document = { documentElement: { dataset: {} } };
    const localStorage = {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value)
    };
    const window = {
        matchMedia: (query) => ({
            matches: query === "(prefers-color-scheme: light)" && prefersLight
        })
    };

    runInNewContext(source, { document, localStorage, window });
    return { theme: document.documentElement.dataset.theme, values };
};

const readJsonLd = (html) => {
    const match = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
    assert.ok(match, "JSON-LDが存在すること");
    return JSON.parse(match[1]);
};

test("HomeとWorkで共通ナビゲーションを提供する", async () => {
    const [home, work, enHome, enWork, app] = await Promise.all([
        read("index.html"),
        read("work.html"),
        read("en/index.html"),
        read("en/work.html"),
        read("src/App.jsx")
    ]);

    for (const [html, page, locale] of [
        [home, "home", "ja"],
        [work, "work", "ja"],
        [enHome, "home", "en"],
        [enWork, "work", "en"]
    ]) {
        assert.match(html, new RegExp(`<html lang="${locale}">`));
        assert.match(html, new RegExp(`<body data-page="${page}" data-locale="${locale}">`));
        assert.match(html, /<div id="root"><\/div>/);
        assert.match(html, /src="(?:\.\/|\/)src\/main\.jsx"/);
        assert.match(html, /src="(?:\.\/|\/)theme-bootstrap\.js"/);
    }

    assert.match(app, /<nav className="site-nav" aria-label=\{text\.label\}/);
    assert.match(app, /href=\{localePaths\[locale\]\.home\}/);
    assert.match(app, /href=\{localePaths\[locale\]\.work\}/);
    assert.match(app, /page === "home" \? "page"/);
    assert.match(app, /page === "work" \? "page"/);
    assert.match(app, /className="nav-active-indicator"/);
});

test("言語切り替えは現在ページを保ち、次に表示する言語をラベルにする", async () => {
    const [app, content, home, work, enHome, enWork] = await Promise.all([
        read("src/App.jsx"),
        read("src/siteContent.js"),
        read("index.html"),
        read("work.html"),
        read("en/index.html"),
        read("en/work.html")
    ]);

    assert.match(app, /const targetLocale = locale === "ja" \? "en" : "ja"/);
    assert.match(app, /href=\{localePaths\[targetLocale\]\[visualPage\]\}/);
    assert.match(app, /hrefLang=\{targetLocale\}/);
    assert.match(app, /className="language-toggle"/);
    assert.match(content, /targetLanguage: "EN"/);
    assert.match(content, /targetLanguage: "JP"/);
    assert.match(content, /switchLanguage: "英語に切り替える"/);
    assert.match(content, /switchLanguage: "Switch to Japanese"/);

    for (const html of [home, work, enHome, enWork]) {
        assert.match(html, /<link rel="alternate" hreflang="ja"/);
        assert.match(html, /<link rel="alternate" hreflang="en"/);
        assert.match(html, /<link rel="alternate" hreflang="x-default"/);
    }
});

test("初回だけシステムテーマを採用し、その後は保存した選択を使う", async () => {
    const [bootstrap, app] = await Promise.all([
        read("theme-bootstrap.js"),
        read("src/App.jsx")
    ]);

    assert.match(bootstrap, /localStorage\.getItem\(storageKey\)/);
    assert.match(bootstrap, /prefers-color-scheme: light/);
    assert.match(bootstrap, /const theme = storedTheme \|\| systemTheme/);
    assert.match(bootstrap, /if \(!storedTheme\)/);
    assert.match(bootstrap, /localStorage\.setItem\(storageKey, theme\)/);
    assert.doesNotMatch(bootstrap, /addEventListener\(["']change["']/);
    assert.match(app, /const themeStorageKey = "sou-profile-theme"/);
    assert.match(app, /localStorage\.setItem\(themeStorageKey, theme\)/);

    const firstLightVisit = runThemeBootstrap(bootstrap, { prefersLight: true });
    assert.equal(firstLightVisit.theme, "light");
    assert.equal(firstLightVisit.values.get("sou-profile-theme"), "light");

    const returningDarkVisit = runThemeBootstrap(bootstrap, {
        storedTheme: "dark",
        prefersLight: true
    });
    assert.equal(returningDarkVisit.theme, "dark");
    assert.equal(returningDarkVisit.values.get("sou-profile-theme"), "dark");
});

test("ページ切り替えはナビとページを同じ方向へアニメーションする", async () => {
    const [app, styles, renderer] = await Promise.all([
        read("src/App.jsx"),
        read("src/styles.css"),
        read("src/glass/useLiquidGlass.js")
    ]);

    assert.match(app, /data-active-page=\{visualPage\}/);
    assert.match(app, /data-direction=\{pageTransition\?\.direction\}/);
    assert.match(app, /pageOrder\[targetPage\] > pageOrder\[currentPageRef\.current\]/);
    assert.match(app, /page-panel--\$\{role\}/);
    assert.match(app, /onAnimationEnd=/);
    assert.match(app, /window\.history\.pushState/);
    assert.match(app, /window\.addEventListener\("popstate"/);
    assert.match(app, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
    assert.match(app, /prefers-reduced-motion: reduce/);
    assert.match(styles, /--page-transition-duration: 420ms/);
    assert.match(styles, /page-exit-left/);
    assert.match(styles, /page-enter-right/);
    assert.match(styles, /page-exit-right/);
    assert.match(styles, /page-enter-left/);
    assert.match(styles, /\.nav-active-indicator\s*\{[\s\S]*transition: transform var\(--page-transition-duration\)/);
    assert.match(styles, /\.site-links\[data-active-page="work"\] \.nav-active-indicator\s*\{[\s\S]*translateX\(calc\(100% \+ 4px\)\)/);
    assert.match(renderer, /dataset\.transitioning === "true"/);
    assert.doesNotMatch(styles, /@view-transition/);
});

test("Workページは制作物と未完成の範囲を明記する", async () => {
    const [app, content] = await Promise.all([
        read("src/App.jsx"),
        read("src/siteContent.js")
    ]);
    const work = `${app}\n${content}`;

    assert.match(work, /ChatGPT Touch Bar/);
    assert.match(work, /Open Source/);
    assert.match(work, /https:\/\/github\.com\/sou1213\/chatgpt-touchbar/);
    assert.match(work, /MIT License/);
    assert.match(work, /<details className="work-details">/);
    assert.match(work, /続きを見る/);
    assert.match(work, /\/assets\/chatgpt-touchbar\/figma-readme-hero\.png/);
    assert.match(work, /\/assets\/chatgpt-touchbar\/safari-touch-bar\.png/);
    assert.match(work, /APIキーや有料の開発者APIは必要ありません/);
    assert.match(work, /Touch Bar搭載MacBook ProとmacOS 12以降/);
    assert.match(work, /TaskManager/);
    assert.match(work, /Apple Pencil/);
    assert.match(work, /Goodnotes/);
    assert.match(work, /シンプルさと使いやすさ/);
    assert.match(work, /App Storeにはまだ公開していません/);
    assert.doesNotMatch(work, /https:\/\/github\.com\/sou1213\/TaskManager/);
    assert.match(work, /Your Feel Of Wallpaper/);
    assert.match(work, /Work in Progress/);
    assert.match(work, /現在は開発途中です/);
    assert.match(work, /https:\/\/your-feel-of-wallpaper-q8m4x7\.pages\.dev\//);
    assert.match(work, /Source code: Private/);
});

test("ChatGPT Touch Barの画像を公開物へ含める", async () => {
    const [hero, screenshot, buildScript, app] = await Promise.all([
        stat(new URL("../assets/chatgpt-touchbar/figma-readme-hero.png", import.meta.url)),
        stat(new URL("../assets/chatgpt-touchbar/safari-touch-bar.png", import.meta.url)),
        read("scripts/build-cloudflare-pages.mjs"),
        read("src/App.jsx")
    ]);

    assert.ok(hero.size > 0);
    assert.ok(screenshot.size > 0);
    assert.match(buildScript, /"assets"/);
    assert.match(buildScript, /\{ recursive: true \}/);
    assert.match(app, /\/assets\/chatgpt-touchbar\/figma-readme-hero\.png/);
    assert.match(app, /\/assets\/chatgpt-touchbar\/safari-touch-bar\.png/);
    // html2canvas clones the whole document; even a closed details image must not be lazy in Safari.
    assert.doesNotMatch(app, /loading="lazy"/);
    assert.match(app, /src=\{touchBarImage\}[^>]*loading="eager"/);
});

test("ナビは採用したLiquid Glass設定と復旧可能なWebGL描画を使う", async () => {
    const [tokens, renderer, styles] = await Promise.all([
        read("src/glass/tokens.js"),
        read("src/glass/useLiquidGlass.js"),
        read("src/styles.css")
    ]);

    for (const expected of [
        /opacity: 0/,
        /blur: 0/,
        /saturation: 1\.15/,
        /edge: 0\.65/,
        /shine: 0\.08/,
        /shadow: 0\.15/,
        /radius: 32/,
        /refraction: 13/,
        /dispersion: 3/
    ]) {
        assert.match(tokens, expected);
    }

    assert.match(renderer, /getContext\("webgl"/);
    assert.match(renderer, /webglcontextlost/);
    assert.match(renderer, /webglcontextrestored/);
    assert.match(renderer, /powerPreference: "low-power"/);
    assert.match(renderer, /document\.documentElement\.dataset\.glassRenderer = "fallback"/);
    assert.match(styles, /--glass-radius: 32px/);
    assert.match(styles, /--glass-edge-alpha: 35\.75%/);
    assert.match(styles, /--glass-shadow-alpha: 15%/);
    assert.match(styles, /--glass-shine-alpha: 8%/);
    assert.match(styles, /prefers-reduced-transparency: reduce/);
});

test("各ページは検索とSNS共有向けの固有メタデータを持つ", async () => {
    const [home, work, enHome, enWork] = await Promise.all([
        read("index.html"),
        read("work.html"),
        read("en/index.html"),
        read("en/work.html")
    ]);

    assert.match(home, /<title>高橋壮介 \| Swift・iOSアプリ開発ポートフォリオ<\/title>/);
    assert.match(home, /<link rel="canonical" href="https:\/\/sou-profile\.pages\.dev\/">/);
    assert.match(home, /<meta property="og:title" content="高橋壮介 \| Swift・iOSアプリ開発ポートフォリオ">/);
    assert.match(home, /<meta name="twitter:card" content="summary">/);

    assert.match(work, /<title>制作実績 \| ChatGPT Touch Bar・iOS\/Webアプリ \| 高橋壮介<\/title>/);
    assert.match(work, /<link rel="canonical" href="https:\/\/sou-profile\.pages\.dev\/work">/);
    assert.match(work, /<meta property="og:title" content="制作実績 \| ChatGPT Touch Bar・iOS\/Webアプリ \| 高橋壮介">/);
    assert.match(work, /<meta name="twitter:card" content="summary">/);

    assert.match(enHome, /<title>Sosuke Takahashi \| Swift &amp; iOS Developer Portfolio<\/title>/);
    assert.match(enHome, /<link rel="canonical" href="https:\/\/sou-profile\.pages\.dev\/en\/">/);
    assert.match(enHome, /<meta property="og:locale" content="en_US">/);
    assert.match(enWork, /<title>Selected Work \| macOS, iOS &amp; Web Apps \| Sosuke Takahashi<\/title>/);
    assert.match(enWork, /<link rel="canonical" href="https:\/\/sou-profile\.pages\.dev\/en\/work">/);

    assert.notEqual(
        home.match(/<meta name="description" content="([^"]+)">/)[1],
        work.match(/<meta name="description" content="([^"]+)">/)[1]
    );
});

test("構造化データはプロフィールと制作物を正しく表す", async () => {
    const [home, work, enHome, enWork] = await Promise.all([
        read("index.html"),
        read("work.html"),
        read("en/index.html"),
        read("en/work.html")
    ]);
    const homeData = readJsonLd(home);
    const workData = readJsonLd(work);
    const enHomeData = readJsonLd(enHome);
    const enWorkData = readJsonLd(enWork);

    assert.equal(homeData["@type"], "ProfilePage");
    assert.equal(homeData.mainEntity["@type"], "Person");
    assert.equal(homeData.inLanguage, "ja");
    assert.equal(homeData.mainEntity.name, "高橋 壮介");
    assert.deepEqual(homeData.mainEntity.sameAs, [
        "https://github.com/sou1213",
        "https://x.com/hitonoyakntatsu"
    ]);

    assert.equal(workData["@type"], "CollectionPage");
    assert.equal(workData.inLanguage, "ja");
    assert.deepEqual(workData.hasPart.map((item) => item.name), [
        "ChatGPT Touch Bar",
        "TaskManager",
        "Your Feel Of Wallpaper"
    ]);

    const touchBar = workData.hasPart[0];
    assert.equal(touchBar.url, "https://github.com/sou1213/chatgpt-touchbar");
    assert.equal(touchBar.applicationCategory, "UtilitiesApplication");

    assert.equal(enHomeData.inLanguage, "en");
    assert.equal(enHomeData.mainEntity.name, "Sosuke Takahashi");
    assert.equal(enWorkData.inLanguage, "en");
    assert.deepEqual(enWorkData.hasPart.map((item) => item.name), workData.hasPart.map((item) => item.name));
});

test("robots.txtとサイトマップはCloudflareの正式URLを案内する", async () => {
    const [robots, sitemap, buildScript] = await Promise.all([
        read("robots.txt"),
        read("sitemap.xml"),
        read("scripts/build-cloudflare-pages.mjs")
    ]);

    assert.match(robots, /^User-agent: \*$/m);
    assert.match(robots, /^Allow: \/$/m);
    assert.match(robots, /^Sitemap: https:\/\/sou-profile\.pages\.dev\/sitemap\.xml$/m);
    assert.match(sitemap, /<loc>https:\/\/sou-profile\.pages\.dev\/<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/sou-profile\.pages\.dev\/work<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/sou-profile\.pages\.dev\/en\/<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/sou-profile\.pages\.dev\/en\/work<\/loc>/);
    assert.match(sitemap, /hreflang="x-default"/);
    assert.doesNotMatch(sitemap, /github\.io/);
    assert.match(buildScript, /"robots\.txt"/);
    assert.match(buildScript, /"sitemap\.xml"/);
    assert.doesNotMatch(buildScript, /"_redirects"/);
});

test("Cloudflare公開物へ基本的な防御ヘッダーを設定する", async () => {
    const headers = await read("_headers");

    assert.match(headers, /Content-Security-Policy: [^\r\n]*script-src 'self'/);
    assert.match(headers, /frame-src 'self'/);
    assert.match(headers, /style-src 'self' 'unsafe-inline'/);
    assert.match(headers, /frame-ancestors 'none'/);
    assert.match(headers, /X-Frame-Options: DENY/);
    assert.match(headers, /X-Content-Type-Options: nosniff/);
});
