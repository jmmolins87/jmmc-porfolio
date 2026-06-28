# User Authentication System Design

## Overview

Replace the current single-user env-var-based auth with a multi-user database-backed system. Add login page improvements (logo, forgot password flow), user management in dashboard, and role-based access control (Admin/Editor).

## Current State

- **Auth**: Single user via `BLOG_USER`/`BLOG_PASSWORD` env vars
- **DB**: Neon Postgres with `posts` and `contactMessages` tables (Drizzle ORM)
- **Login**: Simple form, "forgot password" shows toast with email
- **Dashboard**: Only "Blog" card, no user management

## Goals

1. Multi-user support with database-backed credentials
2. Role-based access: Admin (full access) + Editor (blog only)
3. Public forgot password flow from login page
4. User management from dashboard (Admin only)
5. Secure password storage with bcrypt hashing

---

## 1. Database Schema

### New `users` table

```typescript
// src/db/schema.ts
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'editor'] }).default('editor').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

- `username`: unique, used for login
- `email`: unique, used for identification
- `passwordHash`: bcrypt hash of password (cost factor 10)
- `role`: `admin` or `editor`

### Migration

- Run `drizzle-kit generate` to create migration SQL
- Apply via `drizzle-kit push` or Vercel build step

---

## 2. Auth System Changes

### `src/lib/auth.ts`

**Current**: `validateCredentials()` compares against env vars.
**New**: Query DB by username, compare bcrypt hash.

```typescript
export async function validateCredentials(username: string, password: string): Promise<{ valid: boolean; user?: { id: string; username: string; role: string } }> {
  const user = await db.query.users.findFirst({ where: eq(users.username, username) });
  if (!user) return { valid: false };
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return { valid: false };
  return { valid: true, user: { id: user.id, username: user.username, role: user.role } };
}
```

**JWT token payload**: Add `role` field.

```typescript
export async function createToken(username: string, role: string): Promise<string> {
  return new SignJWT({ username, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getSecret());
}
```

**`verifyToken`**: Returns `{ username, role }`.

### `src/middleware.ts`

- Add role check: Admin routes (`/dashboard/users`) require `role === 'admin'`
- Protected routes remain the same

---

## 3. API Endpoints

### `POST /api/login` (updated)

- Reads FormData: `username`, `password`
- Queries DB, validates bcrypt hash
- Sets `auth-token` cookie with JWT containing `{ username, role }`
- Returns 200 with `{ success: true }` or 401

### `POST /api/forgot-password` (new, public)

- Reads JSON body: `{ username, newPassword }`
- Validates: username exists in DB
- Hashes new password with bcrypt
- Updates `password_hash` in DB
- Returns 200 `{ success: true }` always (regardless of user existence — prevents username enumeration)

### `POST /api/users` (new, admin only)

- Requires valid auth token with `role === 'admin'`
- Reads JSON body: `{ username, email, password }`
- Validates: username/email not taken, password meets minimum length
- Hashes password, creates user in DB
- Returns 201 with created user (without password hash)

### `GET /api/users` (new, admin only)

- Returns list of all users (without password hashes)

### `DELETE /api/users/[id]` (new, admin only)

- Deletes user by ID
- Prevents self-deletion

---

## 4. Login Page (`src/components/LoginForm.tsx`)

### Visual Flow

```
┌─────────────────────────┐
│      [Logo JMMC]        │
│   Acceso al Dashboard   │
│                         │
│  ┌───────────────────┐  │
│  │ Usuario           │  │
│  │ [_____________]   │  │
│  │                   │  │
│  │ Contraseña        │  │
│  │ [_____________] 👁│  │
│  │                   │  │
│  │  ¿Olvidaste tu    │  │
│  │  contraseña?      │  │
│  │                   │  │
│  │    [ Entrar ]     │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### State Machine

- `view: 'login' | 'forgot'` — controls which form is shown
- Login form: username + password + submit + forgot link
- Forgot form: username + new password + confirm password + submit + back link

### Transitions

- "¿Olvidaste tu contraseña?" → sets `view = 'forgot'`
- "Volver al login" → sets `view = 'login'`
- Successful login → redirect to `/dashboard/blog`
- Successful forgot password → show success toast, return to login view

### Validation

- Login: username required, password required
- Forgot: username required, new password min 8 chars, confirm must match
- Error toasts for: invalid credentials, user not found, passwords don't match

### Localization

Add i18n keys for:
- `login.forgotTitle`: "Restablecer contraseña" / "Reset password"
- `login.newPassword`: "Nueva contraseña" / "New password"
- `login.confirmPassword`: "Repetir contraseña" / "Confirm password"
- `login.forgotSuccess`: "Contraseña actualizada" / "Password updated"
- `login.forgotError`: "Error al actualizar" / "Error updating password"
- `login.passwordMismatch`: "Las contraseñas no coinciden" / "Passwords don't match"
- `login.passwordTooShort`: "Mínimo 8 caracteres" / "Minimum 8 characters"
- `login.backToLogin`: "Volver al login" / "Back to login"

---

## 5. Dashboard User Management

### New page: `/dashboard/users/index.astro`

- Uses `DashboardLayout`
- Lists all users in a table (username, email, role, created date)
- "Add User" button opens modal or navigates to create page

### New page: `/dashboard/users/new.astro`

- Form: username, email, password, confirm password
- Submit → `POST /api/users`
- On success → redirect to `/dashboard/users`

### New page: `/dashboard/users/[id]/edit.astro`

- Edit user details (username, email, role)
- Optional password change
- Delete user button (with confirmation)

### Dashboard index update

Add second card "Usuarios" (visible only to admin):

```astro
<a href="/dashboard/users" class="block p-6 rounded-2xl border...">
  <h2 class="text-lg font-semibold mb-2">Usuarios</h2>
  <p class="text-sm text-muted-foreground">Gestionar usuarios del sistema</p>
</a>
```

---

## 6. Seed Script

### `src/db/seed.ts` (updated)

- Check if admin user exists
- If not, create: `juanma` / `07870787!Jm` / role `admin`
- Hash password with bcrypt

---

## 7. Security Considerations

- Passwords hashed with bcrypt (cost factor 10)
- JWT tokens httpOnly, secure, sameSite lax, 7-day expiry
- Forgot password: always returns success (prevents username enumeration)
- Admin-only routes protected in middleware
- Self-deletion prevention
- CSRF protection via sameSite cookies

---

## 8. Files to Create/Modify

### New files
- `src/pages/api/forgot-password.ts`
- `src/pages/api/users/index.ts`
- `src/pages/api/users/[id].ts`
- `src/pages/dashboard/users/index.astro`
- `src/pages/dashboard/users/new.astro`
- `src/pages/dashboard/users/[id]/edit.astro`
- `src/components/UserForm.tsx`
- `src/components/UserList.tsx`

### Modified files
- `src/db/schema.ts` — add `users` table
- `src/db/index.ts` — no changes needed
- `src/db/seed.ts` — add admin user seed
- `src/lib/auth.ts` — DB-based validation, bcrypt, role in JWT
- `src/middleware.ts` — add role-based protection
- `src/pages/api/login.ts` — use new auth
- `src/pages/api/login.test.ts` — update tests
- `src/components/LoginForm.tsx` — logo, forgot password flow
- `src/pages/dashboard/index.astro` — add users card
- `src/layouts/DashboardLayout.astro` — no changes needed
- `src/lib/i18n.ts` — add new keys
- `src/i18n/es.json` — add new keys
- `src/i18n/en.json` — add new keys

### Dependencies
- `bcryptjs` (pure JS, no native deps) for password hashing
