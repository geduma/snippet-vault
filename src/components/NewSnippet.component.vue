<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.store'
import { storeToRefs } from 'pinia'
import { createSnippet } from '../services/snippets.service'

const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const title = ref('')
const description = ref('')
const tags = ref('')
const snippetValue = ref('')
const group = ref('0')
const submitting = ref(false)
const error = ref('')

if (!user.value.id) {
  router.push('/home')
}

const handleSubmit = async () => {
  if (!title.value || !description.value || !snippetValue.value) {
    error.value = 'Title, description and snippet value are required'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    await createSnippet({
      group: group.value,
      title: title.value,
      description: description.value,
      tags: tags.value,
      snippetValue: snippetValue.value,
      owner: user.value.login
    })
    router.push('/home')
  } catch (err: any) {
    error.value = err.message || 'Failed to create snippet'
    submitting.value = false
  }
}
</script>

<template>
  <div class="new-snippet">
    <h1>New Snippet</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input id="title" v-model="title" type="text" placeholder="Snippet title" />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input id="description" v-model="description" type="text" placeholder="Brief description" />
      </div>
      <div class="form-group">
        <label for="tags">Tags (comma separated)</label>
        <input id="tags" v-model="tags" type="text" placeholder="html, css, javascript" />
      </div>
      <div class="form-group">
        <label for="group">Group</label>
        <input id="group" v-model="group" type="number" placeholder="0" />
      </div>
      <div class="form-group">
        <label for="snippetValue">Code</label>
        <textarea id="snippetValue" v-model="snippetValue" placeholder="Paste your code here" rows="12"></textarea>
      </div>
      <p class="error" v-if="error">{{ error }}</p>
      <button type="submit" :disabled="submitting" :class="{ loading: submitting }">
        {{ submitting ? 'Creating...' : 'Create' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.new-snippet {
  width: 90%;
  max-width: 800px;
}

h1 {
  margin: 0 0 1.5rem 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: .25rem;
}

label {
  font-size: .9rem;
  opacity: .8;
}

input, textarea {
  padding: .5rem;
  border: 1px solid #ccc;
  border-radius: .5rem;
  font-size: 1rem;
  font-family: inherit;
  background: transparent;
  color: inherit;
}

textarea {
  resize: vertical;
  font-family: monospace;
}

.error {
  color: #e74c3c;
  margin: 0;
}

button[type="submit"] {
  align-self: flex-start;
  padding: .5rem 2rem;
}
</style>
