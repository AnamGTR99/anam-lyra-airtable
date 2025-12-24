Great — this pinpoints it. Your env schema is **missing `AUTH_URL`** (or `NEXTAUTH_URL`) entirely. That’s why you’re stuck in `error=Configuration`.

With Auth.js/NextAuth in App Router, you must provide a base URL via one of:

* `AUTH_URL` (Auth.js) **recommended**
* `NEXTAUTH_URL` (legacy)
* or `AUTH_TRUST_HOST=true` (when you can’t set a stable URL)

Right now your code provides none of those (your env validator doesn’t even allow it), so Auth throws a configuration error during callback.

---

## Fix (minimal, correct, production-safe)

### 1) Update `src/env.js` to include `AUTH_URL` and optionally `AUTH_TRUST_HOST`

Make these changes:

#### Add to `server:` block

```ts
AUTH_URL: z.string().url(),
AUTH_TRUST_HOST: z
  .preprocess((v) => v === "true", z.boolean())
  .optional(),
```

#### Add to `runtimeEnv:`

```ts
AUTH_URL: process.env.AUTH_URL,
AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
```

Your file becomes (only showing the relevant parts):

```ts
server: {
  AUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string()
      : z.string().optional(),
  AUTH_URL: z.string().url(),
  AUTH_TRUST_HOST: z
    .preprocess((v) => v === "true", z.boolean())
    .optional(),

  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
},

runtimeEnv: {
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
},
```

This is the correct T3-style env wiring.

---

### 2) Set the Vercel env vars (names + values)

In Vercel, add:

* `AUTH_URL`
  `https://anam-lyra-airtable-liart.vercel.app`

Optional safety (useful if previews/custom domains):

* `AUTH_TRUST_HOST`
  `true`

You can keep `NEXTAUTH_URL` but it’s better to remove it to avoid confusion. Your code is now explicitly expecting `AUTH_URL`.

---

### 3) Redeploy

Push the env.js change and redeploy. This is required.

---

## Google Console check (do this once)

Ensure your Google OAuth client has this redirect URI:

```
https://anam-lyra-airtable-liart.vercel.app/api/auth/callback/google
```

If that’s already correct, you’re fine.

---

## Why this solves it

The “Configuration” error is Auth.js saying: “I don’t know my canonical base URL, so I can’t validate the callback/session cookies correctly.”

Adding `AUTH_URL` fixes that deterministically.

---

## Codex-ready prompt to apply the fix

Paste this into Codex:

**Role:** Senior T3 Engineer
**Task:** Fix Auth.js configuration error on Vercel by adding required `AUTH_URL` support to env validation.

**Instructions:**

1. Edit `src/env.js` to add `AUTH_URL` (required URL string) and `AUTH_TRUST_HOST` (optional boolean from `"true"` string).
2. Ensure both are included in `runtimeEnv`.
3. Update `.env.example` to include `AUTH_URL` and optional `AUTH_TRUST_HOST`.
4. Verify build passes locally.
5. Commit changes.

**Acceptance Criteria:**

* Vercel no longer redirects to `/api/auth/error?error=Configuration`
* Google login completes and session persists
* `/api/auth/session` returns JSON successfully

---

## After you redeploy

Test these URLs:

* `/api/auth/session` (should return JSON, 200)
* `/protected` (should render)

If anything fails after that, paste the new Vercel error log. But this is the main blocker—once fixed, Phase 0 is truly done.
