<script setup>
const enabled = defineProps({ enabled: Boolean })
</script>

<template>
  <div class="bg-loader" v-if="enabled">
    <span class="loader"></span>
  </div>
</template>

<style scoped>
.bg-loader {
  background: #1b1b1bea;
  width: 100%;
  height: 100%;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader {
  color: #fff;
  font-family: Consolas, Menlo, Monaco, monospace;
  font-weight: bold;
  font-size: 78px;
  opacity: 0.8;
}
.loader:before {
  content: "{";
  display: inline-block;
  animation: pulse 0.4s alternate infinite ease-in-out;
}
.loader:after {
  content: "}";
  display: inline-block;
  animation: pulse 0.4s 0.3s alternate infinite ease-in-out;
}

@keyframes pulse {
  to {
    transform: scale(0.8);
    opacity: 0.5;
  }
}
</style>
