import { Endpoints } from '../constants/endpoints'
import type { Snippet } from '../interfaces/snippet.interface'

const base = Endpoints.API_URL + Endpoints.SNIPPET_VAULT_URL

const getAllSnippets = (): Promise<Snippet[]> => {
  return fetch(base + '/all', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then(data => data.data as Snippet[])
    .catch(err => {
      throw { error: true, message: err.message || 'Failed to load snippets' }
    })
}

const createSnippet = (data: { group?: string; title: string; description: string; tags: string; snippetValue: string; owner: string }): Promise<Snippet> => {
  return fetch(base, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then(res => res.data as Snippet)
    .catch(err => {
      throw { error: true, message: err.message || 'Failed to create snippet' }
    })
}

const deleteSnippet = (id: string): Promise<void> => {
  return fetch(base + '/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then(() => undefined)
    .catch(err => {
      throw { error: true, message: err.message || 'Failed to delete snippet' }
    })
}

export {
  getAllSnippets,
  createSnippet,
  deleteSnippet
}
