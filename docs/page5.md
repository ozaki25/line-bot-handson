# 5.[応用編]メッセージに応答するサーバを作ってみる

## ゴール

- AWS Lambdaを使ってAPIを作成する
- 送信されたメッセージにオウム返しできるようにする
- 2章と同じようにメッセージに応じた返答ができるようになる

## 5-1.全体構成

- 2章の冒頭と同じ図です
- この章ではAPIサーバを作成しメッセージに応答できるようにします

![構成1](/images/5-1.png)

## 5-2.セットアップ

### Nodeのインストール

- Nodeの公式サイトからインストールしてください
    - [https://nodejs.org/ja/](https://nodejs.org/ja/)
- ターミナルで以下のコマンドを実行してバージョンが表示されればOKです

```bash
node -v
npm -v
```

### yarnのインストール

- 以下のコマンドでインストールします

```bash
npm i -g yarn
```

- 以下のコマンドを実行してバージョンが表示されればOKです

```bash
yarn -v
```

### ServerlessFrameworkのインストール

- 以下のコマンドでインストールします

```bash
npm i -g serverless
```

t- 以下のコマンドを実行してバージョンが表示されればOKです

```bash
sls -v
```

### AWSのアクセスキーの発行

- AWSにアクセスするためのキー情報を発行します
- こちらの記事の手順に従って登録してください
    - **あとでURLを記載する**

### 応答メッセージの削除

- 2章で設定した応答メッセージを無効化しておきましょう
- [LINE Official Account Manager](https://manager.line.biz/)からすべてオフにしておきます

![オフ](/images/5-6.png)

## 5-3.APIサーバの作成

- 今回はAWS Lambdaを使ってAPIを作成します
- AWS LambdaのコードはServerlessFrameworkを使って構築していきます

### プロジェクトの雛形作成

- ディレクトリを作成し移動します

```sh
mkdir line-bot-api
cd line-bot-api
```

- ServerlessFrameworkを使ってテンプレートを生成します

```sh
sls create -t aws-nodejs-ecma-script
```

- このようなファイルが生成されているはずです

```
% tree
.
├── first.js
├── package.json
├── second.js
├── serverless.yml
└── webpack.config.js
```

- 依存ライブラリをインストールします

```sh
yarn
```

- 自動生成されたファイルを手直ししていきます
- `handler.js`というファイルを作成し以下の内容を記述してください

```js
export const hello = async event => {
  return {
    statusCode: 200,
    body: 'Hello',
  };
};
```

- `serverless.yml`を修正します
    - 以下の内容に丸ごと置き換えて必要に応じて修正を加えてください

```yml
service:
  name: line-bot-api-名前 # 一意な値である必要があるので名前などを追加しておいてください
plugins:
  - serverless-webpack
provider:
  name: aws
  runtime: nodejs12.x
  region: ap-northeast-1
  # profile: xxx # AWSのアクセスキー登録で`~/.aws/credentials`に[default]以外の名前で登録した場合はここで設定します
functions:
  hello: # 関数名
    handler: handler.hello # ファイル名.エクスポート名
    # HTTPエンドポイントを作成するAPI Gatewayの設定
    events:
      - http:
          method: get
          path: hello
```

- AWSにデプロイしてみます

```sh
sls deploy
```

- うまくいくと以下のようにログにURLが表示されます

![deployログ](/images/5-2.png)

- 表示されたURLにアクセスし`Hello`と表示されればデプロイ成功です

### 応答を返すエンドポイントの作成

- Helloまで動作確認ができたのでメッセージを応答する関数を作成していきます
    - まずは送信されたメッセージをオウム返しするところまで作ってみます

#### アクセストークンの取得

- 応答メッセージを返すためにはトークンを送る必要があります
- LINEのデベロッパーコンソールからトークンを取得しておきます
    - [https://developers.line.biz/console](https://developers.line.biz/console)
- 2つ作ったチャネルのうち`Messaging API`の方を選択します

![チャネル](/images/5-3.png)

- `Messaging API設定`タブを選択します

![MessagingAPI設定](/images/5-4.png)

- 一番下までスクロールすると`チャネルアクセストークン`という項目があるので`発行`ボタンを押してトークンを生成します

![token](/images/5-5.png)

- トークンはこの後使うので控えておいてください

#### ライブラリの追加

- LINEの機能を利用するためにライブラリを追加します

```sh
yarn add @line/bot-sdk
```

#### 関数の追加

- `handler.js`に新しい関数を作成します

```js{1-33}
import { Client } from '@line/bot-sdk';

// 環境変数からトークンを取得
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;

// LINE APIのクライアントを初期化
const lineClient = new Client({ channelAccessToken });

// POST:/reply
export const reply = async event => {
  const body = JSON.parse(event.body);

  // replyToken: 応答に必要なトークン, message: 送信されたメッセージの情報
  const { replyToken, message } = body.events[0];

  // デベロッパーコンソールからのテスト打鍵の場合replyせずに返す
  if (replyToken === '00000000000000000000000000000000') {
    return { statusCode: 200 };
  }

  // 応答メッセージを送信
  await lineClient.replyMessage(replyToken, [
    {
      type: 'text',
      text: message.text, // オウム返しするので受け取ったメッセージをセット
    },
  ]);

  return {
    statusCode: 200,
    body: 'OK',
  };
};

// GET:/hello
export const hello = async event => {
  return {
    statusCode: 200,
    body: 'Hello',
  };
};
```

- `serverless.yml`に新しく追加した関数の情報を付け足します
    - 10-11行目にアクセストークンをセットします
        - **トークンをそのままGitHubにあげるなどしないように注意してください**
    - 19-24行目に新しく追加したreply関数の情報をセットします

```yml{10-11,19-24}
service:
  name: line-bot-api-名前
plugins:
  - serverless-webpack
provider:
  name: aws
  runtime: nodejs12.x
  region: ap-northeast-1
  # profile: xxx
  environment:
    CHANNEL_ACCESS_TOKEN: XXX # アクセストークンを設定する
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          method: get
          path: hello
  reply:
    handler: handler.reply
    events:
      - http:
          method: post
          path: reply
```

#### デプロイ

- ここまで修正できたらデプロイします

```sh
sls deploy
```

- ログにはURLが2つ表示されているはずです

![ログ](/images/5-7.png)

- 末尾が`reply`の方のURLを控えておいてください

### Webhook URLの登録

- APIができたのでLINEのデベロッパーコンソールにWebhook URLとして登録します
    - [https://developers.line.biz/console](https://developers.line.biz/console)
- アクセストークンを取得した時と同じ`Messaging API設定`タブを選びます
![MessagingAPI設定](/images/5-4.png)

- Webhookの項目でURLを登録し`Webhookの利用`にもチェックを入れておきます

![WebhookURL](/images/5-8.png)

- `検証`を押して成功することも確認しておきましょう
- 最後にWebhookの設定がオフになっていることがあるのでオンにしておきます

![応答メッセージ](/images/5-9.png)
![Webhookオン](/images/5-10.png)

### 動作確認

- ここまでできたらスマホでLINEアプリを開いて動作確認してみます

![オウム返し](/images/5-11.png)

- オウム返しができるようになりました！

## 5-4.メッセージに応じた返答をする

- ここまでで一連のフローはできあがりました
- あとはLamda関数のロジックを拡充していくだけです

### メッセージの内容による振り分け

- `handler.js`を修正してメッセージの内容に応じて返答を変えてみます
    - 21-41行目にロジックを追加しています
    - 47行目も修正しています

```js{21-41,47}
import { Client } from '@line/bot-sdk';

// 環境変数からトークンを取得
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;

// LINE APIのクライアントを初期化
const lineClient = new Client({ channelAccessToken });

// POST:/reply
export const reply = async event => {
  const body = JSON.parse(event.body);

  // replyToken: 応答に必要なトークン, message: 送信されたメッセージの情報
  const { replyToken, message } = body.events[0];

  // デベロッパーコンソールからのテスト打鍵の場合replyせずに返す
  if (replyToken === '00000000000000000000000000000000') {
    return { statusCode: 200 };
  }

  // 受け取ったメッセージを小文字化
  const receivedMessage = message.text.toLowerCase();

  // 受け取ったメッセージに応じて返答内容を決定
  let text = '';
  switch (receivedMessage) {
    case 'twitter':
      text = 'https://twitter.com/ozaki25rn';
      break;
    case 'qiita':
      text = 'https://qiita.com/ozaki25';
      break;
    case 'github':
      text = 'https://github.com/ozaki25';
      break;
    case 'hatena':
      text = 'https://ozaki25.hatenadiary.jp/';
      break;
    default:
      text = 'その言葉は分かりません';
  }

  // 応答メッセージを送信
  await lineClient.replyMessage(replyToken, [
    {
      type: 'text',
      text,
    },
  ]);

  return {
    statusCode: 200,
    body: 'OK',
  };
};

// GET:/hello
export const hello = async event => {
  return {
    statusCode: 200,
    body: 'Hello',
  };
};
```

### デプロイ

- 修正できたらデプロイします

```sh
sls deploy deploy
```

### 動作確認

- スマホで動作確認してみましょう

![reply](/images/5-12.png)
