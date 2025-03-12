<script setup>
defineProps({
  msg: String,
})

</script>

<template>
  <h1 class="montserrat-alternates-light">{{ msg }}</h1>
</template>

<style scoped>
h1 {
  margin-top: 0rem;
  font-size: 3.2em;
  line-height: 1.1;
}
</style>
