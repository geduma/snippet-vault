# Snippet Vault — Plan de Implementación

## Fase 1: Correcciones inmediatas

### 1.1 Snippet.vue — usar `useRoute()` en vez de `window.location.pathname`

- **Archivo:** `src/components/Snippet.component.vue`
- **Qué:**
  - Reemplazar `window.location.pathname.split('/').pop()` por `route.params.snippetId`
  - Reemplazar `window.location.href = '/home'` por `router.push('/home')`
  - Importar `useRoute` y `useRouter` de `vue-router`
- **Por qué:** El pathname ignora el router; si cambia el patrón de ruta se rompe. Usar el router garantiza consistencia.

### 1.2 Search — agregar debounce de 300ms

- **Archivo:** `src/components/Search.component.vue`
- **Qué:**
  - Importar `watch` de Vue
  - Agregar un `watch` sobre `searchQuery` con `setTimeout` / `clearTimeout` de 300ms
  - Llamar a `filterSnippet` solo cuando el timeout se cumpla
- **Por qué:** Evita re-filtrar en cada keystroke, mejora rendimiento con colecciones grandes.

### 1.3 Error handling básico en servicios

- **Archivos:** `src/services/snippets.service.ts`, `src/components/SnippetsList.component.vue`
- **Qué:**
  - En `getAllSnippets`: capturar error y propagarlo como un objeto con `{ error: true, message }`
  - En `SnippetsList`: mostrar mensaje de error al usuario si la respuesta contiene error
  - Opcional: agregar un state `error` reactivo en el componente
- **Por qué:** Hoy un fallo de red deja la app en blanco sin feedback.

### 1.4 Loading state en Snippet detail

- **Archivo:** `src/components/Snippet.component.vue`
- **Qué:**
  - Mostrar `SpinnerComponent` mientras el snippet no está disponible
  - Agregar un estado reactivo `loading` que se resuelva cuando el snippet exista
- **Por qué:** Hoy asume que los snippets ya están cargados; si se llega directo a la URL rompe.

---

## Fase 2: Refactor de estado y enrutamiento

### 2.1 Migrar de Vuex a Pinia

- **Archivos nuevos:** `src/stores/user.store.ts`, `src/stores/snippets.store.ts`
- **Archivo a eliminar:** `src/lib/store.ts`
- **Qué:**
  - Crear `useUserStore` con state `user`, actions `setUser` / `cleanUser`
  - Crear `useSnippetsStore` con state `snippets`, `allSnippets`, actions `setSnippets` / `cleanSnippets` / `setAllSnippets` / `cleanAllSnippets`
  - Migrar todos los componentes que importan `{ store }` a los stores de Pinia
  - Cambiar `store.dispatch(...)` por `store.actionName(...)`
  - Actualizar `main.ts` con `createPinia()` y `.use(pinia)`
- **Por qué:** Pinia es el store oficial de Vue 3, mejor tipado, más simple, y Vuex 4 está en mantenimiento.

### 2.2 Simplificar router a exportación directa

- **Archivo:** `src/router.ts`
- **Qué:**
  - Cambiar `export default (): Router => { ... }` por `export default createRouter({ ... })`
  - Actualizar `main.ts` de `.use(router())` a `.use(router)`
- **Por qué:** La función factory es innecesaria; el router puede ser singleton.

---

## Fase 3: Rendimiento

### 3.1 Virtual scrolling en la grilla

- **Archivo:** `src/components/SnippetsList.component.vue`
- **Dependencia nueva:** `@tanstack/vue-virtual`
- **Qué:**
  - Reemplazar el `v-for` sobre `snippets` con un scroll virtual
  - Renderizar solo los snippets visibles en el viewport
  - Mantener el grid 2-columnas
- **Por qué:** Con cientos de snippets el DOM se llena de nodos ocultos; virtual scrolling mantiene el renderizado ligero.

### 3.2 Code splitting por ruta

- **Archivo:** `src/router.ts`
- **Qué:**
  - Importar `SnippetComponent` y `NewSnippetComponent` con `defineAsyncComponent`
  - Mantener carga síncrona para `HomeComponent` y `AuthComponent`
- **Por qué:** El bundle inicial se reduce al no cargar la vista de detalle hasta que se necesita.

---

## Fase 4: Testing

### 4.1 Configurar Vitest

- **Dependencias nuevas:** `vitest`, `@vue/test-utils`, `jsdom`, `happy-dom`
- **Archivo nuevo:** `vitest.config.ts` (o integrado en `vite.config.ts`)
- **Script nuevo:** `"test": "vitest run"`, `"test:watch": "vitest"`
- **Qué:**
  - Configurar Vitest con entorno jsdom
  - Agregar setup global si es necesario

### 4.2 Tests unitarios críticos

- **Search:** filtrar por título, descripción, tag; case-insensitive; debounce no se ejecuta antes del timeout
- **Auth:** `auth()` llama al endpoint correcto, almacena sesión en localStorage, redirige a /home
- **Store:** acciones `setUser`, `cleanUser`, `setSnippets`, `setAllSnippets` mutan el estado correctamente
- **Spinner:** se muestra solo cuando `enabled` es `true`

---

## Fase 5: Calidad y DX

### 5.1 Habilitar `noImplicitAny: true` en tsconfig

- **Archivo:** `tsconfig.json`
- **Qué:**
  - Cambiar `"noImplicitAny": false` a `true`
  - Agregar tipos explícitos en todos los lugares donde falten
- **Por qué:** Recupera el tipo estricto que está desactivado hoy.

### 5.2 Limpieza de código muerto

- **Archivos:**
  - `src/services/snippets.service.ts` — eliminar `getSnippetsMock()` si no se usa
  - `src/services/mock-api/snippets.json` — eliminar si no se usa
  - `src/components/Header.component.vue` — limpiar `class="disabled"` redundante en Create button (ya tiene atributo `disabled`)
- **Por qué:** Reduce ruido y mantiene el códigobase limpio.

---

## Orden sugerido de implementación

```
Fase 1 (correcciones) → Fase 2 (refactor) → Fase 3 (rendimiento) → Fase 5 (calidad) → Fase 4 (testing)
```

Cada fase es independiente y puede implementarse sin esperar a la anterior, excepto Fase 4 (testing) que puede hacerse en cualquier momento pero idealmente después de los refactors de Fase 2.
