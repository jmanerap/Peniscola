# Node Description Batch 2 of 2

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "vite_config": "vite.config.ts" | kind=code-symbol | source=vite.config.ts:L1 | neighbors=[localBindingConfig]
- "vite_config_localbindingconfig": "localBindingConfig" | kind=code-symbol | source=vite.config.ts:L14 | neighbors=[vite.config.ts]
- "worker_index_env": "Env" | kind=code-symbol | source=worker/index.ts:L5 | neighbors=[index.ts]
- "worker_index_executioncontext": "ExecutionContext" | kind=code-symbol | source=worker/index.ts:L17 | neighbors=[index.ts]
- "worker_index_worker": "worker" | kind=code-symbol | source=worker/index.ts:L28 | neighbors=[index.ts]
- "drizzle_config": "drizzle.config.ts" | kind=code-symbol | source=drizzle.config.ts:L1
- "next_env_d": "next-env.d.ts" | kind=code-symbol | source=next-env.d.ts:L1

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/joan/Desktop/projects/Peñíscola/.graphify/description-instructions/batch-001.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
