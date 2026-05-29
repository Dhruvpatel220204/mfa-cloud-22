# 🔐 MFA Cloud Authentication (Supabase + React)

A modern **MFA security dashboard** built with **Vite + React + TypeScript + Supabase**.

It includes device tracking, session monitoring, login attempt history, **real Supabase MFA (TOTP)**, **server-side Email OTP via Edge Functions**, and an **RBAC-gated Admin Console** with audit logs.

## ✅ Features

- **Auth**
  - Email/password login + Google OAuth
  - **Supabase MFA (TOTP)** enrollment + verification
  - **Email OTP (server-side)** via Supabase Edge Functions
  - Backup recovery codes (stored in `profiles.backup_codes`)
- **Security telemetry**
  - Devices table (fingerprint + trust)
  - Login attempt history (Realtime alerts on failures)
  - Sessions table (active sessions, revoke)
- **Admin**
  - RBAC (`roles`, `user_roles`) + bootstrap “first admin”
  - Admin console (`/admin`) for users/roles, audit logs, login attempts
- **Audit logs**
  - `audit_logs` table + `write_audit_log()` helper

## 🧱 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, shadcn/ui, Tailwind
- **Backend**: Supabase Auth + Postgres + Realtime
- **Edge**: Supabase Edge Functions (Email OTP)

## 📦 Local setup

Install and run the app:

```bash
npm install
npm run dev
```

## 🗄️ Supabase setup

- Apply the migrations in `supabase/migrations/`.
- Deploy Edge Functions:
  - `supabase/functions/send-email-otp`
  - `supabase/functions/verify-email-otp`

### Email OTP provider (optional)

The `send-email-otp` function supports [Resend](https://resend.com/). Configure env vars in your Supabase project:

- `RESEND_API_KEY`
- `OTP_FROM_EMAIL`
- `SUPABASE_SERVICE_ROLE_KEY` (required for server-side inserts)

If `RESEND_API_KEY` is not set, the function still creates challenges so you can demo the flow.

## 🧭 App routes

- `/auth`: Sign in / Sign up + MFA verification step when required
- `/dashboard`: Security dashboard + TOTP enrollment + backup codes
- `/admin`: Admin console (RBAC protected)

## 🔑 Bootstrapping the first admin

On a fresh database, the first logged-in user can claim admin from `/admin` (one-time) using a safe RLS bootstrap policy.

