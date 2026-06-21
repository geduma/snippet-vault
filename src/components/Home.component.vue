<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user.store'
import { useSnippetsStore } from '../stores/snippets.store'
import SearchComponent from './Search.component.vue'
import SnippetsListComponent from './SnippetsList.component.vue'
import SpinnerComponent from './shared/Spinner.component.vue'
import type { User } from '../interfaces/user.interface'
import type { Snippet } from '../interfaces/snippet.interface'
import { getAllSnippets } from '../services/snippets.service'
import { Constants } from '../constants/constants'

const userStore = useUserStore()
const snippetsStore = useSnippetsStore()

const loading = ref(true)
const error = ref('')

const user = localStorage.getItem('snippet-vault-session')
if (user) {
  const parsed: User = JSON.parse(atob(user))
  if (!parsed.avatarUrl.startsWith('https://api.dicebear.com/')) {
    parsed.avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${parsed.email}`
    localStorage.setItem('snippet-vault-session', btoa(JSON.stringify(parsed)))
  }
  userStore.setUser(parsed)
}

getAllSnippets()
  .then((data: Snippet[]) => {
    const enriched = data.map((snippet: Snippet) => {
      const tags = snippet.tags.split(',').map(tag => tag.trim())
      return {
        ...snippet,
        _tags: tags.map(tag => ({
          name: tag,
          color: Constants.TAGS_COLORS.find(x => x.name === tag)?.color ?? '#999999B3'
        }))
      }
    })
    snippetsStore.setSnippets(enriched)
    snippetsStore.setAllSnippets(enriched)
  })
  .catch(() => {
    snippetsStore.setSnippets([])
    snippetsStore.setAllSnippets([])
    error.value = 'Failed to load snippets'
  })
  .finally(() => {
    snippetsStore.setLoading(false)
    loading.value = false
  })
</script>

<template>
  <div class="home">
    <SpinnerComponent :enabled="loading" />
    <SearchComponent/>
    <p class="error-message" v-if="error">{{ error }}</p>
    <div class="snippets" v-if="!error">
      <SnippetsListComponent/>
    </div>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.snippets {
  margin-top: 2rem;
  width: 90%;
}

.home :deep(.bg-loader) {
  position: fixed;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}
</style>
