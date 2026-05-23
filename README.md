# 20 AI Concepts - 図解で学ぶAIの重要コンセプト

AIの基礎原理から大規模言語モデル（LLM）の挙動、モデルの改善手法、そして実践的なAIシステム構築パターンまで、現代のIT業界やビジネスで飛び交う20個の重要AI概念を、図解・初心者向け補足・具体例・注意点を含めて詳しく解説する日本語静的Webサイトプロジェクトです。

---

## 📁 ファイル構成

```
.
├── index.html                  # サイトのメイン構造（20コンセプト収録）
├── style.css                   # 全体のスタイリングシステム（デザイン変数・レスポンシブ）
├── script.js                   # ナビゲーションおよびイベント制御（PC・スマホ切り替え）
├── README.md                   # このドキュメント
└── 20_AI_Concepts_files/       # 各コンセプトに対応する図解画像（元画像アセット）
```

---

## 🚀 ローカル環境で確認する方法

外部ビルドツールは使用していないため、HTMLファイルをダブルクリックして直接ブラウザで開くか、ローカルの簡易Webサーバーを立ち上げてプレビューすることができます。

### 方法1. Pythonを使った簡易サーバー起動 (推奨)
ターミナルで本ディレクトリへ移動し、以下のコマンドを実行します。
```bash
python3 -m http.server 8000
```
起動後、ブラウザで `http://localhost:8000` にアクセスしてください。

### 方法2. VS Code の Live Server 等の拡張機能を利用する
VS Code をご利用の場合は、拡張機能「Live Server」をインストールし、ステータスバーの「Go Live」をクリックすることで、オートリロード対応のローカル環境を立ち上げることができます。

---

## 🌐 GitHub Pages で公開する手順

本リポジトリは静的ファイルのみで構成されているため、ビルドなしでそのまま GitHub Pages にデプロイできます。

1. **GitHub にリポジトリを作成する**
   - GitHubで新しいパブリックリポジトリを作成します。
2. **ファイルをプッシュする**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <あなたのリポジトリのURL>
   git push -u origin main
   ```
3. **GitHub Pages を有効化する**
   - GitHubリポジトリページで、 **Settings**（設定） > **Pages** に移動します。
   - **Build and deployment** の Source にて `Deploy from a branch` を選択します。
   - Branch で `main` (または `master`) を選択し、フォルダとして `/ (root)` を指定して **Save** をクリックします。
4. **公開の完了**
   - 数分以内に、上部に表示されるURL（例: `https://<ユーザー名>.github.io/<リポジトリ名>/`）でWebサイトが全世界に公開されます。

---

## ✍️ 文章やコンセプトを追加・修正する方法

### コンセプト内容を修正・更新する
`index.html` に収録されている各セクションは、`<section class="concept-card" id="concept-[番号]">` という構造を持っています。
テキストの修正は、対応するセクション内の以下のクラスが適用されたタグを編集してください。
- `.concept-title-en` : 英語タイトル
- `.concept-title-jp` : 日本語タイトル
- `.summary-text` : 1行まとめの内容
- `.detailed-text` : 元データに基づいた詳細説明（重要単語は `<strong>` を使用）
- `.info-box.beginner` : 初心者向け補足
- `.info-box.example` : 具体例
- `.info-box.warning` : 注意点・誤解しやすいポイント

### 目次（ToC）へ項目を追加する
コンセプトを新規に追加（例: 21個目のコンセプト）する場合は、`index.html` 内の `app-sidebar`（PC用サイドバー目次）および `mobile-toc-overlay`（スマホ用目次）の両方に以下のように項目を追加してください。
```html
<li class="toc-item" data-index="21"><button><span class="toc-num">21.</span> 新しいコンセプト名</button></li>
```
その後、`script.js` 頭部の `const totalConcepts = 20;` を `21` に変更することで、自動的にナビゲーションに反映されます。

---

## 🎨 デザインのカスタマイズ方法

全体のカラーテーマやフォント、レイアウトサイズは、`style.css` の冒頭にある `:root` 変数を書き換えるだけで、一括でカスタマイズが可能です。

```css
:root {
  /* 背景色と基本UI色 */
  --bg-primary: #0b0f19;          /* 全体の背景色 */
  --bg-secondary: #131b2e;        /* サイドバーやカードの背景色 */
  --bg-card: #1e293b;             /* 各種情報ボックスの背景色 */
  
  /* テキストカラー */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  
  /* アクセントカラー */
  --color-teal: #14b8a6;          /* アクティブな目次やキーカラー */
  --color-amber: #f59e0b;         /* 注意点ボックスのテーマカラー */
  --color-blue: #3b82f6;          /* 初心者向け補足ボックスのテーマカラー */
  --color-emerald: #10b981;       /* 具体例ボックスのテーマカラー */

  /* フォント指定 */
  --font-heading: 'Outfit', 'Noto Sans JP', sans-serif;
  --font-body: 'Noto Sans JP', sans-serif;
}
```

例えば、サイト全体を明るい「ライトモード」に変更したい場合は、これらの変数のカラーコードを白系統・黒文字系統に書き換えることで、レスポンシブデザインを保ったまま容易にカラー変更が行えます。
