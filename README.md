# retro_portfolio

レトロRPGの世界観で自己紹介を体験化した、Vite + React + TypeScript 製のインタラクティブポートフォリオサイトです。

## Overview

- ピクセルゲーム風の UI で、プロフィール、スキル、経歴、作品を表示
- ポートフォリオを「閲覧するページ」ではなく「探索するゲーム画面」として構成
- UI 演出を含みつつ、feature-first の構成で整理
- ロジックと表示を分け、テストしやすい形を意識した実装

## Tech Stack

- Vite
- React
- TypeScript
- Biome
- Vitest
- Testing Library

## Architecture

このプロジェクトは feature-first を前提に構成しています。

```text
src/
  app/                         # アプリ起動処理
  features/
    public-preview/
      model/                   # ドメインデータ、変換、純関数
      hooks/                   # 表示制御や副作用を含む hook
      ui/                      # 画面とコンポーネント
      __tests__/               # feature の公開面に対するテスト
  shared/                      # 複数 feature で再利用する共通コード
  test/                        # テスト補助
public/
  images/                      # 作品画像、演出画像、アイコン
```

### Directory Intent

- `app/`
  アプリのエントリーポイントや接続処理を配置します。
- `features/public-preview/model`
  表示用データ、純関数、計算ロジックなどを配置します。
- `features/public-preview/hooks`
  タイマーやアニメーションなど、副作用を含む制御を配置します。
- `features/public-preview/ui`
  React コンポーネントを配置します。描画とイベントバインドを中心にし、重い処理はできるだけ外に分離しています。
- `shared/`
  複数箇所で再利用する共通コードだけを配置します。

## Testing

テストは役割ごとに分けています。

### Unit Tests

対象:

- 純関数
- 計算ロジック
- データ変換
- 表示用の派生値

例:

- [playerProfile.test.ts](/Users/kyazoo/creative/retro_portfolio/src/features/public-preview/model/__tests__/playerProfile.test.ts)
- [skyLottery.test.ts](/Users/kyazoo/creative/retro_portfolio/src/features/public-preview/model/__tests__/skyLottery.test.ts)

### Integration Tests

対象:

- コンポーネント描画
- ユーザー操作
- hook と UI の連携
- 画面内の状態変化

例:

- [PortfolioPage.test.tsx](/Users/kyazoo/creative/retro_portfolio/src/features/public-preview/ui/__tests__/PortfolioPage.test.tsx)
- [PortfolioPage.logic.test.tsx](/Users/kyazoo/creative/retro_portfolio/src/features/public-preview/ui/__tests__/PortfolioPage.logic.test.tsx)
- [TrollTowerBattleProjectCard.test.tsx](/Users/kyazoo/creative/retro_portfolio/src/features/public-preview/ui/components/PastProjectsSection/__tests__/TrollTowerBattleProjectCard.test.tsx)

### Coverage

```bash
npm run test:coverage
```

ビルド・テストの生成物は root の見通しを保つため、`.artifacts/` 配下に集約しています。

## Getting Started

```bash
npm install
npm run dev
```

ローカル起動後は `http://localhost:5173` で確認できます。

## Scripts

```bash
npm run dev            # 開発サーバー起動
npm run build          # 型チェック + 本番ビルド
npm run preview        # ビルド結果の確認
npm run check          # Biome + TypeScript + テスト
npm run check:biome    # Biomeチェック
npm run check:types    # TypeScriptチェック
npm run format         # Biomeで整形
npm run test           # テスト実行
npm run test:coverage  # カバレッジ付きテスト実行
```

## Why Vite

- 起動が速く、UI 調整や演出確認の反復がしやすい
- React + TypeScript のシンプルな構成を保ちやすい
- 見た目の調整と実装を短いサイクルで進めやすい
