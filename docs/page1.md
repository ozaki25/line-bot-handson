# 1.LINE公式アカウントを作る

## ゴール

- LINE公式アカウントを作成して友だち登録できること

## 1-1.アカウントの登録

### LINEアカウントの登録

- スマホでLINEアプリをインストールしてアカウントを作成してください
    - [https://line.me/](https://line.me/)
- すでにアカウントを持っている人は次へ進んでください

### LINEデベロッパーアカウントの登録

- LINEデベロッパーアカウントを登録してログインしてください
    - [https://developers.line.biz/console/](https://developers.line.biz/console/)

## 1-2.LINE公式アカウントの作成

- LINEデベロッパーコンソールで作業を進めます
    - [https://developers.line.biz/console/](https://developers.line.biz/console/)

### プロバイダーの作成

- 新しいプロバイダーを作成します
    - プロバイダーは公式アカウントの提供元として表示される名前です

![プロバイダー](/line-bot-handson/images/1-1.png)

::: warning
プロバイダー名には`LINE`の文字列を含むことができないので注意
:::

### チャネルの作成

- チャネルを作成することで公式アカウントが作成されます
- MessagingAPIを選択してチャネルを作成していきます

![チャネル1](/line-bot-handson/images/1-2.png)

- 必要事項を入力していきます

![チャネル2](/line-bot-handson/images/1-3.png)
![チャネル3](/line-bot-handson/images/1-4.png)
![チャネル4](/line-bot-handson/images/1-5.png)

- これで公式アカウントが作成されました

## 1-3.友だち登録する

### 友だち登録

- チャネルが作成できると`Messaging API設定`タブでLINE IDとQRコードを確認できます

![QR](/line-bot-handson/images/1-6.png)

- LINEアプリでQRコードを読み取るかID検索すると友だちに追加することができます

![友だち登録](/line-bot-handson/images/1-7.png)

- 友だち登録が完了したらこの章の内容は終了です

![公式アカウント](/line-bot-handson/images/1-8.png)
