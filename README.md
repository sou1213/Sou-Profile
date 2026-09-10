# Sou-Profile

現在取り組んでいること、制作物をまとめるReact製のポートフォリオサイトです。ナビゲーションには、スクロールする文章や画像を屈折させるWebGLのLiquid Glass表現を使用しています。

## 公開先

- Cloudflare Pages: https://sou-profile.pages.dev/
- GitHub Pages: https://sou1213.github.io/Sou-Profile/

## ページ

- `/`: プロフィールと現在の学習テーマ
- `/work`: 制作中・公開中のプロジェクト

画面上部の共通ナビゲーションからHomeとWorkを移動できます。初回はシステムの配色設定を採用し、その後のダーク／ライトテーマの選択は両ページで共有・保存されます。

## 開発

```sh
npm install
npm run dev
```

```sh
npm test
npm run build
```

Cloudflare Pages向けの公開物は `dist/cloudflare-pages` に生成されます。
