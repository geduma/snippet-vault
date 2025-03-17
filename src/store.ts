import { createStore } from "vuex"
import type { User } from "./interfaces/user.interface"

export const store = createStore({
  state: {
    user: { id: 0, name: '', email: '', login: '' } as User
  },
  mutations: {
    setUser (state, user: User) {
      state.user = user
    },
    cleanUser (state) {
      state.user = { id: 0, name: '', email: '', login: '' }
    }
  },
  actions: {
    setUser ({ commit }, user: User) {
      commit('setUser', user)
    },
    cleanUser ({ commit }) {
      commit('cleanUser')
    }
  }
})
