# Node Description Batch 1 of 2

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

- "app_chatgpt_auth": "chatgpt-auth.ts" | kind=code-symbol | source=app/chatgpt-auth.ts:L1 | neighbors=[chatGPTSignInPath(), chatGPTSignOutPath(), ChatGPTUser, getChatGPTUser(), isReservedAuthPath(), requireChatGPTUser()]
- "notes_route": "route.ts" | kind=code-symbol | source=examples/d1/app/api/notes/route.ts:L1 | neighbors=[index.ts, getDb(), schema.ts, notes, GET(), POST()]
- "app_chatgpt_auth_saferelativereturnpath": "safeRelativeReturnPath()" | kind=code-symbol | source=app/chatgpt-auth.ts:L61 | neighbors=[chatgpt-auth.ts, chatGPTSignInPath(), chatGPTSignOutPath(), isReservedAuthPath()]
- "app_layout": "layout.tsx" | kind=code-symbol | source=app/layout.tsx:L1 | neighbors=[geistMono, geistSans, metadata, RootLayout()]
- "app_page": "page.tsx" | kind=code-symbol | source=app/page.tsx:L1 | neighbors=[Home(), metadata, SkeletonPreview.tsx, SkeletonPreview()]
- "sites_preview_skeletonpreview": "SkeletonPreview.tsx" | kind=code-symbol | source=app/_sites-preview/SkeletonPreview.tsx:L1 | neighbors=[page.tsx, articleWidths, sidebarWidths, SkeletonPreview()]
- "app_chatgpt_auth_chatgptsigninpath": "chatGPTSignInPath()" | kind=code-symbol | source=app/chatgpt-auth.ts:L51 | neighbors=[chatgpt-auth.ts, safeRelativeReturnPath(), requireChatGPTUser()]
- "app_chatgpt_auth_getchatgptuser": "getChatGPTUser()" | kind=code-symbol | source=app/chatgpt-auth.ts:L21 | neighbors=[chatgpt-auth.ts, safeDecodeURIComponent(), requireChatGPTUser()]
- "app_chatgpt_auth_requirechatgptuser": "requireChatGPTUser()" | kind=code-symbol | source=app/chatgpt-auth.ts:L42 | neighbors=[chatgpt-auth.ts, chatGPTSignInPath(), getChatGPTUser()]
- "db_index": "index.ts" | kind=code-symbol | source=db/index.ts:L1 | neighbors=[getDb(), schema.ts, route.ts]
- "db_schema": "schema.ts" | kind=code-symbol | source=examples/d1/db/schema.ts:L1 | neighbors=[index.ts, notes, route.ts]
- "notes_route_torouteerrormessage": "toRouteErrorMessage()" | kind=code-symbol | source=examples/d1/app/api/notes/route.ts:L5 | neighbors=[route.ts, GET(), POST()]
- "tests_rendered_html_test": "rendered-html.test.mjs" | kind=code-symbol | source=tests/rendered-html.test.mjs:L1 | neighbors=[previewRoot, render(), templateRoot]
- "worker_index": "index.ts" | kind=code-symbol | source=worker/index.ts:L1 | neighbors=[Env, ExecutionContext, worker]
- "app_chatgpt_auth_chatgptsignoutpath": "chatGPTSignOutPath()" | kind=code-symbol | source=app/chatgpt-auth.ts:L56 | neighbors=[chatgpt-auth.ts, safeRelativeReturnPath()]
- "app_chatgpt_auth_isreservedauthpath": "isReservedAuthPath()" | kind=code-symbol | source=app/chatgpt-auth.ts:L76 | neighbors=[chatgpt-auth.ts, safeRelativeReturnPath()]
- "app_chatgpt_auth_safedecodeuricomponent": "safeDecodeURIComponent()" | kind=code-symbol | source=app/chatgpt-auth.ts:L84 | neighbors=[chatgpt-auth.ts, getChatGPTUser()]
- "db_index_getdb": "getDb()" | kind=code-symbol | source=db/index.ts:L5 | neighbors=[index.ts, route.ts]
- "db_schema_notes": "notes" | kind=code-symbol | source=examples/d1/db/schema.ts:L4 | neighbors=[schema.ts, route.ts]
- "notes_route_get": "GET()" | kind=code-symbol | source=examples/d1/app/api/notes/route.ts:L18 | neighbors=[route.ts, toRouteErrorMessage()]
- "notes_route_post": "POST()" | kind=code-symbol | source=examples/d1/app/api/notes/route.ts:L36 | neighbors=[route.ts, toRouteErrorMessage()]
- "sites_preview_skeletonpreview_skeletonpreview": "SkeletonPreview()" | kind=code-symbol | source=app/_sites-preview/SkeletonPreview.tsx:L10 | neighbors=[page.tsx, SkeletonPreview.tsx]
- "app_chatgpt_auth_chatgptuser": "ChatGPTUser" | kind=code-symbol | source=app/chatgpt-auth.ts:L4 | neighbors=[chatgpt-auth.ts]
- "app_layout_geistmono": "geistMono" | kind=code-symbol | source=app/layout.tsx:L10 | neighbors=[layout.tsx]
- "app_layout_geistsans": "geistSans" | kind=code-symbol | source=app/layout.tsx:L5 | neighbors=[layout.tsx]
- "app_layout_metadata": "metadata" | kind=code-symbol | source=app/layout.tsx:L15 | neighbors=[layout.tsx]
- "app_layout_rootlayout": "RootLayout()" | kind=code-symbol | source=app/layout.tsx:L24 | neighbors=[layout.tsx]
- "app_page_home": "Home()" | kind=code-symbol | source=app/page.tsx:L13 | neighbors=[page.tsx]
- "app_page_metadata": "metadata" | kind=code-symbol | source=app/page.tsx:L4 | neighbors=[page.tsx]
- "eslint_config": "eslint.config.mjs" | kind=code-symbol | source=eslint.config.mjs:L1 | neighbors=[eslintConfig]
- "eslint_config_eslintconfig": "eslintConfig" | kind=code-symbol | source=eslint.config.mjs:L10 | neighbors=[eslint.config.mjs]
- "next_config": "next.config.ts" | kind=code-symbol | source=next.config.ts:L1 | neighbors=[nextConfig]
- "next_config_nextconfig": "nextConfig" | kind=code-symbol | source=next.config.ts:L3 | neighbors=[next.config.ts]
- "postcss_config": "postcss.config.mjs" | kind=code-symbol | source=postcss.config.mjs:L1 | neighbors=[config]
- "postcss_config_config": "config" | kind=code-symbol | source=postcss.config.mjs:L1 | neighbors=[postcss.config.mjs]
- "sites_preview_skeletonpreview_articlewidths": "articleWidths" | kind=code-symbol | source=app/_sites-preview/SkeletonPreview.tsx:L8 | neighbors=[SkeletonPreview.tsx]
- "sites_preview_skeletonpreview_sidebarwidths": "sidebarWidths" | kind=code-symbol | source=app/_sites-preview/SkeletonPreview.tsx:L7 | neighbors=[SkeletonPreview.tsx]
- "tests_rendered_html_test_previewroot": "previewRoot" | kind=code-symbol | source=tests/rendered-html.test.mjs:L8 | neighbors=[rendered-html.test.mjs]
- "tests_rendered_html_test_render": "render()" | kind=code-symbol | source=tests/rendered-html.test.mjs:L10 | neighbors=[rendered-html.test.mjs]
- "tests_rendered_html_test_templateroot": "templateRoot" | kind=code-symbol | source=tests/rendered-html.test.mjs:L7 | neighbors=[rendered-html.test.mjs]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/joan/Desktop/projects/Peñíscola/.graphify/description-instructions/batch-000.json

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
