import { Endpoints } from '../constants/endpoints'
import type { Snippet } from '../interfaces/snippet.interface'

const getAllSnippets = (): Promise<Snippet[]> => {
  return fetch(Endpoints.API_URL + '/all', {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
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

export {
  getAllSnippets
}
