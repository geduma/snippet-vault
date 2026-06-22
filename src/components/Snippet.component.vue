<script setup lang="ts">
import { ref } from 'vue'
import SpinnerComponent from './shared/Spinner.component.vue'
import { useRoute, useRouter } from 'vue-router'
import { Constants } from '../constants/constants'
import type { Snippet } from '../interfaces/snippet.interface'
import { useSnippetsStore } from '../stores/snippets.store'
import { useUserStore } from '../stores/user.store'
import { storeToRefs } from 'pinia'
import { getAllSnippets, deleteSnippet } from '../services/snippets.service'

const snippetsStore = useSnippetsStore()
const userStore = useUserStore()
const { snippets, allSnippets } = storeToRefs(snippetsStore)
const { user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const editorLoading = ref(true)
const deleting = ref(false)
const snippet = ref<Snippet | null>(null)
const snippetId = route.params.snippetId as string

const enrichSnippet = (s: Snippet): Snippet => {
  const tags = s.tags.split(',').map(tag => tag.trim())
  return {
    ...s,
    _tags: tags.map(tag => ({
      name: tag,
      color: Constants.TAGS_COLORS.find(x => x.name === tag)?.color ?? '#999999B3'
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

const handleDelete = async () => {
  if (!snippet.value) return
  deleting.value = true
  try {
    await deleteSnippet(snippet.value._id)
    snippetsStore.removeSnippet(snippet.value._id)
    router.push('/home')
  } catch {
    deleting.value = false
  }
}

loadSnippet()
</script>

<template>
  <SpinnerComponent :enabled="loading" />
  <div class="snippet-container" v-if="snippet">
    <div class="snippet-header">
      <h1>{{ snippet.title }}</h1>
      <button
        type="button"
        class="delete-btn"
        v-if="user.displayName && snippet.owner === user.displayName"
        @click="handleDelete"
        :disabled="deleting"
      >
        Eliminar
      </button>
    </div>
    <p>{{ snippet.description }}</p>
    <div class="tags">
      <span class="tag" v-for="tag in snippet._tags" :key="tag.name" :style="`background-color: ${tag.color}`">{{ tag.name }}</span>
    </div>
    <div class="editor-container">
      <div class="editor-spinner" v-if="editorLoading">
        <SpinnerComponent :enabled="true" />
      </div>
      <embed class="editor" :src="`${Constants.EMBED_EDITOR}/${snippet.snippetValue}`" type="text/html" @load="editorLoading = false">
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

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: .5rem 1rem;
  border-radius: .5rem;
  cursor: pointer;
  font-size: .9rem;
}

.delete-btn:hover:not(:disabled) {
  opacity: 0.8;
  scale: 1.05;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: default;
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
  display: block;
}

.editor-container {
  position: relative;
  margin: 1rem -.5rem;
}

.editor-spinner {
  position: absolute;
  inset: 0;
  z-index: 2;
  height: 600px;
}


</style>
