# Guiter

ギター指板をインタラクティブに確認できる学習用 Web アプリです。  
ルート音を基準に、音名表示、度数表示、スケール、コード、CAGED を切り替えて確認できます。

## Features

- 6弦 x 15フレットのギター指板表示
- ルート音クリックによるリアルタイム切り替え
- 音名表示 / 度数表示の切り替え
- 度数ごとの表示オン / オフ
- 表示中オーバーレイに応じた度数フィルター
- スケール表示
  - メジャー
  - ナチュラルマイナー
  - メジャーペンタ
  - マイナーペンタ
  - ブルース
  - ハーモニックマイナー
  - メロディックマイナー
  - Ionian / Dorian / Phrygian / Lydian / Mixolydian / Aeolian / Locrian
- コード表示
  - コードフォーム
  - パワーコード
  - トライアド
  - ダイアトニック
- CAGED フォーム表示
- シャープ / フラット表記切り替え
- ライト / ダークテーマ切り替え
- 日本語 / 英語の多言語対応
- 設定の localStorage 永続化
  - テーマ
  - 臨時記号
  - 言語

## Tech Stack

- Bun
- React
- TypeScript
- Vite 8 + Vite Plus
- Tailwind CSS
- Vitest
- Testing Library
- Cloudflare Pages
- Wrangler
- i18next
- react-i18next

## Setup

```bash
bun install
```

## Development

```bash
bun run dev
```

ローカル開発サーバーを起動します。

## Scripts

```bash
bun run dev
bun run build
bun run preview
bun run lint
bun run fmt
bun run test
bun run coverage
```

## Testing

```bash
bun run test
```

カバレッジを確認する場合:

```bash
bun run coverage
```

## Deploy

```bash
bun run deploy
```

`dist/` を Cloudflare Pages にデプロイします。
