import { defineStore } from 'pinia'
import type { Snippet } from '../interfaces/snippet.interface'

export const useSnippetsStore = defineStore('snippets', {
  state: () => ({
    snippets: [] as Snippet[],
    allSnippets: [] as Snippet[]
  }),
  actions: {
    setSnippets (_snippets: Snippet[]) {
      this.snippets = _snippets
    },
    cleanSnippets () {
      this.snippets = []
    },
    setAllSnippets (_allSnippets: Snippet[]) {
      this.allSnippets = _allSnippets
    },
    cleanAllSnippets () {
      this.allSnippets = []
    }
  }
})
