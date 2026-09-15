# Graph Report - .  (2026-09-14)

## Corpus Check
- Corpus is ~1,777 words - fits in a single context window. You may not need a graph.

## Summary
- 47 nodes · 47 edges · 10 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: contains: 32 · calls: 8 · imports_from: 4 · imports: 3


## Input Scope
- Requested: all
- Resolved: all (source: configured-default)
- Included files: 16 · Candidates: recursive
- Excluded: 0 untracked · 0 ignored · 0 sensitive · 0 missing committed
## God Nodes (most connected - your core abstractions)
1. `safeRelativeReturnPath()` - 4 edges
2. `getChatGPTUser()` - 3 edges
3. `requireChatGPTUser()` - 3 edges
4. `chatGPTSignInPath()` - 3 edges
5. `toRouteErrorMessage()` - 3 edges
6. `SkeletonPreview()` - 2 edges
7. `chatGPTSignOutPath()` - 2 edges
8. `isReservedAuthPath()` - 2 edges
9. `safeDecodeURIComponent()` - 2 edges
10. `getDb()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.39
Nodes (8): chatGPTSignInPath(), chatGPTSignOutPath(), ChatGPTUser, getChatGPTUser(), isReservedAuthPath(), requireChatGPTUser(), safeDecodeURIComponent(), safeRelativeReturnPath()

### Community 1 - "Community 1"
Cohesion: 0.43
Nodes (5): getDb(), notes, GET(), POST(), toRouteErrorMessage()

### Community 2 - "Community 2"
Cohesion: 0.33
Nodes (4): metadata, articleWidths, sidebarWidths, SkeletonPreview()

### Community 3 - "Community 3"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 4 - "Community 4"
Cohesion: 0.50
Nodes (2): previewRoot, templateRoot

### Community 5 - "Community 5"
Cohesion: 0.50
Nodes (3): Env, ExecutionContext, worker

### Community 6 - "Community 6"
Cohesion: 1.00
Nodes (1): eslintConfig

### Community 7 - "Community 7"
Cohesion: 1.00
Nodes (1): nextConfig

### Community 8 - "Community 8"
Cohesion: 1.00
Nodes (1): config

### Community 9 - "Community 9"
Cohesion: 1.00
Nodes (1): localBindingConfig

## Knowledge Gaps
- **16 isolated node(s):** `sidebarWidths`, `articleWidths`, `ChatGPTUser`, `geistSans`, `geistMono` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 4`** (2 nodes): `previewRoot`, `templateRoot`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (1 nodes): `nextConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (1 nodes): `localBindingConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `sidebarWidths`, `articleWidths`, `ChatGPTUser` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._