# Relay エージェント移行表

Claude Code 側の relay エージェントを、Codex のプロジェクトスコープエージェントへ移した対応表です。

| 旧エージェント | 移行先 | 扱い |
|---|---|---|
| `relay-investigator` | `relay_investigator` | Terra の読み取り専用調査 |
| `relay-reviewer` | `relay_reviewer` | Fable 不在時の Terra フォールバック |
| `relay-codex-reviewer` | `relay_fable_reviewer` + Fable MCP | Codex が主セッションになるため、Claude ラッパーは廃止 |
| `relay-implementer` | `relay_implementer` | Luna 高 effort |
| `relay-implementer-std` | `relay_implementer_std` | Luna 中 effort |
| `relay-codex` | 直接実装 / `relay_implementer*` | Codex を外から呼ぶラッパーは廃止 |
| `relay-verifier` | `relay_verifier` | Terra の検証専用レーン |
| `relay-mechanic` | `relay_mechanic` | Luna 低 effort |

Fable は Codex のモデル設定に偽装せず、個人層の MCP ブリッジから公式 Claude Code CLI の `fable` alias を呼び出します。Codex 内のレビュー担当は、ブリッジを呼ぶ薄いディスパッチャーか、ブリッジ不在時のフォールバックです。
