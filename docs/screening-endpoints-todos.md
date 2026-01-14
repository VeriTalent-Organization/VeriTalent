# Screening Endpoints — Integration TODOs

Summary: This file lists the screening API endpoints, where they are implemented in the frontend service layer (`lib/services/screeningService.ts`), current usage in the codebase, and concrete UI integration tasks (who to call, when, and acceptance criteria).

---

## Endpoints

1) POST /v1/screening/session/create
- Service method: `screeningService.createSession(data)`
- Current usage: **No direct caller in UI**
- Where to integrate:
  - `components/Dashboard/cv-upload/*` (e.g., `PreviewAndPublish` or `ScreeningCriteriaForm`) when starting a new bulk CV processing flow
  - `components/Dashboard/screening-interface/dashboardContent.tsx`: Add a "Create Screening Session" action for a job
- Actionable TODO:
  - Add UI action to call `createSession` and handle returned session id.
  - Acceptance: UI receives session id and navigates / uses it for subsequent `bulkCv` calls.

2) POST /v1/screening/session/{id}/bulk-cv
- Service method: `screeningService.bulkCv(sessionId, formData)`
- Current usage: **No direct caller in UI**
- Where to integrate:
  - `components/Dashboard/cv-upload/bulk_upload.tsx` — after files are selected/dropped, upload via `bulkCv` (multipart FormData).
  - Flow: `createSession` (if needed) → `bulkCv` → show upload progress & result.
- Actionable TODO:
  - Wire `bulk_upload.tsx` to construct FormData and call `bulkCv(sessionId, formData)`.
  - Acceptance: Files successfully upload and UI displays server response (parsed CVs / draft AI cards).

3) POST /v1/screening/session/{id}/screen-ids
- Service method: `screeningService.screenIds(sessionId, { candidateIds })`
- Current usage: **No direct caller in UI**
- Where to integrate:
  - `components/Dashboard/screening-interface/candidateSelectionModal.tsx` — after selecting candidates, call `screenIds` to trigger screening operations.
  - Bulk action button in `dashboardContent.tsx` (Bulk Actions) — pass selected IDs to `screenIds`.
- Actionable TODO:
  - Add selection→screen action with loading feedback; show results in session detail view.
  - Acceptance: Selected candidate IDs are processed and results are visible in UI.

4) GET /v1/screening/sessions
- Service method: `screeningService.getSessions()`
- Current usage: **Used** in `app/dashboard/page.tsx` to compute screening counts/metrics.
- Where to further use:
  - List sessions on the Screening page (`app/dashboard/screening/page.tsx` / `dashboardContent.tsx`) to pick a session to inspect.
- Actionable TODO:
  - Create a session list component showing sessions and allow selecting one to call `getSession`.
  - Acceptance: Sessions are listed and selectable.

5) GET /v1/screening/session/{id}
- Service method: `screeningService.getSession(sessionId)`
- Current usage: **No direct caller in UI**
- Where to integrate:
  - Session detail view (new component under `components/Dashboard/screening-interface/`) that shows candidate list, fit scores, statuses, and actions like shortlist.
  - `dashboardContent.tsx` can call `getSession` when a job/session is selected.
- Actionable TODO:
  - Implement session detail view and call `getSession` to populate it.
  - Acceptance: Candidate list, scores, and statuses match backend data.

6) POST /v1/screening/session/{id}/shortlist/{index}
- Service method: `screeningService.shortlist(sessionId, index)`
- Current usage: **Not called in UI**; docs indicate this may not be implemented in backend (see `docs/implementation_gaps.md`).
- Where to integrate:
  - `components/Dashboard/screening-interface/dashboardContent.tsx` — when marking a candidate as "Shortlisted", call `shortlist` and update UI optimistically.
  - `ApplicantAICardView.tsx` — add a "Shortlist" button that calls `shortlist`.
- Actionable TODO:
  - Add call to `shortlist` with optimistic UI update; add error handling to revert if backend fails.
  - Acceptance: Shortlist action persists on refresh (or API returns success), and UI shows "shortlisted" state.

---

## Prioritized Implementation Plan (short checklist)
- [x] Create session: Add "Create Screening Session" action in Screening UI (dashboardContent) — **implemented** in `components/Dashboard/screening-interface/dashboardContent.tsx` (handler + UI button). Note: needs manual testing and minor UX polish.
- [ ] Bulk CV upload: Wire `bulk_upload.tsx` to call `createSession` (if needed) then `bulkCv`.
- [ ] Screen selected IDs: Use `candidateSelectionModal.tsx` to call `screenIds` for selected candidates.
- [ ] Session list view: Use `getSessions` to list sessions and allow selection.
- [ ] Session detail view: Implement component that calls `getSession` and displays candidates/scores.
- [ ] Shortlist persistence: Wire shortlist button to `screeningService.shortlist` and add optimistic UI updates.

---

## Notes & UX suggestions
- Use optimistic UI updates for shortlisting, but ensure server confirmations when available.
- For `bulkCv`, show file upload progress and parse errors per file.
- For `screenIds`, show a job-level progress indicator since screening may be asynchronous.

---

File created by: GitHub Copilot
