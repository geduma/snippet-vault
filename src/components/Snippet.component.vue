<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Constants } from '../constants/constants'
import type { Snippet } from '../interfaces/snippet.interface'
import { useSnippetsStore } from '../stores/snippets.store'
import { storeToRefs } from 'pinia'
import { getAllSnippets } from '../services/snippets.service'

const snippetsStore = useSnippetsStore()
const { snippets, allSnippets } = storeToRefs(snippetsStore)
import SpinnerComponent from './shared/Spinner.component.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const snippet = ref<Snippet | null>(null)
const snippetId = route.params.snippetId as string

const enrichSnippet = (s: Snippet): Snippet => {
  const tags = s.tags.split(',').map(tag => tag.trim())
  return {
    ...s,
    _tags: tags.map(tag => ({
      name: tag,
      color: Constants.TAGS_COLORS.find(x => x.name === tag)?.color || Constants.TAGS_COLORS.find(x => x.name === 'default')?.color
    }))
  }
}

const loadSnippet = async () => {
  let found = snippets.value.find((x: Snippet) => x._id === snippetId)

  if (!found && allSnippets.value.length === 0) {
    try {
      const data = await getAllSnippets()
      const enriched = data.map(enrichSnippet)
      snippetsStore.setSnippets(enriched)
      snippetsStore.setAllSnippets(enriched)
      found = enriched.find(x => x._id === snippetId)
    } catch {
      router.push('/home')
      return
    }
  }

  if (found) {
    snippet.value = found
    loading.value = false
  } else {
    router.push('/home')
  }
}

loadSnippet()
</script>

<template>
  <SpinnerComponent v-if="loading" />
  <div class="snippet-container" v-if="snippet">
    <h1>{{ snippet.title }}</h1>
    <p>{{ snippet.description }}</p>
    <div class="tags">
      <span class="tag" v-for="tag in snippet._tags" :key="tag" :style="`background-color: ${tag.color}`">{{ tag.name }}</span>
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
  height: 600px;
  margin: 1rem -.5rem;
}
</style>
