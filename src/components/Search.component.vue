<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSnippetsStore } from '../stores/snippets.store'
import { storeToRefs } from 'pinia'

const snippetsStore = useSnippetsStore()
const { allSnippets } = storeToRefs(snippetsStore)

const searchQuery = ref('')
const searching = ref(false)
let debounceTimer: ReturnType<typeof setTimeout>

const filterSnippet = () => {
  const query = searchQuery.value.trim()

  if (!query) {
    clearTimeout(debounceTimer)
    snippetsStore.setSnippets(allSnippets.value)
    searching.value = false
    return
  }

  searching.value = true
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const lowerQuery = query.toLowerCase()

    const filtered = allSnippets.value.filter(x =>
      x.title.toLowerCase().includes(lowerQuery)
      || x.description.toLowerCase().includes(lowerQuery)
      || x._tags.some(tag => tag.name.toLowerCase().includes(lowerQuery))
    )

    snippetsStore.setSnippets(filtered)
    searching.value = false
  }, 300)
}

watch(searchQuery, filterSnippet)
</script>

<template>
  <div class="search-container">
    <input type="text" name="textSearch" id="textSearch" placeholder="Search" v-model="searchQuery" />
    <span class="search-spinner" v-if="searching"></span>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  position: relative;
}

.search-container > input {
  width: 90%;
  height: 2rem;
  padding: .5rem 1rem .5rem 1rem;
  font-size: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.search-spinner {
  position: absolute;
  right: calc(5% + 1rem);
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  border: 2px solid #ccc;
  border-top-color: #666;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}
</style>
