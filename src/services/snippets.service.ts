import type { Snippet } from '../interfaces/snippet.interface'
import { store } from '../lib/store'
import snippetsMock from './mock-api/snippets.json'

export const getSnippetsMock = (): Promise<Snippet[]> => {
  return new Promise<Snippet[]>((resolve) => {
    const result = snippetsMock.map(snippet => ({
      ...snippet,
      id: Number(snippet.id)
    })) as Snippet[]

    store.dispatch('setSnippets', result)
    resolve(result)
  })
}
