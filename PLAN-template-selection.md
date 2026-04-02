# Plan: Resume Template Pre-Selection Screen (Paid Feature)

## Overview

Add a template selection screen between the Welcome page and the Contact section. The user picks from 7 resume styles, sees a live preview with sample data, and their choice carries through the entire builder flow. Templates are a paid feature at **$3 per resume download** — users can browse and build for free, but must pay via Stripe Checkout before downloading the final PDF.

---

## Step 1: Define template registry

**File:** `lib/resume-templates.ts`

- Create a `ResumeTemplate` type with `id`, `name`, `description`, `isPaid: boolean`, and `previewComponent` fields.
- Export an array of 7 templates. The first one ("Classic") is free; the remaining 6 are paid:
  1. Classic (free)
  2. Modern
  3. Minimal
  4. Executive
  5. Creative
  6. Technical
  7. Compact
- Export hardcoded sample `ResumeData` (a fictional "Jane Doe") used for thumbnail previews on the selection screen.

## Step 2: Create per-template PDF components

**Files:** `components/resume/templates/classic.tsx`, `modern.tsx`, `minimal.tsx`, `executive.tsx`, `creative.tsx`, `technical.tsx`, `compact.tsx`

- Each file exports a React PDF `Document` component that accepts `ResumeData` and renders it in that template's style.
- The existing `MyResume` component becomes the "Classic" template (move its styles and layout into `classic.tsx`).
- Each template has its own `StyleSheet.create(...)` and layout logic.

## Step 3: Add `selectedTemplate` to the interview context

**File:** `lib/interview-context.tsx`

- Add `selectedTemplate: string` (defaults to `"classic"`) and `setSelectedTemplate` to the context.
- Add `hasPaid: boolean` (defaults to `false`) and `setHasPaid` to the context.
- This is what the rest of the app reads to decide which PDF component to render and whether to gate the download.

## Step 4: Add `"template"` to the section flow

**File:** `lib/resume-types.ts`

- Add `"template"` to the `InterviewSection` union, between `"welcome"` and `"contact"`.
- Add it to `sectionOrder` in `interview-context.tsx` so the progress bar accounts for it.

## Step 5: Build the template selection screen

**File:** `components/interview/sections/template-section.tsx`

- Display a grid of template cards (2-3 columns, scrollable).
- Each card shows:
  - Template name and short description.
  - A thumbnail preview rendered with `@react-pdf/renderer` using the sample data from Step 1.
  - A "Free" badge on Classic, a "$3" badge on paid templates.
  - A selected/unselected border state.
- Clicking a card calls `setSelectedTemplate(id)`.
- "Continue" button navigates to `"contact"`.
- "Back" button navigates to `"welcome"`.
- Users can select any template freely — payment is not required until download.

## Step 6: Wire up the interview flow

**File:** `components/interview/interview-flow.tsx`

- Add `case "template": return <TemplateSection />;` to `renderSection()`.

**File:** `components/interview/sections/welcome-section.tsx`

- Change "Let's Get Started" to navigate to `"template"` instead of `"contact"`.

**File:** `components/interview/sections/contact-section.tsx`

- Change `onBack` to navigate to `"template"` instead of `"welcome"`.

## Step 7: Stripe integration for paid downloads

### 7a: Install Stripe

- `pnpm add stripe @stripe/stripe-js`
- Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`.

### 7b: Create checkout API route

**File:** `app/api/checkout/route.ts`

- POST endpoint that receives `{ templateId }`.
- Validates the template is a paid one.
- Creates a Stripe Checkout Session in `payment` mode:
  - Product: the template name.
  - Price: $3.00 USD (one-time).
  - `success_url`: redirects back to the app with a `session_id` query param.
  - `cancel_url`: redirects back to the app.
- Returns the Checkout Session URL.

### 7c: Create webhook handler

**File:** `app/api/stripe-webhook/route.ts`

- Listens for `checkout.session.completed` events.
- Verifies the webhook signature using `STRIPE_WEBHOOK_SECRET`.
- On success, marks the session as paid. Since there's no database, the approach is:
  - The Checkout Session's `client_reference_id` contains a unique session token (generated client-side and stored in context).
  - The webhook writes the paid token to an in-memory `Set` (sufficient for single-instance; for production, use a database or Redis).

### 7d: Create payment verification route

**File:** `app/api/verify-payment/route.ts`

- GET endpoint that accepts a Stripe `session_id`.
- Retrieves the Checkout Session from Stripe and checks `payment_status === "paid"`.
- Returns `{ paid: true/false }`.

## Step 8: Gate the PDF download behind payment

**File:** `components/interview/sections/complete-section.tsx`

- The live PDF preview remains visible for all templates (paid or free) — the user can see their resume but not download it.
- The "Download PDF" button checks:
  - If the selected template is free (`"classic"`): download immediately.
  - If the selected template is paid and `hasPaid` is false: redirect to Stripe Checkout (call `/api/checkout`).
  - If the selected template is paid and `hasPaid` is true: download immediately.
- On return from Stripe (success URL with `session_id`): call `/api/verify-payment`, and if paid, set `hasPaid = true` in context and trigger the download automatically.

**File:** `components/interview/question-wrapper.tsx`

- The sidebar download link follows the same gating logic.

## Step 9: Use selected template throughout the app

**Files:** `components/interview/resume-preview.tsx`, `components/interview/question-wrapper.tsx`, `components/interview/sections/complete-section.tsx`

- Replace hardcoded `<MyResume resumeData={...} />` with a lookup:
  - Read `selectedTemplate` from context.
  - Find the matching template from the registry.
  - Render its component with the current `resumeData`.
- This applies to the live side preview, the PDF download link, and the final complete screen.

## Step 10: Clean up

- Remove the standalone `my-resume.tsx` export of `MyResume` and `resumeStyles` once the classic template replaces it.
- Remove `resume-pdf-document.tsx` if still unused.

---

## Payment UX flow

```
User selects paid template → Builds resume for free → Clicks "Download PDF"
  → Redirected to Stripe Checkout ($3) → Pays → Redirected back to app
  → Payment verified → PDF downloads automatically
```

- Users can switch templates at any point without paying.
- Payment is only required at the download step.
- The free "Classic" template never requires payment.

---

## File change summary

| File | Action |
|------|--------|
| `lib/resume-templates.ts` | New - template registry + sample data |
| `lib/resume-types.ts` | Edit - add `"template"` to section union |
| `lib/interview-context.tsx` | Edit - add `selectedTemplate`, `hasPaid` state |
| `components/resume/templates/classic.tsx` | New - extracted from `my-resume.tsx` |
| `components/resume/templates/modern.tsx` | New |
| `components/resume/templates/minimal.tsx` | New |
| `components/resume/templates/executive.tsx` | New |
| `components/resume/templates/creative.tsx` | New |
| `components/resume/templates/technical.tsx` | New |
| `components/resume/templates/compact.tsx` | New |
| `components/interview/sections/template-section.tsx` | New - selection screen |
| `components/interview/interview-flow.tsx` | Edit - add template case |
| `components/interview/sections/welcome-section.tsx` | Edit - navigate to template |
| `components/interview/sections/contact-section.tsx` | Edit - back goes to template |
| `components/interview/resume-preview.tsx` | Edit - use selected template |
| `components/interview/question-wrapper.tsx` | Edit - use selected template + payment gate |
| `components/interview/sections/complete-section.tsx` | Edit - use selected template + payment gate |
| `app/api/checkout/route.ts` | New - Stripe Checkout session creation |
| `app/api/stripe-webhook/route.ts` | New - Stripe webhook handler |
| `app/api/verify-payment/route.ts` | New - payment verification |
| `components/interview/my-resume.tsx` | Delete - replaced by templates/classic.tsx |
| `components/resume/resume-pdf-document.tsx` | Delete - unused dead code |
