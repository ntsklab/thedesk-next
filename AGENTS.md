# AGENTS.md

このリポジトリで作業する際の前提知識。opencoe などの AI エージェント向け。

## 概要とフォーク関係

- 本リポジトリは **Hollo サーバ向けに最適化した TheDesk next のフォーク**（`thedesk-next-hl`）。
- フォーク元（upstream）: **https://github.com/cutls/thedesk-next**
- さらにその upstream は Fedistar からのフォーク。
- `origin` リモートは **このフォーク自身**（`ntsklab/thedesk-next`）。upstream は remote 登録されていないため、必要な時は毎回 URL 指定で fetch する。

```bash
git fetch https://github.com/cutls/thedesk-next.git main
git diff FETCH_HEAD   # 差分確認
git merge FETCH_HEAD  # 取り込み（コンフリクトは下記のフォーク独自部分に集中）
```

## フォーク独自の変更点（upstream との差分）

upstream を merge する際は以下を上書きしないよう注意。逆に「元に戻したい」場合はここが該当箇所。

### 1. フォーク識別情報
- `package.json`: `name: thedesk-next-hl`, `version: 25.4.0-hollo3`, `author: ntsklab`, `homepage: github.com/ntsklab/thedesk-next`
- `electron-builder.json`: `appId: next-hl.top.thedesk`, Linux ターゲットに `AppImage` 追加、`maintainer: ntsklab`
- `README.md` / `README.ja.md`: フォーク案内 + Hollo 説明を冒頭に追記

### 2. Hollo 対応（このフォークの主目的）
- `patches/@cutls+megalodon+7.2.4.patch` + `scripts/apply-patches.sh`
  - `postinstall` で megalodon に Hollo の `emoji_reaction` サポートをパッチ適用する。
  - `@cutls/megalodon` のバージョンを上げる場合は、このパッチのリベースが必須。
- `renderer/utils/storage.ts`
  - `checkIsHollo()` で `/nodeinfo/2.1` を叩き `software.name === 'hollo'` を検出。
  - Hollo サーバに対して `emoji_reactions` / `quote_support` を有効化。
- `renderer/components/timelines/notification/Reaction.tsx`
  - リアクション絵文字の描画修正（`dangerouslySetInnerHTML` をやめ flex レイアウト化）。

### 3. 自動アップデート無効化
- upstream は `thedesk.top` の更新サーバから tar を落とす仕組み。このフォークは GitHub Releases 配布のため無効化済み。
- `electron-src/utils/ipcMainWindow.ts`: `fetchNewVersion` 削除、`ipcMain.on('fetch')` は no-op。
- `renderer/components/Update.tsx`: 更新チェック/フロントエンド更新ロジックを削除。
- **再び有効化しないこと**（`thedesk.top` を指したまま）。

### 4. Linux IME 対策
- `electron-src/index.ts`: Linux で `app.commandLine.appendSwitch('ozone-platform', 'x11')` を実行（ネイティブ Wayland の IME が不安定なため）。

### 5. OAuth ブラウザフォールバック
- `renderer/pages/redirect.tsx`: `window.electronAPI` が無い（ブラウザ実行）場合は OAuth コードを `localStorage.pendingOAuthCode` に保存。

### 6. ビルド / CI
- `.github/workflows/build-linux.yml`: tag push（`v*`）時にビルドして draft release を `gh` で作成（zip/deb/AppImage）。upstream の release イベント方式から書き換え済み。
- `.github/workflows/build-windows*.yml` → `*.yml.bup` にリネームして無効化。
- `package.json` の `pnpm.onlyBuiltDependencies`: `@parcel/watcher`, `electron`, `electron-native-auth`, `electron-winstaller`（pnpm v10 のビルドスクリプト許可）。

### 7. その他 UI / 修正
- `renderer/components/Navigator.tsx`: `TheDeskMobile` ウィジェットを削除。
- `renderer/components/timelines/Timeline.tsx`: `Virtuoso` に `computeItemKey` を追加（TL 更新で絵文字ピッカー/CW が閉じる不具合の修正）。

## 依存関係に関する注意

- `dependencies` / `devDependencies` の内容・バージョン（`react`/`react-dom` の `18.2.0` 固定、`@cutls/megalodon` の `7.2.4` 固定、`resolutions` の両固定を含む）は**すべて upstream 由来**。このフォークは独自にバージョンを固定していない。
- バージョン追従は upstream に合わせる方針。upstream が上げたら、merge で取り込む（勝手に本フォークだけで上げない）。
- 唯一の例外は megalodon パッチ: upstream 側で `@cutls/megalodon` の固定バージョンが上がった場合、新しい実装を確認し、`patches/@cutls+megalodon+7.2.4.patch` を作り直す必要がある（単純リベースで済むとは限らない）。
- `pnpm-lock.yaml` は `pnpm install` で再生成される。`package.json` を変えたら lock も一緒にコミットすること。
- `renderer/thirdparty.js` は生成物（`npm run thirdparty` / `build` で再生成）。手で編集しない。

## 開発コマンド

- `pnpm install` — 依存導入 + `postinstall` で megalodon パッチ適用
- `pnpm dev` — 開発起動（electron + next dev）
- `pnpm type-check` — 型チェック（renderer + electron-src）
- `pnpm lint:fix` — biome で lint/format
- `pnpm build` — 本番ビルド
