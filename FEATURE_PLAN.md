# Snippet Vault — Plan de Features

## Resumen

Implementación de creación, edición y eliminación de snippets, sistema de comentarios, perfiles de usuario, y visibilidad del creador en las tarjetas. Todo integrado con el editor de code.geduma.com y autenticación JWT.

---

## Fase 0: Backend (API)

### 0.1 Endpoints nuevos

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/snippets` | JWT | Crear snippet |
| GET | `/snippets/:id` | No | Obtener snippet con owner |
| PUT | `/snippets/:id` | JWT + owner | Editar snippet |
| DELETE | `/snippets/:id` | JWT + owner | Eliminar snippet |
| GET | `/users/:login/snippets` | No | Snippets de un usuario |
| GET | `/snippets/:id/comments` | No | Comentarios de un snippet |
| POST | `/snippets/:id/comments` | JWT | Crear comentario |
| PUT | `/comments/:id` | JWT + owner | Editar comentario |
| DELETE | `/comments/:id` | JWT + owner | Eliminar comentario |

### 0.2 Modelos de datos

```typescript
// Snippet actualizado
interface Snippet {
  _id: string
  group: string
  title: string
  description: string
  tags: string
  snippetValue: string
  _tags: Tag[]
  owner: {
    id: number
    login: string
    avatarUrl: string
  }
  createdAt: string
  updatedAt: string
}

// Comentario (nuevo)
interface Comment {
  _id: string
  snippetId: string
  content: string
  author: {
    id: number
    login: string
    avatarUrl: string
  }
  createdAt: string
  updatedAt: string
}
```

### 0.3 Auth flow actualizado

- `GET /auth?code=` ahora devuelve `{ user, token }`
- Frontend almacena user + token en `snippet-vault-session`
- Peticiones protegidas envían `Authorization: Bearer <token>`

### 0.4 Endpoints existentes por actualizar

- `GET /all` → incluir `owner` en cada snippet
- `GET /auth?code=` → incluir `token` JWT en la respuesta

---

## Fase 1: Auth — token handling (Frontend)

### 1.1 auth.service.ts

- Almacenar el token JWT devuelto por `/auth?code=`
- Guardar `{ user, token }` en localStorage (session actualizada)

### 1.2 api.service.ts (nuevo)

Helper que wrappea `fetch`:

```typescript
// api.service.ts
const api = {
  get: (url, auth = false) => { ... },
  post: (url, body, auth = false) => { ... },
  put: (url, body, auth = false) => { ... },
  del: (url, auth = false) => { ... }
}
```

- Si `auth = true`, agrega `Authorization: Bearer <token>` desde localStorage
- Manejo centralizado de errores HTTP (401, 403, 500)
- Retorna JSON parseado o lanza error con mensaje

### 1.3 Header.component.vue

- Sign-out: limpiar token + user de localStorage

---

## Fase 2: Crear snippet (/new)

### 2.1 SnippetForm.component.vue (nuevo)

Formulario reutilizable para crear y editar snippets.

**Modo creación:**
- Campos: título, descripción, tags (input separado por comas)
- Selector de lenguaje (html, css, javascript, typescript, etc.)
- Embed del editor de code.geduma.com (URL base vacía + `?lang={lenguaje}`)
  - El editor se carga en blanco
  - El usuario escribe código
  - La URL del embed cambia en tiempo real con el código cifrado
- Botón "Guardar": captura la URL actual del embed como `snippetValue` y envía POST `/snippets`
- Validación: título y snippetValue obligatorios
- Redirige a `/:snippetId` tras guardar

**Comportamiento del embed:**
- Usar un iframe con `src` apuntando al editor base
- El iframe cambia su `src` a medida que el usuario escribe
- Leer `iframe.contentWindow.location.href` para capturar la URL final (o mediante postMessage si aplica same-origin)

### 2.2 Header.component.vue

- Eliminar `class="disabled"` y `disabled` del botón Create
- Botón Create visible solo si `localUser.id !== 0`

### 2.3 router.ts

- Ruta `/new` ya existe, conectar al nuevo `SnippetFormComponent` en modo creación

### 2.4 NewSnippet.component.vue (reemplazar)

- Reemplazar contenido placeholder con `SnippetFormComponent`

---

## Fase 3: Editar snippet (/:id/edit)

### 3.1 SnippetForm.component.vue — Modo edición

- Recibe `snippetId` por prop o ruta
- Precarga: título, descripción, tags desde store (o fetch GET `/snippets/:id`)
- Embed del editor con URL inicial = `{EMBED_EDITOR}/{snippet.snippetValue}`
- Al guardar: captura la nueva URL del embed, envía PUT `/snippets/:id`
- Redirige a `/:snippetId` tras guardar

### 3.2 Snippet.component.vue

- Agregar botón "Edit" visible solo si `user.id === snippet.owner.id`
- Botón linkea a `/:snippetId/edit`

### 3.3 router.ts

- Nueva ruta `/:snippetId/edit` → `SnippetFormComponent` en modo edición

---

## Fase 4: Eliminar snippet

### 4.1 Snippet.component.vue

- Agregar botón "Delete" visible solo si `user.id === snippet.owner.id`
- Diálogo de confirmación: "Are you sure you want to delete this snippet?"
- Si confirma: DELETE `/snippets/:id` → redirige a `/home`

### 4.2 snippets.service.ts (actualizar)

- Agregar función `deleteSnippet(id)` que llama a DELETE

---

## Fase 5: Owner en tarjetas y detalle

### 5.1 SnippetsList.component.vue

- Mostrar en cada card: avatar (24x24) + login del owner
- Link al perfil del usuario: `RouterLink :to="'/user/' + snippet.owner.login"`

### 5.2 Snippet.component.vue

- Mostrar owner: avatar + login + fecha de creación
- Layout propuesto:
  ```
  Título
  Descripción
  Owner: [avatar] @login · created: fecha
  Tags
  [Edit] [Delete]  (si es owner)
  Editor embed
  CommentSection
  ```

---

## Fase 6: Sistema de comentarios

### 6.1 CommentSection.component.vue (nuevo)

Contenedor que integra formulario + lista de comentarios.

### 6.2 CommentForm.component.vue (nuevo)

- Textarea + botón "Submit"
- Visible solo si usuario logueado
- Si no logueado: mostrar "Sign in to comment"
- POST `/snippets/:id/comments` al enviar
- Limpiar textarea y refrescar lista tras éxito

### 6.3 CommentList.component.vue (nuevo)

- Lista vertical de comentarios
- Cada comentario muestra: avatar, login, fecha, contenido
- Botones Edit/Delete visibles solo si `user.id === comment.author.id`
- **Edit**: convierte el comentario en textarea inline, PUT `/comments/:id`
- **Delete**: confirmación + DELETE `/comments/:id`

### 6.4 Snippet.component.vue

- Renderizar `CommentSection` debajo del editor

### 6.5 comments.service.ts (nuevo)

```typescript
// comments.service.ts
export const getComments(snippetId): Promise<Comment[]>
export const createComment(snippetId, content): Promise<Comment>
export const updateComment(commentId, content): Promise<Comment>
export const deleteComment(commentId): Promise<void>
```

---

## Fase 7: Perfil de usuario (/user/:login)

### 7.1 UserProfile.component.vue (nuevo)

- Obtiene datos del usuario desde store/localStorage (GitHub info: avatar, login, name)
- Fetch GET `/users/:login/snippets` para mostrar sus snippets
- Reutiliza el mismo grid de SnippetsList (o exporta un layout compartido)
- Muestra:
  - Avatar grande
  - Nombre y login
  - Bio / información de GitHub (disponible en el user object)
  - Grid de snippets del usuario
- Si el perfil es del usuario logueado, mostrar botón "Create snippet"

### 7.2 Header.component.vue

- Avatar del usuario linkea a `/user/{localUser.login}`

### 7.3 router.ts

- Nueva ruta `/user/:login` → `UserProfileComponent`

---

## Fase 8: Limpieza y refinamiento

### 8.1 Seguridad

- Sanitizar contenido de comentarios antes de renderizar (evitar XSS)
- Validar en frontend que el usuario autenticado solo edite/elimine sus propios recursos

### 8.2 UX

- Loading states en formularios (submit button deshabilitado + spinner)
- Error handling: mostrar mensajes de error en la UI cuando falle create/edit/delete/comment
- Confirm dialog para todas las acciones destructivas

### 8.3 Navegación

- Redirigir a login si se intenta acceder a `/new` sin estar autenticado

---

## Resumen de componentes

| Componente | Archivo | Nuevo/Modificado |
|------------|---------|------------------|
| SnippetForm | `SnippetForm.component.vue` | Nuevo |
| CommentSection | `CommentSection.component.vue` | Nuevo |
| CommentForm | `CommentForm.component.vue` | Nuevo |
| CommentList | `CommentList.component.vue` | Nuevo |
| UserProfile | `UserProfile.component.vue` | Nuevo |
| Header | `Header.component.vue` | Modificado |
| Snippet | `Snippet.component.vue` | Modificado |
| SnippetsList | `SnippetsList.component.vue` | Modificado |
| NewSnippet | `NewSnippet.component.vue` | Reemplazado |
| Router | `router.ts` | Modificado |

## Resumen de servicios

| Servicio | Archivo | Nuevo/Modificado |
|----------|---------|------------------|
| API helper | `api.service.ts` | Nuevo |
| Auth | `auth.service.ts` | Modificado |
| Snippets | `snippets.service.ts` | Modificado |
| Comments | `comments.service.ts` | Nuevo |

## Resumen de rutas nuevas

| Ruta | Componente | Auth requerido |
|------|-----------|----------------|
| `/:snippetId/edit` | SnippetForm (edit) | Sí (owner) |
| `/user/:login` | UserProfile | No |

---

## Orden de implementación sugerido

```
Fase 0 (Backend API)
    ↓
Fase 1 (Token handling)
    ↓
Fase 2 (Crear snippet)
    ↓
Fase 5 (Owner en cards)
    ↓
Fase 3 (Editar snippet)
    ↓
Fase 4 (Eliminar snippet)
    ↓
Fase 6 (Comentarios)
    ↓
Fase 7 (Perfil usuario)
    ↓
Fase 8 (Limpieza)
```
