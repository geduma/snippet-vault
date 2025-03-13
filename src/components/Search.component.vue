<script setup>
import { ref } from 'vue'

const textSearch = ref('')
</script>

<template>
  <div class="search-container">
    <input type="text" name="textSearch" id="textSearch" placeholder="Search" v-model="textSearch" />
    <div class="tags">
      <span class="vue">vue</span>
      <span class="javascript">javascript</span>
      <span class="react">react</span>
      <span class="angular">angular</span>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
}

.search-container > input {
  width: 100%;
  height: 2rem;
  padding: .5rem 1rem .5rem 1rem;
  font-size: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.tags {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.tags > span {
  cursor: pointer;
  padding: 0.2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.tags > span:hover {
  opacity: 0.8;
}

.tags > span:active {
  opacity: 0.6;
}

.tags > span.vue {
  background-color: #41b88324;
}

.tags > span.javascript {
  background-color: #f1e05a2b;
}

.tags > span.react {
  background-color: #00b3e94c;
}

.tags > span.angular {
  background-color: #e0393c26;
}
</style>
