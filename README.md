# dotcodex

Codex を主セッションとして運用するための、個人用エージェント資産の移行候補です。現在は検証期間のため GitHub では非公開で作成します。

## 方針

- `brief-me` / `grill-me` / `gauntlet` で設計と受け入れ条件を固めます。
- 小さな変更はメインセッションが直接実装します。
- 分離が有効な大きな実装だけを `relay_implementer*`（Luna）へ委譲します。
- レビューは個人層の Fable MCP ブリッジを第一候補とし、利用できない場合だけ `relay_reviewer` を使います。

## 内容

- `.agents/skills/`: Claude 側の公開スキル 8 種を Codex のスキル形式へ移行したもの
- `.codex/agents/`: Codex ネイティブの relay エージェント
- `.codex/config.toml`: Sol を主セッション、Luna を実装既定にするプロジェクト設定
- `docs/relay-agent-mapping.md`: 旧 Claude エージェントとの対応表

Codex はリポジトリの `.agents/skills` と `.codex/agents` をプロジェクトスコープで読み込みます。モデル名がアカウントで利用できない場合は `.codex/config.toml` のモデル行だけを利用可能な名前へ変更してください。

## 既存の Claude 資産

既存の `~/.claude/repo` はこのリポジトリから参照も変更もしていません。移行期間中は両方を並行運用できます。
