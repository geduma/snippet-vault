<script setup lang="ts">
import { ref } from 'vue'
import { Endpoints } from '../constants/endpoints.js'
import { store } from '../store.ts'
import type { User } from '../interfaces/user.interface.ts'

const localUser = ref({ id: 0 } as User)
const userImg = ref('/images/batman-profile.webp')
const storageUser = localStorage.getItem('snippet-vault-session')

const setUserData = (data: User) => {
  localUser.value = data
  userImg.value = data.avatarUrl
}

if (storageUser) setUserData(JSON.parse(atob(storageUser)))

const signin = () => {
  const clientID = import.meta.env.VITE_GITHUB_CLIENT_ID
  const redirectURI = Endpoints.GITHUB_REDIRECT_URL
  window.location.href = `${Endpoints.GITHUB_AUTH_URL}?client_id=${clientID}&redirect_uri=${redirectURI}`
}

const signout = () => {
  store.dispatch('cleanUser')
  localUser.value = { id: 0 } as User
  localStorage.clear()
}

const bug = () => {
  console.log('bug')
}

store.subscribe((store) => {
  if (store.type === 'setUser') setUserData(store.payload)
})

</script>

<template> 
  <div class="header">
    <div class="logo">
      <img src="/images/snippet-vault-logo-icon.webp" alt="Snippet Vault logo" />
      Snippet Vault
    </div>
    <div class="right-content">
      <div class="buttons">
        <button type="button" v-on:click="bug()">
          <img src="/images/bug.svg" alt="Bug logo" />
          Bugs
        </button>
        <button type="button" v-on:click="signin()" v-if="localUser.id === 0">
          Sign in
        </button>
        <button type="button" v-on:click="signout()" v-if="localUser.id !== 0">
          Sign out
        </button>
      </div>
      <img v-bind:src="userImg" alt="Snippet Vault logo" v-if="localUser.id !== 0" />
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
  padding: 1rem 2rem 0 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.logo > img {
  height: 2rem;
}

.right-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.right-content > img {
  border-radius: 50%;
  height: 2.5rem;
  width: 2.5rem;
}

.buttons {
  display: flex;
  align-items: center;
  gap: .5rem;
}
</style>
