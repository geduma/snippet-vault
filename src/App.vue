<script setup>
import { store } from './lib/store';
import HeaderComponent from './components/Header.component.vue'
import * as snippetsService from './services/snippets.service'

const user = localStorage.getItem('snippet-vault-session')
if (user) store.dispatch('setUser', JSON.parse(atob(user)))

snippetsService.getSnippetsMock()

</script>

<template>
  <HeaderComponent />
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}
</style>
