<script setup lang="ts">
import { UserService }  from '../services/user.service.ts' 
import { useRouter } from 'vue-router'
import SpinnerComponent from './shared/Spinner.component.vue'

const router = useRouter()
const userService = new UserService()

const urlParams = new URLSearchParams(window.location.search)
userService.getUser(urlParams.get('code') || '')
  .then(user => {
    localStorage.setItem('snippet-vault-session', btoa(JSON.stringify(user))) 
    router.push('/home')
  })

</script>

<template>
  <SpinnerComponent :enabled="true" />
</template>

<style scoped>
</style>
