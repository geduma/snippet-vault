# Snippet Vault

SPA for browsing, searching, and viewing code snippets. Built with Vue 3 + TypeScript + Vite, deployed to Azure Static Web Apps.

**Domain:** https://snippet.geduma.com  
**API:** https://api.geduma.com  
**Repository:** https://github.com/geduma/snippet-vault

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript |
| Build | Vite |
| Routing | vue-router (HTML5 history) |
| State | Pinia |
| Reactive | RxJS |
| Testing | Vitest |
| Hosting | Azure Static Web Apps |
| Auth | Geduma Auth (GitHub OAuth) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check and build
npm run build

# Run tests
npm run test
```

### Environment Variables

Create `.env` from `.env.example` with:

| Variable | Description |
|----------|-------------|
| `VITE_APP_ID` | Geduma Auth app ID (`app_xxx`) |

---

## Project Structure

```
src/
├── main.ts                    # App bootstrap
├── App.vue                    # Root component
├── router.ts                  # Routes config
├── style.css                  # Global styles (dark/light)
├── constants/
│   ├── constants.ts           # EMBED_EDITOR, BUG_REPORT_URL, TAGS_COLORS
│   └── endpoints.ts           # API URL, auth/snippet paths, APP_ID
├── interfaces/
│   ├── snippet.interface.ts   # Snippet type
│   └── user.interface.ts      # User type
├── stores/
│   ├── user.store.ts          # Pinia store (user state)
│   └── snippets.store.ts      # Pinia store (snippets state)
├── services/
│   ├── auth.service.ts        # login() + getSession()
│   └── snippets.service.ts    # CRUD against /snippet-vault/
└── components/
    ├── Header.component.vue
    ├── Auth.component.vue
    ├── Home.component.vue
    ├── Search.component.vue
    ├── SnippetsList.component.vue
    ├── Snippet.component.vue
    ├── NewSnippet.component.vue
    └── shared/
        └── Spinner.component.vue
```

---

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | — | Redirects to `/home` |
| `/home` | HomeComponent | Search + snippet grid |
| `/auth` | AuthComponent | OAuth callback |
| `/:snippetId` | SnippetComponent | Detail + embedded editor |
| `/new` | NewSnippetComponent | Create snippet |

---

## API

Snippet CRUD: `https://api.geduma.com/snippet-vault/{path}`  
Auth (Geduma Auth): `https://api.geduma.com/auth/{path}`

---

## Deployment

Push to `main` → GitHub Actions builds and deploys to Azure Static Web Apps.
