<script setup lang="ts">
import { ref } from 'vue'
import { store } from '../lib/store'
import type { Snippet } from '../interfaces/snippet.interface'
import * as snippetsService from '../services/snippets.service'
import SpinnerComponent from './shared/Spinner.component.vue'
import { Constants } from '../constants/constants'

const loading = ref(true)
const snippets = ref([] as Snippet[])

snippetsService.getAllSnippets()
  .then(data => {
    const res = data.map(snippet => {
      const tags = snippet.tags.split(',').map(tag => tag.trim())
      return {
        ...snippet,
        _tags: tags.map(tag => ({
          name: tag,
          color: Constants.TAGS_COLORS.find(x => x.name === tag)?.color || Constants.TAGS_COLORS.find(x => x.name === 'default')?.color
        }))
      }
    })
    store.dispatch('setSnippets', res)
    snippets.value = res
    loading.value = false
  })
</script>

<template>
  <SpinnerComponent v-if="loading" />
  <div class="snippets-list">
    <div class="snippet-container" v-for="snippet in snippets" :key="snippet._id">
      <div class="snippet-details">
        <RouterLink :to="`/${snippet._id}`">{{ snippet.title }}</RouterLink>
        <p>{{ snippet.description }}</p>
        <div class="tags">
          <span class="tag" v-for="tag in snippet._tags" :key="tag" :style="`background-color: ${tag.color}`">{{ tag.name }}</span>
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
