import { Endpoints } from '../constants/endpoints'
import type { User } from '../interfaces/user.interface'
import { store } from '../lib/store'

export const auth = (code: string): Promise<User> => {
  return new Promise<User>((resolve, reject) => {
    fetch(Endpoints.GET_USER_URL + '?code=' + code, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        store.dispatch('setUser', data.data)
        resolve(data.data)
      })
      .catch(err => reject(err))
  })
}
