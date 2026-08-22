# dotcodex

Codex を主セッションとして運用するための、個人用エージェント資産です。公開候補の資産をこのリポジトリで管理し、private リポジトリから submodule として利用します。

## 方針

- `brief-me` / `grill-me` / `gauntlet` で設計と受け入れ条件を固めます。
- 小さな変更はメインセッションが直接実装します。
- 分離が有効な大きな実装だけを `relay_implementer*`（Luna）へ委譲します。
- レビューは個人層の Fable MCP ブリッジを第一候補とし、利用できない場合だけ `relay_reviewer` を使います。

## 内容

- `.agents/skills/`: Claude 側の公開スキル 8 種を Codex のスキル形式へ移行したもの
- `.codex/agents/`: Codex ネイティブの relay エージェント
- `AGENTS.md`: Claude の公開 rule から移した、確認・行動を求める出力規範
- `.codex/config.toml`: Sol を優先し、未提供時は利用可能な global モデルを使うプロジェクト設定。サブエージェントは Luna を既定にする
- `config/tui-keymap.toml.example`: Claude の keybindings から Codex に対応する TUI 操作だけを移した例
- `config/tui-status-line.toml.example`: Claude の Rust statusline から Codex 組み込み表示へ移せる最小構成
- `docs/relay-agent-mapping.md`: 旧 Claude エージェントとの対応表
- `docs/migration-scope.md`: 追加移行したものと Codex に受け口がないものの一覧

Codex はリポジトリの `.agents/skills` と `.codex/agents` をプロジェクトスコープで読み込みます。Sol が利用可能になったらコメントを外し、現時点では現在の global 設定（この環境では Luna）を使います。

## 既存の Claude 資産

既存の `~/.claude/repo` はこのリポジトリから参照も変更もしていません。移行期間中は両方を並行運用できます。
