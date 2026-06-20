<script setup lang="ts">
import { getSession } from '../services/auth.service'
import { useRouter } from 'vue-router'
import SpinnerComponent from './shared/Spinner.component.vue'

const router = useRouter()
const urlParams = new URLSearchParams(window.location.search)
const sessionToken = urlParams.get('session_token')

if (sessionToken) {
  getSession(sessionToken)
    .then(user => {
      localStorage.setItem('snippet-vault-session', btoa(JSON.stringify(user)))
      router.push('/home')
    })
    .catch(() => {
      router.push('/home')
    })
} else {
  router.push('/home')
}
</script>

<template>
  <SpinnerComponent :enabled="true" />
</template>

<style scoped>
</style>
