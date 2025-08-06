<script setup lang="ts">
import SearchComponent from './Search.component.vue'
import SnippetsListComponent from './SnippetsList.component.vue'
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
