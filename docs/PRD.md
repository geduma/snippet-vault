# Snippet Vault — Product Requirements Document

## 1. Overview

Snippet Vault is a web application for browsing, searching, and viewing code snippets. It allows authenticated users to explore a curated library of reusable UI components and code patterns, with an embedded code editor for preview. The app is deployed as a static SPA on Azure Static Web Apps.

### Domain
**Production URL:** https://snippet.geduma.com  
**API:** https://api.geduma.com  
**Code Editor:** https://code.geduma.com/embed

### Repository
https://github.com/geduma/snippet-vault

---

## 2. Target Audience

- Frontend and full-stack developers looking for reusable code snippets
- Developers who prefer visual browsing of categorized code patterns
- Users of the `geduma.com` ecosystem

---

## 3. User Personas

| Persona | Description |
|---------|-------------|
| **Visitor** | Lands on the site, can browse and search snippets, no authentication required |
| **Authenticated User** | Signs in via Geduma Auth (GitHub OAuth), same browsing experience, future ability to create snippets |
| **Admin / Owner** | Manages the snippet database via the backend API |

---

## 4. Features

### 4.1 Core Features (Implemented)

| Feature | Description | Status |
|---------|-------------|--------|
| Browse snippets | 2-column grid of snippet cards with title, description, and tags | ✅ Done |
| Search snippets | Real-time client-side filtering by title, description, or tag name | ✅ Done |
| View snippet detail | Dedicated page showing full description, tags, and embedded code editor | ✅ Done |
| Geduma Auth | Sign-in via Geduma Auth (GitHub OAuth centralizado) | ✅ Done |
| Session persistence | User session stored in localStorage as base64-encoded JSON | ✅ Done |
| Responsive design | Grid collapses to single column on mobile | ✅ Done |
| Dark/light mode | Respects OS color scheme preference | ✅ Done |
| Bug reporting | Link to GitHub Issues for bug reports | ✅ Done |

### 4.2 Features (Planned / Partial)

| Feature | Description | Status |
|---------|-------------|--------|
| Create snippet | Form to create new snippets and push to the API | 🚧 Placeholder only |
| Snippet editing | Edit existing snippets | 📋 Future |
| Snippet deletion | Remove snippets from the library | 📋 Future |
| User-specific snippets | Show only the current user's snippets | 📋 Future |
| Favorites / Bookmarks | Save snippets for quick access | 📋 Future |
| Pagination / Infinite scroll | Handle large snippet libraries | 📋 Future |
| Snippet categories | Browse by group/category | 📋 Future |

---

## 5. User Flows

### 5.1 Authentication Flow
```
1. User clicks "Sign in" button in the header
2. Frontend calls POST /auth/login/{appId}/prov_github → receives redirect URL
3. User redirected to GitHub OAuth (https://github.com/login/oauth/authorize)
4. GitHub redirects back to Geduma API → API redirects to /auth#session_token={uuid}
5. Auth component reads session_token, calls GET /auth/session/{sessionToken}
6. User data stored in localStorage as btoa(JSON.stringify(user))
7. Redirected to /home
```

### 5.2 Browsing Flow
```
1. User lands on /home
2. SnippetsListComponent fetches all snippets from API (/snippet-vault/all)
3. Snippets rendered as a 2-column card grid
4. Each card shows title, description, and colored tags
5. Clicking a card navigates to /:snippetId
```

### 5.3 Search Flow
```
1. User types in the search input
2. On each keystroke (with 300ms debounce), filterSnippet() runs
3. Filters allSnippets by title, description, or tag name (case-insensitive)
4. Filtered results update the Pinia store and re-render the grid
```

### 5.4 Snippet Detail Flow
```
1. User clicks a snippet card
2. Router navigates to /:snippetId
3. Snippet looked up from Pinia store by _id
4. Page renders title, description, colored tags
5. Code editor embedded via <embed> pointing to code.geduma.com/embed/{snippetValue}
6. Redirects to /home if no snippets loaded or ID not found
```

---

## 6. Technical Architecture

### 6.1 Frontend
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Language:** TypeScript
- **Build Tool:** Vite 6
- **Routing:** vue-router 4 (HTML5 history mode)
- **State Management:** Pinia 3
- **Reactive Extensions:** RxJS 7
- **Styling:** Plain CSS (no framework), Montserrat Alternates font

### 6.2 Backend (External)
- **API Base URL:** `https://api.geduma.com`
- Endpoints used:
  - `POST /auth/login/{appId}/{providerId}` — Init login, returns redirect URL
  - `GET /auth/session/{sessionToken}` — Get user session (single-use)
  - `GET /snippet-vault/all` — Fetch all snippets
  - `POST /snippet-vault` — Create snippet
  - `DELETE /snippet-vault/:id` — Delete snippet
- The frontend does NOT host any backend logic.

### 6.3 Infrastructure
- **Hosting:** Azure Static Web Apps
- **CI/CD:** GitHub Actions (push to `main` triggers build + deploy)
- **Auth:** Geduma Auth (OAuth centralizado, GitHub provider)

### 6.4 External Dependencies
| Service | URL | Purpose |
|---------|-----|---------|
| Geduma Auth | api.geduma.com | Authentication (GitHub OAuth centralizado) |
| Code Editor | code.geduma.com | Embedded snippet viewer |
| Google Fonts | fonts.googleapis.com | Montserrat Alternates font |

---

## 7. Data Model

### Snippet
```typescript
interface Snippet {
  _id: string
  group: string
  title: string
  description: string
  tags: string          // Comma-separated tag names
  snippetValue: string  // Base64-encoded, pipe-delimited code data
  _tags: Tag[]          // Computed client-side from tags string
}

interface Tag {
  name: string
  color: string         // Hex color from TAGS_COLORS constant
}
```

### User
```typescript
interface User {
  id: string
  email: string
  displayName: string
  avatarUrl: string        // Generated via DiceBear Pixel Art
}
```

---

## 8. Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| Performance | Search filters client-side instantly; no debounce/throttle implemented |
| Responsiveness | Single-column layout on mobile (≤480px), 2-column on desktop |
| Accessibility | Basic semantic HTML, no ARIA attributes |
| SEO | SPA with no SSR; relies entirely on client-side rendering |
| Browser support | Modern browsers (ES2022+), no IE support |
| Security | OAuth via Geduma Auth, single-use session tokens (15 min TTL); session stored in localStorage |
| Offline support | None currently |

---

## 9. Constraints & Limitations

1. **Create button** is always disabled — feature not yet implemented
2. **No error boundaries** — API failures cause unhandled errors
3. **No loading states** for snippet detail page (Snippet component assumes data exists)
4. **Search has no debounce** — filters on every keystroke
5. **Snippet detail** uses `window.location.pathname` instead of router params
6. **No pagination** — all snippets loaded at once

---

## 10. Future Roadmap

1. Implement snippet creation (form → API POST)
2. Add error handling and user-friendly error messages
3. Add loading skeletons / better loading states
4. Add snippet editing and deletion
5. Add user-specific snippet management
6. Add pagination or infinite scroll
7. Add debounce to search input
8. Add PWA support (service worker, manifest)
9. Accessibility improvements

---

## 11. Glossary

| Term | Definition |
|------|------------|
| Snippet | A code pattern stored in the vault with title, description, tags, and code content |
| Vault | The collection/database of all code snippets |
| Code Editor | External embedded app at code.geduma.com that renders the snippet code |
| Group | Logical grouping of snippets (e.g., "ui-components", "template") |
| Tag | A label for categorizing snippets (e.g., "html", "javascript", "css") |
