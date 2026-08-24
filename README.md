# dotcodex

WakaTaira の Codex CLI 資産（公開分）。skills / relay エージェント / AGENTS.md / TUI 設定例を単一リポジトリで管理する。

Self-made Codex CLI assets: skills, relay agents, an AGENTS.md, and TUI config examples.

## 構成

| パス | 内容 |
|---|---|
| `.agents/skills/` | 自作スキル 8 種: brief-me / grill-me / gauntlet / relay / hunk-watch / pc-power / creating-pull-requests-en / creating-pull-requests-ja |
| `.codex/agents/` | relay 系エージェント定義 7 種: investigator / implementer / implementer-std / verifier / mechanic / reviewer / fable-reviewer |
| `.codex/config.toml` | リポジトリ直下で Codex を起動したときに読まれるプロジェクト設定。上記エージェントの登録と既定モデル |
| `AGENTS.md` | 確認・行動を求める出力の規範と、公開資産を変更するときの手順 |
| `config/` | `tui-keymap.toml.example` / `tui-status-line.toml.example` |
| `docs/` | `relay-agent-mapping.md`（Claude Code 版 relay エージェントとの対応表）/ `migration-scope.md`（Claude 資産のうち移したもの・移さないもの） |

## 運用方針

- 設計は `brief-me` で固め、既存の設計書は `grill-me` で精査し、受け入れ条件は `gauntlet` でテストに落とす
- 小さな変更はメインセッションが直接実装する。分離が効く大きな実装だけ `relay_implementer*`（Luna）へ委譲する
- レビューは個人層の Fable MCP ブリッジを第一候補とし、使えないときだけ `relay_reviewer` を使う
- Sol が利用可能になるまで `.codex/config.toml` の `model` は未指定にし、global 設定のモデルを継承する

## 導入

非公開資産と統合した親リポジトリ（dotcodex-private）の submodule `pub/` として運用するのが正位置。親の `scripts/sync-links.sh` が `~/.agents/skills/` へ symlink を張る。

単体で使う場合は本リポジトリ直下で Codex を起動する。`.agents/skills` と `.codex/agents` がプロジェクトスコープで読み込まれる。

## 備考

- `.agents/skills/grill-me` は [mattpocock/skills](https://github.com/mattpocock/skills) の grill-me 系スキルを起点に大幅に改変・統合したもの（詳細は同ディレクトリの PROVENANCE.md）
- `.agents/skills/creating-pull-requests-en` は [google/eng-practices](https://github.com/google/eng-practices) の CL description ガイドライン（CC-BY 3.0, Copyright Google LLC）を基礎に大幅改変したもの（詳細は同ディレクトリの PROVENANCE.md）
- `.agents/skills/creating-pull-requests-ja` は日本語 OSS のマージ済み PR 約 150 件の実地調査に基づく自作。`references/examples.md` に出典 URL 明記付きで公開 PR 本文の引用を含む（詳細は同ディレクトリの PROVENANCE.md）
- `AGENTS.md` の出力規範は [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd)（MIT License, Copyright (c) 2026 Ayoub Ghriss）を日本語へ改変・圧縮したもの。適用範囲を「ユーザーの確認・行動を求める出力」に絞っている
