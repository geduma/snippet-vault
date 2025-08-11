<script setup lang="ts">
import { ref } from 'vue'
import { store } from '../lib/store'

const searchQuery = ref('')

const filterSnippet = () => {
  store.dispatch('setSnippets', store.state.allSnippets)

  const snippets = 
    store.state.snippets.filter(x => x.title.includes(searchQuery.value)
    || x.description.includes(searchQuery.value)
    || x._tags.some(tag => tag.name.includes(searchQuery.value))
  )

  store.dispatch('setSnippets', snippets)
}
</script>

<template>
  <div class="search-container">
    <input type="text" name="textSearch" id="textSearch" placeholder="Search" v-model="searchQuery" v-on:input="filterSnippet" />
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 4rem;
}

.search-container > input {
  width: 80%;
  height: 2rem;
  padding: .5rem 1rem .5rem 1rem;
  font-size: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
</style>
