# Community Labeling

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the community listing below
and write 2-5 word plain-language names for each.

## Language

Write every name in English (en). Do not switch languages.

## Communities

Community 0: chatGPTSignInPath(, chatGPTSignOutPath(, getChatGPTUser(, isReservedAuthPath(, requireChatGPTUser(, safeDecodeURIComponent(, safeRelativeReturnPath(, chatgpt-auth.ts, ChatGPTUser
Community 1: getDb(, toRouteErrorMessage(, index.ts, schema.ts, notes, route.ts, GET(, POST(
Community 2: SkeletonPreview(, page.tsx, Home(, metadata, SkeletonPreview.tsx, articleWidths, sidebarWidths
Community 3: layout.tsx, geistMono, geistSans, metadata, RootLayout(
Community 4: rendered-html.test.mjs, previewRoot, render(, templateRoot
Community 5: index.ts, Env, ExecutionContext, worker
Community 6: eslint.config.mjs, eslintConfig
Community 7: next.config.ts, nextConfig
Community 8: postcss.config.mjs, config
Community 9: vite.config.ts, localBindingConfig
Community 10: drizzle.config.ts
Community 11: next-env.d.ts

## Instructions

Write a single JSON object mapping each community id (as a string) to its
2-5 word name to: /Users/joan/Desktop/projects/Peñíscola/.graphify/label-instructions/communities.json

Example:
```json
{
  "0": "Authentication Flow",
  "1": "Authentication Flow",
  "2": "Authentication Flow"
}
```

Then re-run `graphify update` (or `graphify label`) to ingest the names.
