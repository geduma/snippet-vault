<script setup>
const login = () => {
  console.log('login')
}

const bug = () => {
  console.log('bug')
}

</script>

<template> 
  <div class="header">
    <div class="logo">
      <img src="/images/snippet-vault-logo-icon.webp" alt="Snippet Vault logo" />
      Snippet Vault
    </div>
    <div class="buttons">
      <button type="button" v-on:click="bug()">
        <img src="/images/bug.svg" alt="Bug logo" />
        Bugs
      </button>
      <button type="button" v-on:click="login()">
        <img src="/images/github.svg" alt="GitHub logo" />
        Sign in
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  display: flex;
  flex-direction: row;
  gap: .5rem;
}

button > img {
  height: 14px;
}

.header {
  height: 3rem;
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  padding-right: 2rem;
}

.logo {
  display: flex;
  align-items: center;
}

.logo > img {
  height: 2rem;
  padding: 0.5rem;
}

.buttons {
  display: flex;
  align-items: center;
  gap: .5rem;
}
</style>
