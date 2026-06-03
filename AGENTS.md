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
| State | Vuex ^4.1 |
| Reactive | RxJS ^7.8 |
| Linting | ts-standard ^12.0 (Standard TS style) |
| Type check | vue-tsc ^2.2 |
| Hosting | Azure Static Web Apps |
| CI/CD | GitHub Actions (push → main) |
| Auth | GitHub OAuth via `better-auth` |
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
├── .env.example                        # VITE_GITHUB_CLIENT_ID
├── .github/workflows/                  # Azure SWA deploy on push main
├── public/
│   ├── favicon/                        # PWA favicon assets
│   └── images/                         # SVGs + WebPs (logo, icons, etc.)
└── src/
    ├── main.ts                         # App bootstrap (Vue + Vuex + Router)
    ├── App.vue                         # Root component (Header + RouterView)
    ├── router.ts                       # Routes: / → /home, /auth, /home, /:snippetId, /new
    ├── style.css                       # Global styles, dark/light mode
    ├── vite-env.d.ts
    ├── constants/
    │   ├── constants.ts                # EMBED_EDITOR URL, BUG_REPORT_URL, TAGS_COLORS
    │   └── endpoints.ts                # API_URL, GITHUB_AUTH_URL, GITHUB_REDIRECT_URL
    ├── interfaces/
    │   ├── snippet.interface.ts        # Snippet type
    │   └── user.interface.ts           # User type
    ├── lib/
    │   └── store.ts                    # Vuex store (user, snippets, allSnippets)
    ├── services/
    │   ├── auth.service.ts             # POST /auth?code= → setUser
    │   ├── snippets.service.ts         # GET /all, getSnippetsMock()
    │   └── mock-api/
    │       └── snippets.json           # 6 mock snippets (dev only, unused in prod)
    └── components/
        ├── Header.component.vue        # Nav: logo, back/create/bug/sign-in/sign-out, avatar
        ├── Auth.component.vue          # OAuth callback, stores session in localStorage
        ├── Home.component.vue          # Restores session, renders Search + SnippetsList
        ├── Search.component.vue        # Real-time client-side filter by title/desc/tags
        ├── SnippetsList.component.vue  # Fetches all snippets, renders 2-col card grid
        ├── Snippet.component.vue       # Detail view with embedded code editor
        ├── NewSnippet.component.vue    # Placeholder (not implemented)
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
- Mutations: `setUser`, `cleanUser`, `setSnippets`, `cleanSnippets`, `setAllSnippets`, `cleanAllSnippets`
- Actions mirror mutations (e.g., `store.dispatch('setUser', user)`)

### Styling
- Global styles in `src/style.css` (dark/light via `prefers-color-scheme`)
- Component-specific styles in `<style scoped>`
- Responsive breakpoint: max-width 480px
- Classes: `.disabled` for disabled buttons (opacity + pointer-events: none)
- Buttons: rounded corners (`.5rem`), hover scale (1.1), active opacity (0.6)

### Authentication
- Session stored as `localStorage.setItem('snippet-vault-session', btoa(JSON.stringify(user)))`
- Restored in Home component: `JSON.parse(atob(localStorage.getItem('snippet-vault-session')))`
- Sign-out: `store.dispatch('cleanUser')` + `localStorage.clear()`

### Known Issues / Technical Debt
1. Create button is hardcoded disabled (has both `class="disabled"` and `disabled` attr)
2. Snippet detail uses `window.location.pathname` instead of vue-router route params
3. `getSnippetsMock()` exported but unused in production
4. No error handling for API failures
5. No loading states on Snippet detail page
6. Search has no debounce/throttle
7. `noImplicitAny: false` in tsconfig disables strict type checking
8. No tests exist

---

## Commands

```bash
npm run dev       # Start Vite dev server (hot reload)
npm run build     # vue-tsc type check + vite build → dist/
npm run preview   # Preview production build locally
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GITHUB_CLIENT_ID` | Yes | GitHub OAuth App client ID |

Create `.env` from `.env.example` and set the value.

---

## Deployment

- **Trigger:** Push to `main` branch
- **Workflow:** `.github/workflows/azure-static-web-apps-icy-river-034716410.yml`
- **Azure resource:** `icy-river-034716410`
- **Build output:** `dist/`
- **Env vars passed as GitHub secrets:** `VITE_GITHUB_CLIENT_ID`

---

## Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | — | Redirects to `/home` |
| `/home` | HomeComponent | Main page (search + snippet grid) |
| `/auth` | AuthComponent | OAuth callback |
| `/:snippetId` | SnippetComponent | Snippet detail + embedded editor |
| `/new` | NewSnippetComponent | Create snippet (placeholder) |

---

## External Services

| Service | URL | Used For |
|---------|-----|----------|
| API | `https://api.geduma.com/snippet-vault` | Auth + snippet data |
| Code Editor | `https://code.geduma.com/embed` | Embedded snippet viewer |
| GitHub OAuth | `https://github.com/login/oauth/authorize` | Authentication |
| Bug Reports | `https://github.com/geduma/snippet-vault/issues/new/choose` | Bug reporting |

---

## Coding Guidelines for AI

1. **Component creation:** Name files `{Name}.component.vue`, use `<script setup lang="ts">`, add scoped styles
2. **State access:** Import store directly (`import { store } from '../lib/store'`), dispatch actions, don't commit mutations directly
3. **Routing:** Use `<RouterLink>` for navigation links, `useRouter().push()` for programmatic navigation
4. **API calls:** Add new functions to `src/services/`, follow existing fetch pattern
5. **Types:** Add interfaces in `src/interfaces/`, export and import as needed
6. **Constants:** Add endpoints to `endpoints.ts`, app constants to `constants.ts`
7. **Styling:** Plain CSS only, no Tailwind/Bootstrap, respect dark/light mode via `prefers-color-scheme`
8. **Test before completing:** Run `npm run build` to type-check and verify no errors
9. **No comments** in source code unless absolutely necessary for clarity
