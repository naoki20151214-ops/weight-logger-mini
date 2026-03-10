# タスク

- [x] Task 001: repository created and confirmed
- [x] Task 002: bootstrap management files
- [x] Task 003: initialize app skeleton
- [x] Task 004: GitHub Pages 公開確認（静的公開前提の整備と確認手順の明文化）
- [x] Task 005: localStorage による最小保存機能の実装（保存・一覧反映・再読み込み復元・報告文生成）
- [x] Task 006: 記録管理の改善（新しい順表示・1件削除・空状態表示・削除後の即時更新と永続化）

- [x] Task 007: 入力体験の改善（成功/エラーメッセージ、同日上書き確認、保存後状態調整、保存ボタン制御）
  - 2026-03-10 修正: 同日重複保存時は必ず確認後に上書き更新し、重複追加を防止（既存重複データの正規化を含む）
  - 2026-03-10 Task 007-bugfix: 保存処理入口で正規化を通して同日判定を保証し、OK 時は置換保存・起動時/保存時の重複正規化・一覧/報告文の正規化データ利用を確認
