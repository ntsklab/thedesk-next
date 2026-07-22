# TheDesk next (fork)

[English](./README.md)

[Fedistar](https://github.com/h3poteto/fedistar)ベースのPC用Mastodo(とMisskey)クライアント。

## Fedistarとの違いは？

* TheDeskのUI（[TheDesk ~v24](https://github.com/cutls/TheDesk)ライクなUI）
  * フローティング投稿ボックス
  * カラムやアカウントごとに色分けできます
  * 柔軟かつ直感的にに横幅をリサイズできるタイムライン
* TheDeskの設定
  * タイムラインに表示する時間の形式を変更可能(絶対/相対時間)
  * アイコンのアニメーション有無の設定
  * 長い投稿の自動折りたたみと省略表示
  * 投稿後に投稿ボックスを開いたままにするかどうかの設定
  * セカンダリー投稿ボタンで投稿の表示を簡単に変更可能
* TheDeskの機能
  * Spotify NowPlaying
  * Apple Music/iTunes NowPlaying(macOS)
  * タイムライン読み上げ
  * メディアだけのタイムライン
  * タイムラインの縦積み
* その他
  * Misskeyに部分的に対応


## TheDesk を入手する

[GitHub Release page](https://github.com/ntsklab/thedesk-next/releases) | [Upstream](https://github.com/cutls/thedesk-next)

### システム設定

システム設定はAppData(macOS: Application Support)フォルダ内のconfig.jsonで編集できます。このフォルダへは設定画面から簡単に飛ぶことができます。

`hardwareAcceleration`: ハードウェアアクセラレーション(default: true)  
`allowDoH`: DNS over HTTPS (default: true)
## 開発

```
pnpm install
npx electron-rebuild
pnpm run dev
```

`electron-builder` の制限により、本番ビルドを起動するには `shamefully-hoist` オプションを使用する必要があります。(`.npmrc`に記載)

## ビルド

```
pnpm install
npx electron-rebuild

pnpm run build
pnpm run pack:win # Windows(able to run on Windows)
pnpm run pack:linux # Linux(able to run on any OS)
pnpm run pack:mac # macOS(able to run on macOS)

pnpm run pack:appx # Windows Microsoft Store
pnpm run pack:mas # macOS App Store

```

### Notarize(macOS)

デフォルトでは公証は行われませんが、あなたの証明書で公証したい場合は`.env.sample`を編集して`.env`にリネームしてください。


## お知らせ

この製品にはLLM(Cursor)で作成された成果物が含まれています。
