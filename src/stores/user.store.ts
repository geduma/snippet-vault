import { defineStore } from 'pinia'
import type { User } from '../interfaces/user.interface'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User
  }),
  actions: {
    setUser (_user: User) {
      this.user = _user
    },
    cleanUser () {
      this.user = { id: '', avatarUrl: '', email: '', displayName: '' } as unknown as User
    }
  }
})
