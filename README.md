# weight-logger-mini

初心者向けの体重管理アプリを、段階的に作るためのミニプロジェクトです。

## アプリの目的

- 日々の体重を入力し、保存して、履歴を見返せるようにする
- ChatGPT に貼り付けるための報告文を作れるようにする
- ただし、最初から作り込みすぎず、学習しやすい最小構成から進める

## Task 003 で作った範囲

- `index.html` / `styles.css` / `script.js` の最小構成を作成
- 画面の骨組みとして以下を配置
  - アプリタイトル
  - 今日の体重入力セクション（日付・体重・保存ボタン・報告文作成ボタン）
  - 記録一覧セクション
  - ChatGPT報告文セクション
- `script.js` に今後使う基本関数の枠を用意
  - `getTodayDate()`
  - `loadRecords()`
  - `saveRecord()`
  - `renderRecords()`
  - `buildChatGPTReport()`
- 現時点は保存機能・報告文生成機能は仮実装（TODO を配置）

## まだ未実装のもの

- `localStorage` への永続保存
- 保存済みデータの読み込み
- 実データに基づく報告文の組み立て
- 入力値の詳細バリデーション

## Task 004 でやること候補

- `loadRecords()` / `saveRecord()` を `localStorage` 対応
- 初期表示で保存済みの記録を一覧表示
- 保存後の再描画と入力リセットの整備
- `buildChatGPTReport()` を実データベースで生成できるよう改善

## Task 004: GitHub Pages 公開確認

このリポジトリは `index.html` がルートにある静的構成のため、GitHub Pages でそのまま公開できます。

### 公開手順（最小）

1. GitHub のリポジトリ画面で **Settings > Pages** を開く
2. **Build and deployment** の **Source** で `Deploy from a branch` を選ぶ
3. **Branch** で `main`（または公開したいブランチ）を選び、フォルダは `/ (root)` を選ぶ
4. 保存後、表示される公開 URL を開く

### 公開後の確認ポイント

- 開く URL: `https://<GitHubユーザー名>.github.io/<リポジトリ名>/`
- 成功の目安:
  - 「体重ログミニアプリ（公開確認用）」のタイトルが表示される
  - 「今日の体重入力」「記録一覧」「ChatGPT報告文」の3セクションが初期表示で見える
  - CSS が適用され、カード風の枠と余白が表示される
- 表示されない場合の確認:
  - `Settings > Pages` の Branch / Folder 設定が正しいか
  - `index.html` がリポジトリ直下にあるか
  - `index.html` の `styles.css` / `script.js` が相対パス（`styles.css`, `script.js`）のままか
  - 反映直後は数分待って再読み込みする

