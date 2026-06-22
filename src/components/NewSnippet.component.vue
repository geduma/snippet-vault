<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.store'
import { storeToRefs } from 'pinia'
import { createSnippet } from '../services/snippets.service'
import { Constants } from '../constants/constants'

const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const title = ref('')
const description = ref('')
const tags = ref('')
const snippetValue = ref('')
const embedUrl = ref('')
const submitting = ref(false)
const error = ref('')
const editorLoading = ref(true)

if (!user.value.id) {
  router.push('/home')
}

const extractFromUrl = (url: string) => {
  try {
    const u = new URL(url)
    if (u.pathname.startsWith('/embed/')) {
      return u.pathname.replace('/embed/', '')
    }
    if (u.hash.startsWith('#/')) {
      return u.hash.replace('#/', '')
    }
  } catch {}
  return url
}

const onPasteUrl = () => {
  snippetValue.value = extractFromUrl(embedUrl.value)
}

const handleSubmit = async () => {
  if (!title.value || !description.value) {
    error.value = 'Title and description are required'
    return
  }

  if (!embedUrl.value && !snippetValue.value) {
    error.value = 'Please paste the embed URL from the code editor'
    return
  }

  if (embedUrl.value && !snippetValue.value) {
    snippetValue.value = extractFromUrl(embedUrl.value)
  }

  submitting.value = true
  error.value = ''

  try {
    await createSnippet({
      title: title.value,
      description: description.value,
      tags: tags.value,
      snippetValue: snippetValue.value,
      owner: user.value.displayName
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
        <label>Code</label>
        <div class="editor-container">
          <div class="editor-spinner" v-if="editorLoading">
            <span class="loader"></span>
          </div>
          <embed class="editor" :src="Constants.EMBED_EDITOR" type="text/html" @load="editorLoading = false">
        </div>
        <p class="help-text">
          Write your code in the editor above, then click "Copy URL" and paste it below
        </p>
      </div>
      <div class="form-group">
        <label for="embedUrl">Embed URL</label>
        <input id="embedUrl" v-model="embedUrl" type="url" placeholder="Paste the embed URL from the editor" @input="onPasteUrl" />
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

input {
  padding: .5rem;
  border: 1px solid #ccc;
  border-radius: .5rem;
  font-size: 1rem;
  font-family: inherit;
  background: transparent;
  color: inherit;
}

.editor {
  width: 100%;
  height: 400px;
  display: block;
}

.editor-container {
  position: relative;
}

.editor-spinner {
  position: absolute;
  inset: 0;
  z-index: 2;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e1e1e;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #444;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.help-text {
  font-size: .8rem;
  opacity: .6;
  margin: .25rem 0 0 0;
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
