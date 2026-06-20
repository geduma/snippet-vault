<script setup lang="ts">
import { useUserStore } from '../stores/user.store'
import SearchComponent from './Search.component.vue'
import SnippetsListComponent from './SnippetsList.component.vue'
import type { User } from '../interfaces/user.interface'

const userStore = useUserStore()

const user = localStorage.getItem('snippet-vault-session')
if (user) {
  const parsed: User = JSON.parse(atob(user))
  if (!parsed.avatarUrl.startsWith('https://api.dicebear.com/')) {
    parsed.avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${parsed.email}`
    localStorage.setItem('snippet-vault-session', btoa(JSON.stringify(parsed)))
  }
  userStore.setUser(parsed)
}
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
