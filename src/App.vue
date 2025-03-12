<script setup>
import HomeComponent from './components/Home.component.vue'
import SearchComponent from './components/Search.component.vue'
</script>

<template>
  <div>
    <img src="/images/snippet-vault-logo-icon.webp" class="logo vue" alt="Snippet Vault logo" />
  </div>
  <HomeComponent msg="Snippet Vault" />
  <SearchComponent />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>
