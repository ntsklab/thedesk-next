---
name: release-hollo
description: バージョンの -holloN サフィックスを bump し、v* タグを作成して push する。release / リリース / バージョン bump / タグ作成 / push / hollo バージョン上げ などの指示で使う。
---

# Release (Hollo version bump + tag + push)

このフォークのリリース手順を実行する。ユーザーから「リリースして」「バージョン上げて」「タグ打って push して」などと依頼されたときに使う。

## 前提

- バージョンは `package.json` の `version` フィールドのみが正（例: `25.4.0-hollo2`）。
- タグ名は `v` + version（例: `v25.4.0-hollo2`）。既存タグ: `git tag -l` で確認できる。
- `v*` タグを push すると `.github/workflows/build-linux.yml` が走り、`gh release create` で draft release（zip/deb/AppImage）が作られる。
- このフォークは自動アップデートを無効化して GitHub Releases 配布にしているため、リリース＝タグ push が本体。

## 手順

1. **現在のバージョンを確認**
   ```bash
   grep '"version"' package.json
   ```

2. **次のバージョンを決める**
   - `-holloN` の N を +1 する（例: `25.4.0-hollo2` → `25.4.0-hollo3`）。
   - `-hollo` サフィックスが無い場合は `-hollo1` を付ける。
   - タグ名は `v` + そのバージョン（例: `v25.4.0-hollo3`）。
   - 既存タグと衝突しないか `git tag -l "v*"` で確認。

3. **package.json を更新**
   `package.json` の `version` を新しい値に書き換える（行は1つ）。

4. **他の参照を更新**
   旧バージョン文字列を grep して、`AGENTS.md` などにも旧バージョンが書かれていたら合わせて更新する（`node_modules` と `pnpm-lock.yaml` は対象外）。
   ```bash
   grep -rn "25.4.0-hollo2" --include="*.json" --include="*.md" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v pnpm-lock
   ```

5. **コミット（該当ファイルのみステージ）**
   ```bash
   git add package.json
   # AGENTS.md を更新した場合:
   git add AGENTS.md
   git commit -m "bump version to <new-version>"
   ```
   - `pnpm-lock.yaml` など無関係な変更は絶対に混ぜない（`git status` で確認）。

6. **タグ作成**
   ```bash
   git tag "v<new-version>"
   ```

7. **push（コミット + タグ）**
   ```bash
   git push origin main
   git push origin "v<new-version>"
   ```

## 注意

- タグはコミットより先に作らない（タグは bump コミットを指すこと）。
- タグ push 後に CI が draft release を作成するので、ユーザーが GitHub 上で確認・publish する。
- 間違って作ったローカルタグは `git tag -d v<version>` で消せる。remote は `git push origin :v<version>`。
