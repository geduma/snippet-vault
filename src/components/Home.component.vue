<script setup lang="ts">
import { store } from '../lib/store'
import SearchComponent from './Search.component.vue'
import SnippetsListComponent from './SnippetsList.component.vue'

const user = localStorage.getItem('snippet-vault-session')
if (user) store.dispatch('setUser', JSON.parse(atob(user)))

</script>

<template>
  <SearchComponent/>
  <div class="snippets">
    <SnippetsListComponent/>
  </div>
</template>

<style scoped>
.snippets {
  margin-top: 4rem;
  width: 90%;
}
</style>
