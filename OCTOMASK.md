# OctoMask — local v2

## Runtime

Start with `node server.mjs` from `purity-v2`. Uses the existing Gemini connection:
`GEMINI_API_KEY` or `../secrets/.gemini-key`. Model configurable with `GEMINI_MODEL`
(default: the existing `gemini-2.5-flash`). No browser-side secret, no new dependency.
Structured output follows https://ai.google.dev/gemini-api/docs/generate-content/structured-output.

`api/octomask-knowledge.mjs` contains only public commercial extracts from the July
2026 official catalogue, §5.1. Internal strategy and margins are excluded. Update
this curated catalogue when pricing changes. Prices are indicative; offers are
not signed quotes. Additional services without a card are routed to human scoping.

## Conversation and actions

- Response first, then one useful qualification question; no mandatory funnel.
- Price cards rendered from server data, never HTML/model-generated prices.
- Context retained in bounded server memory (last 10 exchanges, about 30 minutes
  inactivity); browser transcript in sessionStorage. Cookie is HttpOnly/SameSite.
- Explicit human/booking buttons transfer a draft to contact.html. The visitor
  can edit it, review details and submit. The model cannot send mail or book.
- Existing contact delivery now distinguishes email accepted, local-only journal,
  and complete failure. A booking failure is disclosed independently.
- No automatic lead capture, fake notification badge, proactive nagging or
  third-party analytics added. Disclosure identifies the assistant as AI and
  names Google Gemini. Do not put private client data in live test messages.
- Rate limits: 25 API operations/IP/10 minutes, 4 simultaneous model calls,
  default 500 chat turns/day (`CHAT_DAILY_LIMIT`); one validation-repair retry.
  These limits are process-local. Production with multiple workers needs a shared
  store and proxy-aware rate limiting. Memory resets when the server restarts.

## Verification, 12 September 2026

`node --test tests/octomask.test.mjs`: seven automated tests covering price
validation, invalid output, action claims, context, retries, missing provider,
concurrency, and actual contact delivery outcomes. Mail/journal are mocked.

`node tests/octomask-live.mjs`: paid provider smoke checks with synthetic text;
seven replies across pricing, multi-turn qualification, low budget/refusal,
appointment intent and instruction injection. All seven passed on the final run,
roughly 0.9–1.3 seconds each. This is a small smoke sample, not a conversion study
or a comprehensive jailbreak benchmark.

Browser verified: real answer + exact card, transcript persistence, mobile layout
at 390px, editable contact handoff. No test email or calendar booking was sent.

## Known operational blocker

The local Google service-account private key fails OpenSSL decoding/signing
(`ERR_OSSL_UNSUPPORTED`). The public Google Calendar appointment link supplied
by the owner is now the booking fallback used by OctoMask and contact.html:
`https://calendar.app.google/yybUurryQkpLmyCQ9`. The server-side availability
adapter remains fail-closed and does not claim to reserve a slot. No automatic
invitation email exists in this v2 calendar adapter.

No claim of improved conversion yet: measure qualified enquiries and completed
appointments on real traffic after deployment. Review anonymized failure patterns
and catalogue accuracy before extending scope or adding new commercial actions.
