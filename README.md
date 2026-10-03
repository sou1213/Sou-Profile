# Sou-Profile

現在取り組んでいること、制作物をまとめるReact製のポートフォリオサイトです。ナビゲーションには、スクロールする文章や画像を屈折させるWebGLのLiquid Glass表現を使用しています。

## 公開先

- Cloudflare Pages: https://sou-profile.pages.dev/
- GitHub Pages: https://sou1213.github.io/Sou-Profile/

## ページ

- `/`: プロフィールと現在の学習テーマ
- `/work`: 制作中・公開中のプロジェクト
- `/blog`: 記事一覧（「初めてのハッカソンに参加してきた！」を掲載）
- `/blog/first-hackathon`: ハッカソン参加記の全文

画面上部の共通ナビゲーションからHome・Work・Blogを移動できます。タブの並び順に合わせてページと選択表示がスライドし、ブラウザの戻る／進むにも対応しています。初回はシステムの配色設定を採用し、その後のダーク／ライトテーマの選択は全ページで共有・保存されます。各ページには `/en/` 以下の英語版があり、言語を切り替えても現在のページを保ちます。

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
