# dotcodex

WakaTaira の Codex CLI 資産（公開分）。スキル、`relay` エージェント、`AGENTS.md`、TUI 設定例を単一リポジトリで管理する。

Self-made Codex CLI assets: skills, relay agents, an AGENTS.md, and TUI config examples.

## 構成

| パス | 内容 |
|---|---|
| `.agents/skills/` | 自作スキル 8 種: brief-me / grill-me / gauntlet / relay / hunk-watch / pc-power / creating-pull-requests-en / creating-pull-requests-ja |
| `.codex/agents/` | `relay` の調査・実装・受け入れテスト作成・検証・機械作業・レビュー・Fable 相談を担う定義 8 種 |
| `.codex/config.toml` | リポジトリ直下で Codex を起動したときに読まれるプロジェクト設定。エージェントの登録と並列実行枠 |
| `AGENTS.md` | 確認・行動を求める出力の規範と、公開資産を変更するときの手順 |
| `config/` | `tui-keymap.toml.example` / `tui-status-line.toml.example` |
| `docs/` | `relay-agent-mapping.md`（Claude Code 版 relay エージェントとの対応表）/ `migration-scope.md`（Claude 資産のうち移したもの・移さないもの） |

## 運用方針

- 未整理の構想は `brief-me`、既存設計の精査は `grill-me`、実装前の独立した受け入れ契約は `gauntlet` を使う。合意済みの作業に設計書や再承認を一律に求めない
- メインのコンテキスト消費と総作業量を抑える。切り出せる実装は `relay_implementer*`（Luna）、大量の資料を読む調査は `relay_investigator`（Terra）へ渡し、根拠付きの要点で統合する。小さな変更は直接実装し、利益のない多段委譲や全文の再読を避ける
- 独立した受け入れテスト作成は `relay_acceptance_writer`、通常レビューはメインまたは `relay_reviewer` が担う。調査・実装・検証も Codex モデルで完結する
- Fable 5.1 は難所や案の比較を検討する相談役である。必要なときだけ個人層の MCP を直接呼び、資料整理を分離する場合は `relay_fable_advisor` を使う。提案の採否はメインが判断する
- メインの `model` は未指定にし、ユーザーが選んだ Codex モデルを継承する

## 導入

非公開資産と統合した親リポジトリ（dotcodex-private）の submodule `pub/` として運用するのが正位置である。親の `scripts/sync-links.sh` がスキルを `~/.agents/skills/`、エージェント定義を `~/.codex/agents/` へリンクし、任意の作業先から使える状態にする。

単体で使う場合は本リポジトリ直下で Codex を起動する。`.agents/skills` と `.codex/agents` がプロジェクトスコープで読み込まれる。

## 実行構造

`relay` はメインの直接実装と Codex ネイティブのサブエージェントを使い分ける。`gauntlet` は別の作成担当が書いたテストを独立に再実行し、未実装による失敗とハーネスの失敗を区別する。実装担当にはテスト・fixture・ハーネス設定の保護対象と検証コマンドを渡す。

エージェントのモデルと役割は `docs/relay-agent-mapping.md`、起動時の制約は `.agents/skills/relay/references/delegation.md`、相談時の入力と失敗処理は `.agents/skills/relay/references/fable-consultation.md` に定義する。補助資料は担当が必要になった箇所だけ読む。

スキルは結果と判断基準を中心にし、実際の依存関係や安全上の境界がある処理だけ順序を固定する。PR の説明量は差分行数でなくリスクに合わせる。Hunk の継続監視は明示依頼で起動し、通知と修正の許可を区別する。

## 備考

- `.agents/skills/grill-me` は [mattpocock/skills](https://github.com/mattpocock/skills) の grill-me 系スキルを起点に大幅に改変・統合したもの（詳細は同ディレクトリの PROVENANCE.md）
- `.agents/skills/creating-pull-requests-en` は [google/eng-practices](https://github.com/google/eng-practices) の CL description ガイドライン（CC-BY 3.0, Copyright Google LLC）を基礎に大幅改変したもの（詳細は同ディレクトリの PROVENANCE.md）
- `.agents/skills/creating-pull-requests-ja` は日本語 OSS のマージ済み PR 約 150 件の実地調査に基づく自作。`references/examples.md` に出典 URL 明記付きで公開 PR 本文の引用を含む（詳細は同ディレクトリの PROVENANCE.md）
- `AGENTS.md` の出力規範は [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd)（MIT License, Copyright (c) 2026 Ayoub Ghriss）を日本語へ改変・圧縮したもの。適用範囲を「ユーザーの確認・行動を求める出力」に絞っている
