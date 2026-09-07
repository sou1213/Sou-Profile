import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const readJsonLd = (html) => {
    const match = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
    assert.ok(match, "JSON-LDが存在すること");
    return JSON.parse(match[1]);
};

test("HomeとWorkで共通ナビゲーションを提供する", async () => {
    const [home, work] = await Promise.all([read("index.html"), read("work.html")]);

    for (const html of [home, work]) {
        assert.match(html, /<nav class="site-nav" aria-label="メインナビゲーション">/);
        assert.match(html, /href="\.\/index\.html"/);
        assert.match(html, /href="\.\/work\.html"/);
        assert.match(html, /href="\.\/styles\.css"/);
        assert.match(html, /src="\.\/theme\.js" defer/);
    }

    assert.match(home, /href="\.\/index\.html" aria-current="page"/);
    assert.match(work, /href="\.\/work\.html" aria-current="page"/);
});

test("Workページは制作物と未完成の範囲を明記する", async () => {
    const work = await read("work.html");

    assert.match(work, /ChatGPT Touch Bar/);
    assert.match(work, /Open Source/);
    assert.match(work, /https:\/\/github\.com\/sou1213\/chatgpt-touchbar/);
    assert.match(work, /MIT License/);
    assert.match(work, /<details class="work-details">/);
    assert.match(work, /続きを見る/);
    assert.match(work, /\.\/assets\/chatgpt-touchbar\/figma-readme-hero\.png/);
    assert.match(work, /\.\/assets\/chatgpt-touchbar\/safari-touch-bar\.png/);
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
    const [hero, screenshot, buildScript] = await Promise.all([
        stat(new URL("../assets/chatgpt-touchbar/figma-readme-hero.png", import.meta.url)),
        stat(new URL("../assets/chatgpt-touchbar/safari-touch-bar.png", import.meta.url)),
        read("scripts/build-cloudflare-pages.mjs")
    ]);

    assert.ok(hero.size > 0);
    assert.ok(screenshot.size > 0);
    assert.match(buildScript, /"assets"/);
    assert.match(buildScript, /\{ recursive: true \}/);
});

test("各ページは検索とSNS共有向けの固有メタデータを持つ", async () => {
    const [home, work] = await Promise.all([read("index.html"), read("work.html")]);

    assert.match(home, /<title>高橋壮介 \| Swift・iOSアプリ開発ポートフォリオ<\/title>/);
    assert.match(home, /<link rel="canonical" href="https:\/\/sou-profile\.pages\.dev\/">/);
    assert.match(home, /<meta property="og:title" content="高橋壮介 \| Swift・iOSアプリ開発ポートフォリオ">/);
    assert.match(home, /<meta name="twitter:card" content="summary">/);

    assert.match(work, /<title>制作実績 \| ChatGPT Touch Bar・iOS\/Webアプリ \| 高橋壮介<\/title>/);
    assert.match(work, /<link rel="canonical" href="https:\/\/sou-profile\.pages\.dev\/work">/);
    assert.match(work, /<meta property="og:title" content="制作実績 \| ChatGPT Touch Bar・iOS\/Webアプリ \| 高橋壮介">/);
    assert.match(work, /<meta name="twitter:card" content="summary">/);

    assert.notEqual(
        home.match(/<meta name="description" content="([^"]+)">/)[1],
        work.match(/<meta name="description" content="([^"]+)">/)[1]
    );
});

test("構造化データはプロフィールと制作物を正しく表す", async () => {
    const [home, work] = await Promise.all([read("index.html"), read("work.html")]);
    const homeData = readJsonLd(home);
    const workData = readJsonLd(work);

    assert.equal(homeData["@type"], "ProfilePage");
    assert.equal(homeData.mainEntity["@type"], "Person");
    assert.equal(homeData.mainEntity.name, "高橋 壮介");
    assert.deepEqual(homeData.mainEntity.sameAs, [
        "https://github.com/sou1213",
        "https://x.com/hitonoyakntatsu"
    ]);

    assert.equal(workData["@type"], "CollectionPage");
    assert.deepEqual(workData.hasPart.map((item) => item.name), [
        "ChatGPT Touch Bar",
        "TaskManager",
        "Your Feel Of Wallpaper"
    ]);

    const touchBar = workData.hasPart[0];
    assert.equal(touchBar.url, "https://github.com/sou1213/chatgpt-touchbar");
    assert.equal(touchBar.applicationCategory, "UtilitiesApplication");
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
    assert.doesNotMatch(sitemap, /github\.io/);
    assert.match(buildScript, /"robots\.txt"/);
    assert.match(buildScript, /"sitemap\.xml"/);
});

test("Cloudflare公開物へ基本的な防御ヘッダーを設定する", async () => {
    const headers = await read("_headers");

    assert.match(headers, /Content-Security-Policy: [^\r\n]*script-src 'self'/);
    assert.match(headers, /frame-ancestors 'none'/);
    assert.match(headers, /X-Frame-Options: DENY/);
    assert.match(headers, /X-Content-Type-Options: nosniff/);
});
