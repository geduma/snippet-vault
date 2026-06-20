import { Endpoints } from '../constants/endpoints'
import type { User } from '../interfaces/user.interface'
import { useUserStore } from '../stores/user.store'

export const login = (appId: string, providerId: string): Promise<string> => {
  return fetch(`${Endpoints.API_URL}${Endpoints.LOGIN_URL}${appId}/${providerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.ok && json.data.redirect) {
        return json.data.redirect
      }
      throw new Error(json.msg || 'Login failed')
    })
}

export const getSession = (sessionToken: string): Promise<User> => {
  const userStore = useUserStore()

  return fetch(`${Endpoints.API_URL}${Endpoints.SESSION_URL}${sessionToken}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.ok) {
        const user: User = {
          id: json.data.rawData.id,
          email: json.data.email,
          displayName: json.data.displayName,
          avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${json.data.email}`
        }
        userStore.setUser(user)
        return user
      }
      throw new Error(json.msg || 'Session not found')
    })
}
