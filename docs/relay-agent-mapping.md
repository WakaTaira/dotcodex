# Relay の役割と実行経路

通常の作業は Codex モデルが担い、Fable 5.1 は難所の相談に使う。メインは現在の Codex モデルを継承し、小さな変更を直接実装する。

## 役割

| エージェント | モデル / effort | 役割 |
|---|---|---|
| `relay_investigator` | Terra / `high` | 読み取り専用のコードパス・依存関係調査 |
| `relay_implementer` | Luna / `max` | 仕様確定済みの高難度実装 |
| `relay_implementer_std` | Luna / `low` | 既存パターンが確立した実装 |
| `relay_acceptance_writer` | Luna / `max` | 実装前の受け入れテスト作成 |
| `relay_verifier` | Terra / `medium` | テスト・ビルド・lint の実行と証拠の報告 |
| `relay_mechanic` | Luna / `low` | 判断を含まない定型作業 |
| `relay_reviewer` | Terra / `high` | 通常の仕様・回帰・テスト不足のレビュー |
| `relay_fable_advisor` | Luna / `low` → Fable 5.1 | 資料整理を分離する場合の相談仲介 |

テストの単純追加は Luna `low`、新規ハーネスと Luna `max` で不足する実装は Sol `high` が候補である。役割 TOML がモデル・effort を固定する場合、別の値を使う担当は固定役割を選ばず、作成者・実装者の指示と指定値を渡して起動する。

## コンテキストと境界

委譲先には目的・対象・制約・完了条件、作業ルート、必要な参照パスを渡す。資料は担当が必要箇所だけ読み、長い全文や無関係な会話を中継しない。実装とテスト作成は排他的な変更対象を持ち、メインが差分で境界を確認する。

Fable 5.1 への相談は MCP 直接呼び出しが基本である。個人層のブリッジが `claude-fable-5-1` を明示指定し、読み取り専用の指示と `plan` モードで起動する。Codex のモデル欄は Codex モデルだけを持つ。互換性のため MCP の識別子は `claude_fable_reviewer` / `review_with_fable` である。

## 設計判断

2026-09-05: 実装・テスト作成・通常レビューを Codex に統一し、Fable 5.1 を必要時の相談役にする。Codex を主セッションとして意思決定と実行をつなげ、異なるモデルによる検討を難所へ集中するためである。全変更を Fable の承認待ちにする構成と、失敗時に Claude へ実装を振り直す構成は採用しない。

2026-09-05: Codex 内の委譲はネイティブのサブエージェントを使う。Claude 側の `relay-codex` にある直接呼び出し・必要資料だけ読む考え方を保ち、中継用の Claude エージェントや Codex MCP の再起動は追加しない。

## Claude 側との対応

| Claude 側の機能 | Codex 側 |
|---|---|
| `relay-codex` の実装レシピ | メインの直接実装 / `relay_implementer*` |
| `gauntlet` の Codex テスト作成 | `relay_acceptance_writer` と独立した実行確認 |
| `relay-codex-reviewer` の外部レビュー | 通常レビューは `relay_reviewer`、難所は Fable 相談 |
| `relay-investigator` / `relay-verifier` / `relay-mechanic` | 対応する Codex の役割 TOML |
