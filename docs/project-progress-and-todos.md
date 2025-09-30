# News Intelligence System — Progress Report and TODOs

## 1) Overview
- Goal: Multi-source news ingestion (GitHub, RSS, HTML), daily AI analysis, long-term storage, and searchable access; UI with shadcn/ui; Vercel + Supabase deployment.
- Current focus: Standardized, configurable GitHub README-based extraction (e.g., Peldom/papers_for_protein_design_using_DL) with AI-generated concise summaries and deduplication.

## 2) Architecture Snapshot
- Frontend: Next.js (App Router), shadcn/ui, Tailwind CSS
- Backend: Next.js API routes (Vercel), Supabase (Postgres + storage), optional cron
- AI: OpenAI or Claude (retry/backoff for 429), prompt specialization for GitHub README
- Data: `sources`, `items`, `daily_digests`, `fetch_runs`; embeddings planned (pgvector) later

## 3) Key Implementations Completed

### 3.1 Data fetching pipeline
- File: `src/lib/fetch-service.ts`
  - Added GitHub README fetch via GitHub API `/readme` endpoint (base64 decode → clean text).
  - Removed noisy commits/releases ingestion for `github_repo` kind.
  - Added immediate AI analysis after README fetch; result is saved as item content, ensuring Recent Items show AI summaries rather than raw text.
  - Added 50-character concise AI summary for Recent Items.
  - Introduced configurable per-source extraction and dedup logic:
    - `extract_section` (e.g., "Papers last week")
    - `dedup_strategy` (content_hash | section_hash | none)
    - Skip new item creation when section content unchanged (section_hash).
  - For HTML sources, specialized flow for GitHub README retained as fallback.

### 3.2 AI service
- File: `src/lib/ai-service.ts`
  - Specialized system and user prompts for GitHub README context (focus on latest updates, newly added papers, technical trends, breakthroughs).
  - Uses `ai_focus` from `sources` as prompt guidance when provided.
  - Retry with exponential backoff on 429.
  - Supports switching between OpenAI and Claude.

### 3.3 UI/UX updates
- File: `src/app/sources/edit-source-dialog.tsx`
  - Added fields:
    - `AI 分析重点 (ai_focus)`
    - 高级配置: `extractSection` and `dedupStrategy` (content_hash, section_hash, none).
  - Backward-compatible column existence checks for older schemas.
  - Recommended URLs panel for GitHub RSS (commits/releases) retained but optional.

### 3.4 Supabase schema updates
- File: `update-sources-schema.sql`
  - Adds columns to `sources`:
    - `extract_section TEXT DEFAULT ''`
    - `dedup_strategy TEXT DEFAULT 'content_hash'`
  - Comments and example `UPDATE` for README-focused sources.

### 3.5 Diagnostics and hardening
- Environment debug page and API routes (debug-env) helped surface env loading discrepancies.
- Improved error logging in UI screens: sources list, edit dialog, analyze API.
- Handled type errors: properly typed optional fields (`description`, `ai_focus`).
- Added HTML decoding for RSS entries; base64 decoding for proxy responses.
- Implemented local test scripts (ad-hoc) for Supabase connectivity.

## 4) Current Behavior (GitHub README sources)
- Only README content is fetched and analyzed.
- If `extract_section` is set (e.g., "Papers last week"), only that section is analyzed and used.
- If section content is unchanged (based on `section_hash`), fetching creates 0 new items.
- Recent Items display a concise 50-char AI summary highlighting the latest updates.

## 5) Deployment Notes
- Ensure `.env.local` has:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `OPENAI_API_KEY` or `CLAUDE_API_KEY`
- Vercel: set same env vars; redeploy to apply changes.
- Supabase: run `update-sources-schema.sql` to add new columns.

## 6) Known Issues and Resolutions
- Supabase env not loading on client → recreated `.env.local`, added runtime logging, temporarily hardcoded values to isolate root cause (now resolved).
- OpenAI 429 → added retry/backoff and clearer error diagnostics.
- GitHub network push instability → switch to HTTPS remote, configure proxy when needed.
- Old data showed raw HTML escape sequences → switched to GitHub API README raw content and immediate AI analysis.

## 7) How to Configure a Source (Standardized)
1. Create/Edit a source in UI:
   - `Source Type`: GitHub Repository or HTML
   - `Source URL`: Repo URL or README URL
   - `AI 分析重点`: describe what to focus on (latest added papers, methods, breakthroughs)
   - 高级: `只关注特定章节` (e.g., `Papers last week`)
   - 高级: `去重策略` (推荐 `section_hash` for README sections)
2. Save and run fetch. If the target section unchanged, no new item will be created.

## 8) Operator Quick Checks
- Supabase connectivity: verify in a small node script or via UI list of sources.
- Test env: add a `/test-env` page or API to print env on server.
- Fetch & Analyze: trigger fetch-and-save for a source and check Recent Items for 50-char AI summary.

## 9) Pending Next Steps (TODOs)
- [ ] Add server-side cron or Supabase cron for scheduled fetching.
- [ ] Implement embeddings (pgvector) and vector search for items.
- [ ] Add per-source AI model selection (OpenAI vs Claude) in UI.
- [ ] Add “analysis length preset” (short/medium/long) and templates in UI.
- [ ] Improve README section parser (markdown AST) to better bound sections.
- [ ] Add moderation/validation rules to prevent empty/duplicate items beyond hash.
- [ ] Expose a “re-analyze” action for items when `ai_focus` changes.
- [ ] Add per-source fetch history view (from `fetch_runs`).
- [ ] Add test harness for README fixtures to prevent regressions.

## 10) Changelist Highlights
- `src/lib/fetch-service.ts`:
  - README-only ingestion; section extraction; dedup via `section_hash`; 50-char AI summary; metadata includes `extracted_section`, `section_hash`.
- `src/lib/ai-service.ts`:
  - Specialized prompts for README; uses `ai_focus` when present; retry on 429; Claude support.
- `src/app/sources/edit-source-dialog.tsx`:
  - New fields: `extractSection`, `dedupStrategy`; robust load/save; guidance texts.
- `update-sources-schema.sql`:
  - Adds `extract_section`, `dedup_strategy` columns with docs and examples.

---

Last updated: ${new Date().toISOString()}
