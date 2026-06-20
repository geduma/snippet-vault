# Snippet Vault — Plan de Features

> ✅ = Implementado · Pendiente

## Resumen

Implementación de creación, edición y eliminación de snippets, sistema de comentarios, perfiles de usuario, y visibilidad del creador en las tarjetas. Integrado con el editor de code.geduma.com y autenticación vía GitHub OAuth.

---

## Fase 0: Backend (API) ✅

> El API ya cuenta con los endpoints necesarios. El campo `owner` es de tipo `String` (GitHub login).

### 0.1 Endpoints implementados

| Método | Ruta | Auth | Descripción | Estado |
|--------|------|------|-------------|--------|
| GET | `/snippet-vault/all` | No | Listar snippets | ✅ |
| GET | `/snippet-vault/:id` | No | Obtener snippet por ID | ✅ |
| POST | `/snippet-vault` | No | Crear snippet (requiere `owner`) | ✅ |
| PUT | `/snippet-vault/:id` | No | Editar snippet | ✅ |
| DELETE | `/snippet-vault/:id` | No | Eliminar snippet | ✅ |
| GET | `/snippet-vault/group/:group` | No | Filtrar por grupo | ✅ |

### 0.2 Modelo de datos actual

```typescript
interface Snippet {
  _id: string
  group: string
  title: string
  description: string
  tags: string
  snippetValue: string
  owner: string            // GitHub login
  _tags: Tag[]             // Computado en frontend
}
```

---

## Fase 1: Auth — token handling (Frontend) ⏳ Pendiente

> El auth actual funciona sin JWT. El API devuelve el user de GitHub vía `GET /snippet-vault/auth?code=`. El frontend almacena la sesión en localStorage.

### 1.1 auth.service.ts ⏳

- Actualmente almacena `user` en localStorage como `snippet-vault-session`
- Pendiente: almacenar token JWT cuando el API lo exponga

### 1.2 api.service.ts (nuevo) ⏳

Helper que wrappea `fetch`:

```typescript
const api = {
  get: (url, auth = false) => { ... },
  post: (url, body, auth = false) => { ... },
  put: (url, body, auth = false) => { ... },
  del: (url, auth = false) => { ... }
}
```

- Si `auth = true`, agrega `Authorization: Bearer <token>` desde localStorage
- Manejo centralizado de errores HTTP

---

## Fase 2: Crear snippet (/new) ✅

### 2.1 NewSnippet.component.vue ✅

Formulario funcional con campos:
- Título, descripción, tags (input separado por comas), group, snippetValue (textarea)
- Valida que el usuario esté autenticado (redirige a `/home` si no)
- Envía `owner: user.login` al crear
- Redirige a `/home` tras éxito
- Loading state en botón submit

### 2.2 Header.component.vue ✅

- Botón Create visible solo si `localUser.id !== 0`
- `disabled` removido (ya no está hardcodeado)

### 2.3 snippets.service.ts ✅

- Función `createSnippet()` → `POST /snippet-vault`

### 2.4 Pendiente para versión avanzada

- Integrar embed editor de code.geduma.com (iframe con edición en tiempo real)
- Selector de lenguaje que modifique la URL del embed

---

## Fase 3: Editar snippet (/:id/edit) ⏳ Pendiente

### 3.1 SnippetForm.component.vue ⏳

- Recibir `snippetId` por prop o ruta
- Precargar datos desde store o fetch
- PUT `/snippet-vault/:id` al guardar

### 3.2 Snippet.component.vue ⏳

- Botón "Edit" visible solo si `user.login === snippet.owner`

### 3.3 router.ts ⏳

- Nueva ruta `/:snippetId/edit`

---

## Fase 4: Eliminar snippet ✅

### 4.1 Snippet.component.vue ✅

- Botón "Delete" visible solo si `user.login === snippet.owner`
- Loading state mientras se elimina
- Redirige a `/home` tras éxito

### 4.2 snippets.service.ts ✅

- Función `deleteSnippet(id)` → `DELETE /snippet-vault/:id`

### 4.3 snippets.store.ts ✅

- Acción `removeSnippet(_id)` para limpiar del estado local

---

## Fase 5: Owner en tarjetas y detalle ⏳ Parcial

### 5.1 SnippetsList.component.vue ⏳

- Pendiente: mostrar avatar + login del owner en cada card
- Link al perfil: `/user/{login}`

### 5.2 Snippet.component.vue ✅ (parcial)

- Validación de ownership para mostrar botón Delete ✅
- Pendiente: mostrar avatar + login + fecha de creación

---

## Fase 6: Sistema de comentarios ⏳ Pendiente

### 6.1 CommentSection.component.vue ⏳

### 6.2 CommentForm.component.vue ⏳

### 6.3 CommentList.component.vue ⏳

### 6.4 Snippet.component.vue ⏳

### 6.5 comments.service.ts ⏳

---

## Fase 7: Perfil de usuario (/user/:login) ⏳ Pendiente

### 7.1 UserProfile.component.vue ⏳

### 7.2 Header.component.vue ⏳

### 7.3 router.ts ⏳

---

## Fase 8: Limpieza y refinamiento ✅ (parcial)

### 8.1 Seguridad ⏳

- Validar owner antes de acciones destructivas ✅
- Pendiente: sanitizar contenido, JWT

### 8.2 UX ✅

- Loading states en formularios (submit deshabilitado + spinner) ✅
- Error handling en create/delete ✅
- Confirmación en acciones destructivas ✅

### 8.3 Navegación ✅

- Redirigir a `/home` si se accede a `/new` sin autenticación ✅

---

## Resumen de componentes

| Componente | Archivo | Estado |
|------------|---------|--------|
| SnippetForm | `SnippetForm.component.vue` | ⏳ Pendiente |
| CommentSection | `CommentSection.component.vue` | ⏳ Pendiente |
| CommentForm | `CommentForm.component.vue` | ⏳ Pendiente |
| CommentList | `CommentList.component.vue` | ⏳ Pendiente |
| UserProfile | `UserProfile.component.vue` | ⏳ Pendiente |
| Header | `Header.component.vue` | ✅ Modificado |
| Snippet | `Snippet.component.vue` | ✅ Modificado |
| SnippetsList | `SnippetsList.component.vue` | ✅ Modificado |
| NewSnippet | `NewSnippet.component.vue` | ✅ Reemplazado |

## Resumen de servicios

| Servicio | Archivo | Estado |
|----------|---------|--------|
| API helper | `api.service.ts` | ⏳ Pendiente |
| Auth | `auth.service.ts` | ⏳ Pendiente |
| Snippets | `snippets.service.ts` | ✅ Modificado |
| Comments | `comments.service.ts` | ⏳ Pendiente |

