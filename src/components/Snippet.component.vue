<script setup lang="ts">
import { store } from '../lib/store'

const snippetId = window.location.pathname.split('/').pop()
const snippet = store.state.snippets.find(X => X.id === Number(snippetId))

if (store.state.snippets.length === 0) window.location.href = '/home'
if (snippet === undefined) window.location.href = '/home'

</script>

<template>
  <div class="snippet-container">
    <h1>{{ snippet.title }}</h1>
    <p>{{ snippet.description }}</p>
    <div class="tags">
      <span class="tag" v-for="tag in snippet.tags" :key="tag">{{ tag }}</span>
    </div>
  </div>
</template>

<style scoped>
.snippet-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
</style>
