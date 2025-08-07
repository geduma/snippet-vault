<script setup lang="ts">
import { Constants } from '../constants/constants'
import type { Snippet } from '../interfaces/snippet.interface'
import { store } from '../lib/store'

const snippetId = window.location.pathname.split('/').pop()
const snippet = store.state.snippets.find(x => x._id === snippetId) as Snippet

if (store.state.snippets.length === 0) window.location.href = '/home'
if (snippet === undefined) window.location.href = '/home'
</script>

<template>
  <div class="snippet-container">
    <h1>{{ snippet.title }}</h1>
    <p>{{ snippet.description }}</p>
    <div class="tags">
      <span class="tag" v-for="tag in snippet._tags" :key="tag">{{ tag }}</span>
    </div>
    <div class="editor-container">
      <embed class="editor" :src="`${Constants.EMBED_EDITOR}/${snippet.snippetValue}`" type="text/html">
    </div>
  </div>
</template>

<style scoped>
h1, p {
  margin: 0;
}

.snippet-container {
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  border: 1px solid #e0e0e0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 12px;
}

.editor {
  width: 100%;
  height: 500px;
  margin: 1rem -.5rem;
}
</style>
