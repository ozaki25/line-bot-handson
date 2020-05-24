# 4.LIFFアプリを埋め込む

## ゴール

- WebページをLIFFアプリとして登録できること
- トーク画面でLIFFアプリを表示できること

## 4-1.LIFFアプリとは

- LIFFアプリはブラウザ上でアクセス可能なWebページをLINEのトーク画面に埋め込める機能です
- 埋め込みWebページでLIFF SDKを読み込むことでLINEのユーザ情報にアクセスできるのが特徴です
- 通常のWebページと同じように自由度高く作れるため、トーク画面から離脱せずによりインタラクティブな機能を提供できます
- LIFFアプリをトーク画面に表示させるにはトーク画面内でLIFFアプリのURLにアクセスさせる必要があります

![LIFFアプリの例](/images/4-1.png)

## 4-2.Webページの作成

- まずは埋め込むWebページを作成します
- Webページは公開されている必要があるため今回はGitHubのホスティング機能を使います

### GitHubのユーザ登録

- GitHubのアカウントを持っていない場合は新規登録してください
    - [https://github.com/join](https://github.com/join)

### リポジトリの作成

- 以下のURLから新しいリポジトリを作成します
    - [https://github.com/new](https://github.com/new)
- 任意のリポジトリ名をセットして作成します

![リポジトリ作成](/images/4-2.png)

### ファイルの作成

- リポジトリができたら`creating a new file`から新しいファイルを作成します

![ファイル作成](/images/4-3.png)

- ファイル名は`index.html`で内容は以下のものをコピペしてください

![html1](/images/4-4.png)

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LIFFサンプル</title>
    <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
    />
    <script charset="utf-8" src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
  </head>
  <body>
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
  </body>
</html>
```

- コピペできたら`commit new file`を押して保存します

![html2](/images/4-5.png)

### Webページの公開

- GitHub PagesというWebページを公開する機能の設定をします
- `Settings`タブを選択します

![settings](/images/4-6.png)

- 下の方にスクロールしていくとGitHub Pagesの項目があります
- ボタンを押して`master branch`を選択してください

![github pages settings](/images/4-7.png)

- 設定が完了すると画面上部に以下のようなメッセージが表示されます

![success](/images/4-8.png)

### 公開されたページの確認

- `Code`タブに戻ると`environment`というメニューが追加されているのでそれを選択します

![environment tab](/images/4-9.png)

- このページにはGitHub Pagesへのデプロイ履歴が表示されます
- `View devloyment`を押すと公開されたページにアクセスできます

![environment](/images/4-10.png)

- このようにリンク集のページが表示されているはずです
- このページのURLは後の工程で使うため控えておいてください

![handson links](/images/4-11.png)

:::tip

- GitHub Pagesで公開したWebページのURLは以下のような命名規則になります
    - https://アカウント名.github.io/リポジトリ名/
- キャプチャで紹介しているサンプルだとこのような感じですね
    - https://ozaki25.github.io/line-bot-handson-liff-sample/
:::

## 4-3.LIFFアプリの設定

- 公開したWebページをLIFFアプリとして登録していきます
- LINEのデベロッパーコンソールから作業をします
    - [https://developers.line.biz/console/](https://developers.line.biz/console/)

### チャネルの作成

- 1章で作成したプロバイダーを選択し新規チャネルを作成します

![チャネル作成1](/images/4-12.png)

- チャネルの種類は`LINEログイン`を選択します

![チャネル作成2](/images/4-13.png)

- 必須項目に任意の値を設定して作成してください
- アプリタイプは特に影響ないのでどちらにチェックしても構いません

![チャネル作成3](/images/4-14.png)

### LIFFアプリの登録

- `LIFF`タブを設定し`追加`から登録していきます

![LIFF登録1](/images/4-15.png)

- 必要事項をそれぞれ入力します

![LIFF登録2](/images/4-16.png)
![LIFF登録3](/images/4-17.png)

- 完了するとURLが発行されます
    - 後で使うので控えておいてください

![LIFF登録完了](/images/4-18.png)

## 4-3.LIFFアプリにアクセスする

- LIFFアプリにアクセスするためにはトーク画面でLIFFアプリのURLにアクセスする必要があります
- 前節で発行したLIFFアプリのURLをトーク画面に送信しアクセスしてみましょう
    - スマホからLINEのデベロッパーコンソールにアクセスしてコピペすると楽かも
        - [https://developers.line.biz/console/](https://developers.line.biz/console/)

![LIFFアクセス1](/images/4-19.png)

- 初回アクセス時は許可が求められます

![LIFFアクセス2](/images/4-20.png)

- WebページをLIFFアプリとしてトーク画面に埋め込むことができました

![LIFFアクセス3](/images/4-21.png)

## 4-4.[任意]リッチメニューからLIFFアプリを起動してみる

- 実際にサービスとして提供する場合はユーザにLIFFアプリのURLを投稿してもらうわけにはいきません
- なので3章で学んだリッチメニューを活用してLIFFアプリを起動できるようにします
- [LINE Official Account Manager](https://manager.line.biz/)からリッチメニューを更新しましょう

![リッチメニュー作成1](/images/4-22.png)

- 現在設定しているリッチメニューを`編集`から`ステータス`をオフに更新してから新しく作成しましょう

![リッチメニュー作成2](/images/4-23.png)

- タップ時のアクションでLIFFアプリのURLをセットしておきます
- 登録できたらスマホでLINEアプリを開いて動作確認してみましょう

![LIFFアプリ起動](/images/4-24.gif)

