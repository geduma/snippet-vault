# Snippet Vault — AI Agents Guide

## Project Overview

SPA for browsing, searching, and viewing code snippets. Built with Vue 3 + TypeScript + Vite, deployed to Azure Static Web Apps.

**Domain:** https://snippet.geduma.com  
**Repository:** https://github.com/geduma/snippet-vault

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API, `<script setup>` SFCs) |
| Language | TypeScript ~5.7 |
| Build | Vite ^6.2 |
| Routing | vue-router ^4.5 (HTML5 history) |
| State | Pinia ^3.0 |
| Reactive | RxJS ^7.8 |
| Linting | ts-standard ^12.0 (Standard TS style) |
| Type check | vue-tsc ^2.2 |
| Hosting | Azure Static Web Apps |
| CI/CD | GitHub Actions (push → main) |
| Auth | Geduma Auth (OAuth centralizado: GitHub) |
| Fonts | Montserrat Alternates (Google Fonts) |

---

## Project Structure

```
snippet-vault/
├── index.html                          # Vite HTML entry
├── vite.config.ts                      # Vite config (vue plugin only)
├── tsconfig.json                       # Strict TS, ES2022 target
├── staticwebapp.config.json            # SPA fallback rewrite → index.html
├── package.json
├── .env.example                        # VITE_APP_ID
├── .github/workflows/                  # Azure SWA deploy on push main
├── public/
│   ├── favicon/                        # PWA favicon assets
│   └── images/                         # SVGs + WebPs (logo, icons, etc.)
└── src/
    ├── main.ts                         # App bootstrap (Vue + Pinia + Router)
    ├── App.vue                         # Root component (Header + RouterView)
    ├── router.ts                       # Routes: / → /home, /auth, /home, /:snippetId, /new
    ├── style.css                       # Global styles, dark/light mode
    ├── vite-env.d.ts
    ├── constants/
    │   ├── constants.ts                # EMBED_EDITOR URL, BUG_REPORT_URL, TAGS_COLORS
    │   └── endpoints.ts                # API_URL, SNIPPET_VAULT_URL, LOGIN_URL, SESSION_URL, APP_ID
    ├── interfaces/
    │   ├── snippet.interface.ts        # Snippet type
    │   └── user.interface.ts           # User type
    ├── stores/
    │   ├── user.store.ts               # Pinia store (user state)
    │   └── snippets.store.ts           # Pinia store (snippets state)
    ├── services/
    │   ├── auth.service.ts             # login() + getSession() para Geduma Auth
    │   └── snippets.service.ts         # CRUD contra /snippet-vault/
    └── components/
        ├── Header.component.vue        # Nav: logo, back/create/bug/sign-in/sign-out, avatar
        ├── Auth.component.vue          # OAuth callback, stores session in localStorage
        ├── Home.component.vue          # Restores session, renders Search + SnippetsList
        ├── Search.component.vue        # Real-time client-side filter by title/desc/tags
        ├── SnippetsList.component.vue  # Fetches all snippets, renders 2-col card grid
        ├── Snippet.component.vue       # Detail view with embedded code editor
        ├── NewSnippet.component.vue    # Create snippet form with embed editor
        └── shared/
            └── Spinner.component.vue   # Full-screen CSS loader overlay
```

---

## Key Conventions

### Naming
- **Files:** PascalCase with `.component.vue` suffix for components (e.g., `Header.component.vue`)
- **Interfaces:** PascalCase in dedicated files under `interfaces/`
- **Services:** camelCase functions in `services/`
- **Constants:** PascalCase objects in `constants/`
- **Store:** Vuex with `set`/`clean` mutation/action pairs

### Component Patterns
- All components use `<script setup lang="ts">` (Composition API)
- Scoped styles in `<style scoped>`
- No external component libraries (plain CSS)
- Router links via `<RouterLink>` or `$router.push()`
- Vuex store accessed directly via `import { store } from '../lib/store'`

### State Management
- `store.state.user` — current authenticated user (empty object `{}` when not logged in)
- `store.state.allSnippets` — complete snippet list (never mutated after load)
- `store.state.snippets` — filtered snippet list (updated by search)
- Actions: `setUser`, `cleanUser`, `setSnippets`, `cleanSnippets`, `setAllSnippets`, `cleanAllSnippets`
- Access via Pinia `useXxxStore()` composables (e.g., `useUserStore().setUser(user)`)

### Styling
- Global styles in `src/style.css` (dark/light via `prefers-color-scheme`)
- Component-specific styles in `<style scoped>`
- Responsive breakpoint: max-width 480px
- Classes: `.disabled` for disabled buttons (opacity + pointer-events: none)
- Buttons: rounded corners (`.5rem`), hover scale (1.1), active opacity (0.6)

### Authentication
- Login via Geduma Auth: `POST /auth/login/{appId}/prov_github` → redirect to GitHub → callback with `session_token` (vía hash fragment)
- Session fetched via `GET /auth/session/{sessionToken}` (single-use, expires in 15 min)
- Session stored as `localStorage.setItem('snippet-vault-session', btoa(JSON.stringify(user)))`
- Restored in Home component: `JSON.parse(atob(localStorage.getItem('snippet-vault-session')))`
- Sign-out: `useUserStore().cleanUser()` + `localStorage.clear()`
- Avatars generated via DiceBear Pixel Art: `https://api.dicebear.com/7.x/pixel-art/svg?seed={email}`

### Known Issues / Technical Debt
1. Create button is hardcoded disabled (has both `class="disabled"` and `disabled` attr)
2. Snippet detail uses `window.location.pathname` instead of vue-router route params
3. No error handling for API failures
4. No loading states on Snippet detail page
5. Search has no debounce/throttle
6. `noImplicitAny: false` in tsconfig disables strict type checking

---

## Commands

```bash
npm run dev       # Start Vite dev server (hot reload)
npm run build     # vue-tsc type check + vite build → dist/
npm run preview   # Preview production build locally
npm run test      # Run Vitest tests
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_APP_ID` | Yes | Geduma Auth app ID (formato: `app_xxx`) |

Create `.env` from `.env.example` and set the value.

---

## Deployment

- **Trigger:** Push to `main` branch
- **Workflow:** `.github/workflows/azure-static-web-apps-icy-river-034716410.yml`
- **Azure resource:** `icy-river-034716410`
- **Build output:** `dist/`
- **Env vars passed as GitHub secrets:** `VITE_APP_ID`

---

## Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | — | Redirects to `/home` |
| `/home` | HomeComponent | Main page (search + snippet grid) |
| `/auth` | AuthComponent | OAuth callback |
| `/:snippetId` | SnippetComponent | Snippet detail + embedded editor |
| `/new` | NewSnippetComponent | Create snippet form with embed editor |

---

## API Reference

Base URL: `https://api.geduma.com/snippet-vault`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/snippet-vault/` | No | Health check |
| GET | `/snippet-vault/all` | No | List all snippets |
| GET | `/snippet-vault/group/:group` | No | Filter by group |
| GET | `/snippet-vault/:id` | No | Get by ID |
| POST | `/snippet-vault` | No | Create `{ group?, title, description, snippetValue, owner, tags? }` |
| PUT | `/snippet-vault/:id` | No | Update snippet (supports owner) |
| DELETE | `/snippet-vault/:id` | No | Delete snippet |

Auth endpoints (Geduma Auth):

| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/providers/{appId}` | List enabled providers |
| POST | `/auth/login/{appId}/{providerId}` | Init login, returns redirect URL |
| GET | `/auth/session/{sessionToken}` | Get user session (single-use) |

---

## External Services

| Service | URL | Used For |
|---------|-----|----------|
| API | `https://api.geduma.com` | Auth (geduma-auth) + snippet data (snippet-vault) |
| Code Editor | `https://code.geduma.com/embed` | Embedded snippet viewer |
| GitHub OAuth | `https://github.com/login/oauth/authorize` | Authentication (via Geduma Auth) |
| Bug Reports | `https://github.com/geduma/snippet-vault/issues/new/choose` | Bug reporting |

---

## Coding Guidelines for AI

1. **Component creation:** Name files `{Name}.component.vue`, use `<script setup lang="ts">`, add scoped styles
2. **State access:** Import store directly (`import { useUserStore } from '../stores/user.store'`), call actions directly (e.g., `userStore.setUser(user)`)
3. **Routing:** Use `<RouterLink>` for navigation links, `useRouter().push()` for programmatic navigation
4. **API calls:** Add new functions to `src/services/`, follow existing fetch pattern
5. **Types:** Add interfaces in `src/interfaces/`, export and import as needed
6. **Constants:** Add endpoints to `endpoints.ts`, app constants to `constants.ts`
7. **Styling:** Plain CSS only, no Tailwind/Bootstrap, respect dark/light mode via `prefers-color-scheme`
8. **Test before completing:** Run `npm run build` to type-check and verify no errors
9. **No comments** in source code unless absolutely necessary for clarity
