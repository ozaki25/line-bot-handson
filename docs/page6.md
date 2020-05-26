# 6.[応用編]LIFFアプリを埋め込む

- 4章ではプレーンなHTMLを作成してLIFFアプリとして埋め込みました
- ですがより複雑なことをやろうとするとReactなどのライブラリを使ったほうができることは増えてきます
- この章ではReactを使ったLIFFアプリの作り方を紹介します

## ゴール

- Reactを使ってLIFFアプリを作成できること
- LIFFアプリでLINEのユーザ情報にアクセスできること

## 6-1.Reactアプリの雛形作成

- まずは雛形を生成するためのライブラリをインストールします

```sh
npm install -g snowpack@next
```

- Reactプロジェクトを生成します

```sh
npx create-snowpack-app line-bot-handson-liff-react --template @snowpack/app-template-react --use-yarn
```

- 生成できたらプロジェクトに移動しておきます

```sh
cd line-bot-handson-liff-react
```

- 以下のようなファイルが生成されました

```
% tree -I node_modules
.
├── LICENSE
├── README.md
├── babel.config.json
├── jest.config.js
├── jest.setup.js
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── robots.txt
├── snowpack.config.json
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── App.test.jsx
│   ├── index.css
│   ├── index.jsx
│   └── logo.svg
└── yarn.lock
```

## 6-2.LIFF SDKのセットアップ

### LIFF IDの確認

- コードを書く前に自分のLIFFアプリのIDを確認しておきます
    - [https://developers.line.biz/console](https://developers.line.biz/console)
- LIFFのURLの後ろの部分がLIFF IDです

![LIFF ID](/images/6-1.png)

### 実装の追加

- LIFF SDKを読み込むようにしていきます
- `public/index.html`を修正します
    - 14行目にLIFF SDKの読み込み処理を追加しています

```html{2,8,14}
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Web site created using create-snowpack-app" />
    <title>LIFF App</title>
  </head>
  <body>
    <div id="root"></div>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <script type="module" src="/_dist_/index.js"></script>
    <script src="https://static.line-scdn.net/liff/edge/2.1/sdk.js"></script>
  </body>
</html>
```

- `src/lib/liff.js`を作成し以下の内容を記述してください

```js
export const liff = window.liff;
```

- LIFFを適用していきます
- `src/App.jsx`を修正してください
    - 丸ごと置き換えてしまってください
    - `liffId`は自分のIDをセットしてください

```jsx
import React from 'react';
import useLiff from './hooks/useLiff';

// LIFF IDを設定
const liffId = '1111111111-XXXXXXXX';

function App() {
  const { loading, error } = useLiff({ liffId });

  if (loading) return <p>...loading</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1>Hello LIFF</h1>
    </div>
  );
}

export default App;
```

- 最後にLIFFのAPIを呼び出すファイルを作成します
- `src/hooks/useLiff.js`を作成し以下の内容を記述してください

```jsx
import { useState, useEffect } from 'react';
import { liff } from '../lib/liff';

function useLiff({ liffId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initLiff = async ({ liffId }) => {
    setLoading(true);
    try {
      // LIFF APIのinitを呼び出して初期化
      await liff.init({ liffId });
      if (liff.isLoggedIn()) {
        console.log('logged in!');
        alert('success liff init');
      } else {
        console.log('not logged in');
        liff.login();
      }
    } catch (error) {
      alert({ error });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // useLiff関数の初期化時に実行される
  useEffect(() => {
    initLiff({ liffId });
  }, [liffId]);

  return { loading, error };
}

export default useLiff;
```

### デプロイ

- まだ処理は入れていませんがこの段階で一度デプロイしてしまいましょう
- [Netlify](https://www.netlify.com/)のアカウントを持っていない人は作成してください
    - [https://app.netlify.com/signup](https://app.netlify.com/signup)
    - GitHubのアカウント連携で登録すると楽です
- Netlify CLIをインストールします

```sh
npm i -g netlify-cli
```

- コマンドラインでNetlifyにログインします

```sh
netlify login
```

- 実行するとブラウザが立ち上がるので`Authorize`を選択してください
- 最後に`line-bot-handson-liff-react`ディレクトリで以下のコマンドを実行するとデプロイ完了です

```sh
yarn build
netlify deploy --prod --dir=build
```

- いくつか尋ねられますがすべてそのままエンターでOKです
- 完了するとログの一番下にURLが表示されます
    - この後使うのでメモしておいてください

![Netlify deploy](/images/6-2.png)

### LIFFアプリとして登録

- 最後にデプロイしたページをLIFFアプリとして登録します
- LINEのデベロッパーコンソールから設定します
    - [https://developers.line.biz/console](https://developers.line.biz/console)
- 4章で登録したLIFFアプリを編集します

![LIFF](/images/6-3.png)

- エンドポイントURLを先程デプロイしたURLに変更しましょう

![LIFFエンドポイント](/images/6-4.png)

### 動作確認

- スマホでアクセスして動きを見てみます

![success](/images/6-5.png)

- Succesのアラートが出れば正常にLIFFアプリとして読み込まれてるということです

## 6-3.LINEのユーザ情報の取得

- LIFFの機能を使ってLINEのユーザ情報にアクセスしてみます
- `src/hooks/useLiff.js`を修正します

```js{7-8,29-41,47-48}
import { useState, useEffect } from 'react';
import { liff } from '../lib/liff';

function useLiff({ liffId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // ユーザ情報を格納するstateを追加
  const [profile, setProfile] = useState(null);

  const initLiff = async ({ liffId }) => {
    setLoading(true);
    try {
      // LIFF APIのinitを呼び出して初期化
      await liff.init({ liffId });
      if (liff.isLoggedIn()) {
        console.log('logged in!');
      } else {
        console.log('not logged in');
        liff.login();
      }
    } catch (error) {
      alert({ error });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // ユーザ情報を取得する関数を追加
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // LIFF APIのgetProfileを実行し結果をセット
      setProfile(await liff.getProfile());
    } catch (error) {
      console.log({ error });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initLiff({ liffId });
  }, [liffId]);

  // fetchProfileとprofileを追加
  return { loading, error, fetchProfile, profile };
}

export default useLiff;
```

- `src/App.jsx`を修正して取得した情報を画面に出すようにします

```jsx{8-9,17-32}
import React from 'react';
import useLiff from './hooks/useLiff';

// 自身のLIFF IDを設定
const liffId = '1234567890-abcedfgh';

function App() {
  // profileとfetchProfileを追加
  const { loading, error, profile, fetchProfile } = useLiff({ liffId });

  if (loading) return <p>...loading</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1>Hello LIFF</h1>
      {/* 追加 */}
      <section>
        {/* ボタンをクリックしたらfetchProfileを実行 */}
        <button onClick={() => fetchProfile()}>Get Profile</button>
        {/* 取得したProfileを表示 */}
        {profile && (
          <div>
            <p>UserID: {profile.userId}</p>
            <p>DisplayName: {profile.displayName}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
```

- ビルドしてデプロイしましょう

```sh
yarn build
netlify deploy --prod --dir=build
```

- スマホからアクセスするとLINEのユーザ名が取得できています
    - ID、名前のほかはプロフィール画像とステータスメッセージを取得できます

![profile](/images/6-6.png)

## 6-4.リンク集も表示するようにする

- 最後に4章と同じ内容も表示するようにしておきます
- `src/App.jsx`を修正します
    - return文を修正しています

```jsx{16-43}
import React from 'react';
import useLiff from './hooks/useLiff';

// 自身のLIFF IDを設定
const liffId = '1234567890-abcedfgh';

function App() {
  const { loading, error, profile, fetchProfile } = useLiff({ liffId });

  if (loading) return <p>...loading</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1>Hello LIFF</h1>
      <section>
        <button onClick={() => fetchProfile()}>Get Profile</button>
        {profile && <p>こんにちは {profile.displayName}さん</p>}
      </section>
      <h2>ハンズオン資料</h2>
      <ul>
        <li>
          <a href="https://firebase-handson.ozaki25.now.sh/" target="_blank">
            Firebase Authenticationハンズオン
          </a>
        </li>
        <li>
          <a href="https://graphql-handson.ozaki25.now.sh/" target="_blank">
            GraphQLハンズオン
          </a>
        </li>
        <li>
          <a href="https://jamstack-handson.ozaki25.now.sh/" target="_blank">
            Jamstackハンズオン
          </a>
        </li>
        <li>
          <a href="https://line-bot-handson.ozaki25.now.sh/" target="_blank">
            LINE Botハンズオン
          </a>
        </li>
      </ul>
    </div>
  );
}

export default App;
```

- CSSを適用するために`public/index.html`に二行追加します

```html{9-10}
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Web site created using create-snowpack-app" />
    <title>LIFF App</title>
    <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css" />
  </head>
  <body>
    <div id="root"></div>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <script type="module" src="/_dist_/index.js"></script>
    <script src="https://static.line-scdn.net/liff/edge/2.1/sdk.js"></script>
  </body>
</html>
```

- ビルドしてデプロイしましょう

```sh
yarn build
netlify deploy --prod --dir=build
```

- スマホからアクセスすると4章と同じリンク集も表示されています

![links](/images/6-7.png)

## 参考記事

- この章の内容は以下の記事がベースになっていますので合わせて読んでみてください
    - [【LINE】LIFFアプリを試してみる~セットアップまで~](https://qiita.com/ozaki25/items/5b3aedb80ab7c07618d2)
    - [【LINE】LIFFアプリを試してみる~ユーザ情報の取得とトークへの送信~](https://qiita.com/ozaki25/items/63b9dd5e3bc2f9224b3e)
    - [【LINE】LIFFアプリを試してみる~Webからトークにメッセージを送信する~](https://qiita.com/ozaki25/items/cc4c17cc25a0bf25f964)