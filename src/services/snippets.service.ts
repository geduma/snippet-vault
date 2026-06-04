import { Endpoints } from '../constants/endpoints'
import type { Snippet } from '../interfaces/snippet.interface'

const getAllSnippets = (): Promise<Snippet[]> => {
  return new Promise<Snippet[]>((resolve, reject) => {
    fetch(Endpoints.API_URL + '/all', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => resolve(data.data as Snippet[]))
      .catch(err => reject(err))
  })
}

export {
  getAllSnippets
}
