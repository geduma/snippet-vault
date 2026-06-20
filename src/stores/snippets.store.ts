import { defineStore } from 'pinia'
import type { Snippet } from '../interfaces/snippet.interface'

export const useSnippetsStore = defineStore('snippets', {
  state: () => ({
    snippets: [] as Snippet[],
    allSnippets: [] as Snippet[],
    loading: true
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
    },
    setLoading (_loading: boolean) {
      this.loading = _loading
    },
    removeSnippet (_id: string) {
      this.snippets = this.snippets.filter(s => s._id !== _id)
      this.allSnippets = this.allSnippets.filter(s => s._id !== _id)
    }
  }
})
