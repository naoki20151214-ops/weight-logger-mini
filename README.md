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
