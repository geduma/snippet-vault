<script setup>
import HeaderComponent from './components/Header.component.vue'
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
  padding: 4rem;
}
</style>
