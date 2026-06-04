<script setup lang="ts">
import { useUserStore } from '../stores/user.store'
import SearchComponent from './Search.component.vue'
import SnippetsListComponent from './SnippetsList.component.vue'

const userStore = useUserStore()

const user = localStorage.getItem('snippet-vault-session')
if (user) userStore.setUser(JSON.parse(atob(user)))

</script>

<template>
  <SearchComponent/>
  <div class="snippets">
    <SnippetsListComponent/>
  </div>
</template>

<style scoped>
.snippets {
  margin-top: 2rem;
  width: 90%;
}
</style>
