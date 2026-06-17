<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useSnippetsStore } from '../stores/snippets.store'
import { storeToRefs } from 'pinia'
import type { Snippet } from '../interfaces/snippet.interface'
import * as snippetsService from '../services/snippets.service'
import SpinnerComponent from './shared/Spinner.component.vue'
import { Constants } from '../constants/constants'

const snippetsStore = useSnippetsStore()
const { snippets: storeSnippets } = storeToRefs(snippetsStore)

const loading = ref(true)
const error = ref('')
const snippets = ref<Snippet[]>([])
const parentRef = ref<Element | null>(null)
const DESC_LIMIT = 100

const truncate = (text: string): string => {
  if (!text || text.length <= DESC_LIMIT) return text
  return text.slice(0, DESC_LIMIT).trimEnd() + '...'
}

const rows = computed(() => {
  const items = snippets.value ?? []
  const result: Snippet[][] = []
  for (let i = 0; i < items.length; i += 2) {
    result.push(items.slice(i, i + 2))
  }
  return result
})

const virtualizer = useVirtualizer({
  count: rows.value.length,
  getScrollElement: () => parentRef.value ?? null,
  estimateSize: () => 148,
  overscan: 2
})

watch(() => rows.value.length, (newCount) => {
  virtualizer.value.setOptions({
    ...virtualizer.value.options,
    count: newCount
  })
})

snippetsService.getAllSnippets()
  .then(data => {
    const res = data.map(snippet => {
      const tags = snippet.tags.split(',').map(tag => tag.trim())
      return {
        ...snippet,
        _tags: tags.map(tag => ({
          name: tag,
          color: Constants.TAGS_COLORS.find(x => x.name === tag)?.color || Constants.TAGS_COLORS.find(x => x.name === 'default')?.color
        }))
      }
    })
    snippetsStore.setSnippets(res)
    snippetsStore.setAllSnippets(res)
    snippets.value = res
    loading.value = false
  })
  .catch((err: { message: string }) => {
    error.value = err.message || 'Failed to load snippets. Please try again later.'
    loading.value = false
  })

  watch(storeSnippets, (newSnippets) => {
      snippets.value = newSnippets
    }
  )
</script>

<template>
  <SpinnerComponent v-if="loading" />
  <p class="error-message" v-if="error">{{ error }}</p>
  <p class="empty-message" v-if="!loading && !error && snippets.length === 0">No snippets found matching your search.</p>
  <div ref="parentRef" class="virtual-scroll-container" v-if="!error && !loading && snippets.length > 0">
    <div :style="{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }">
      <div
        v-for="row in virtualizer.getVirtualItems()"
        :key="String(row.key)"
        class="snippets-row"
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translateY(${row.start}px)`
        }"
      >
        <div
          class="snippet-container"
          v-for="snippet in rows[row.index]"
          :key="snippet._id"
        >
          <div class="snippet-details">
            <RouterLink :to="`/${snippet._id}`" :title="snippet.title">{{ snippet.title }}</RouterLink>
            <p :title="snippet.description">{{ truncate(snippet.description) }}</p>
            <div class="tags">
              <span class="tag" v-for="tag in snippet._tags" :key="tag" :style="`background-color: ${tag.color}`">{{ tag.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-scroll-container {
  height: calc(100vh - 16rem);
  overflow: auto;
}

.snippets-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .5rem;
  padding-right: .5rem;
  box-sizing: border-box;
}

.snippet-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  height: 140px;
  box-sizing: border-box;
  overflow: hidden;
}

.snippet-details > a {
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  color: #ccc;
  margin: 0;
}

.snippet-details > p {
  margin-top: 0.25rem;
  font-size: 12px;
}

.snippet-details > a:hover {
  cursor: pointer;
  text-decoration: underline;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  border: 1px solid #e0e0e0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 12px;
}

p {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

a {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}

.empty-message {
  text-align: center;
  padding: 3rem 2rem;
  font-size: 1.1rem;
  opacity: 0.7;
}

@media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
  .snippets-row {
    grid-template-columns: 1fr;
  }
}
</style>
