<script setup lang="ts">
import { ref } from 'vue'

const textSearch = ref('')
</script>

<template>
  <div class="search-container">
    <input type="text" name="textSearch" id="textSearch" placeholder="Search" v-model="textSearch" />
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
