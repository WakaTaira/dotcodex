# dotclaude からの追加移行範囲

既存の `~/.claude/repo` を読み取り、Codex に同じ受け口がある資産だけを変換します。Claude 側のリポジトリ自体は変更しません。

## 変換したもの

| dotclaude | Codex |
|---|---|
| `rules/i-have-adhd.md` | ルート `AGENTS.md` の確認・行動を求める出力規範 |
| `agents/*.md` | `.codex/agents/*.toml` |
| `commands/save-session.md` | private 側 `.agents/skills/session-save/` |
| `commands/resume-session.md` | private 側 `.agents/skills/session-resume/` |
| `mcp.json` | private 側 `config/mcp.codex.toml.example` |
| `output-styles/*.md` | private 側 `output-styles/*.md` とプロファイル切替スクリプト |
| `keybindings.json` | `.codex/config.toml` の Codex 対応 TUI keymap と `config/tui-keymap.toml.example` |
| `statusline/` | `config/tui-status-line.toml.example` の組み込み status line 部分 |

## Codex に直接の受け口がないもの

- `keybindings.json` の Claude 固有 action: Codex の TUI に同等 action がないため、該当部分は Claude 側に残します。
- `statusline/` の Rust 実装: Claude の hook 入力と Anthropic OAuth usage API に依存するため、実装本体は Claude 側に残します。
- `settings.sync.json`: Claude 固有の connector 設定で、Codex の一般設定へ意味を移せません。
- `git-hooks/` と Claude 用の同期スクリプト: dotfiles の配布機構であり、Codex の実行時設定ではありません。

上記は削除・改変せず、移行対象外として明示しています。
