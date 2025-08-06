<script setup lang="ts">
import { ref } from 'vue'
import type { Snippet } from '../interfaces/snippet.interface'
import { store } from '../lib/store'

const snippets = ref([] as Snippet[])
snippets.value = store.state.snippets

</script>

<template>
  <div class="snippets-list">
    <div class="snippet-container" v-for="snippet in snippets" :key="snippet.id">
      <div class="snippet-details">
        <RouterLink :to="`/${snippet.id}`">{{ snippet.title }}</RouterLink>
        <p>{{ snippet.description }}</p>
        <div class="tags">
          <span class="tag" v-for="tag in snippet.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
      <div class="snippet-actions">
        ...
      </div>
    </div>
  </div>
</template>

<style scoped>
.snippets-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.snippet-container {
  display: grid;
  grid-template-columns: 70% 30%;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
}

.snippet-details > a {
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  color: #ccc;
  margin: 0;
}

.snippet-details > p {
  margin-top: 0.25rem;
  font-size: 12px;
}

.snippet-details > a:hover {
  cursor: pointer;
  text-decoration: underline;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  border: 1px solid #e0e0e0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 12px;
}

.snippet-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
