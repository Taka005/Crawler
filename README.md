# Webクローラー
## 使い方
- `npm i`を実行してパッケージをインストール
- `npx ts-node crawler/index.ts -u https://google.com`を実行してクロールを開始(ログが止まるまで待つ)
- `npx ts-node server/index.ts -p 3000`でWebサーバーを起動してクロールされた内容を閲覧可能

## 設定ファイル
- crawlLimit: 一度にクロールする数
- crawlInterval: 次のクロールまでの間隔(ミリ秒)
- waitTime: アクセス後の遅延(ミリ秒)
- isOnlySameDomain: 同じドメインのみをクロールするかどうか(Falseに設定してもセカンドレベルドメインが同じサイトしかクロールされません)
- isOverWrite: 既にクロール済みのページをクロールするかどうか
- userAgent: アクセス時のユーザーエージェント(任意)
- isdebug: デバッグモードかどうか