import { createStore } from 'vuex'
import type { User } from '../interfaces/user.interface'
import type { Snippet } from '../interfaces/snippet.interface'

export const store = createStore({
  state: {
    user: {},
    snippets: [] as Snippet[]
  },
  mutations: {
    setUser (state, user: User) {
      state.user = user
    },
    cleanUser (state) {
      state.user = { id: 0, avatarUrl: '', email: '', login: '' }
    },
    setSnippets (state, snippets: Snippet[]) {
      state.snippets = snippets
    },
    cleanSnippets (state) {
      state.snippets = []
    }
  },
  actions: {
    setUser ({ commit }, user: User) {
      commit('setUser', user)
    },
    cleanUser ({ commit }) {
      commit('cleanUser')
    },
    setSnippets ({ commit }, snippets: Snippet[]) {
      commit('setSnippets', snippets)
    },
    cleanSnippets ({ commit }) {
      commit('cleanSnippets')
    }
  }
})
