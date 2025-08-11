import { createStore } from 'vuex'
import type { User } from '../interfaces/user.interface'
import type { Snippet } from '../interfaces/snippet.interface'

export const store = createStore({
  state: {
    user: {},
    snippets: [] as Snippet[],
    allSnippets: [] as Snippet[]
  },
  mutations: {
    setUser (state, _user: User) {
      state.user = _user
    },
    cleanUser (state) {
      state.user = { id: 0, avatarUrl: '', email: '', login: '' }
    },
    setSnippets (state, _snippets: Snippet[]) {
      state.snippets = _snippets
    },
    cleanSnippets (state) {
      state.snippets = []
    },
    setAllSnippets (state, _allSnippets: Snippet[]) {
      state.allSnippets = _allSnippets
    },
    cleanAllSnippets (state) {
      state.allSnippets = []
    }
  },
  actions: {
    setUser ({ commit }, _user: User) {
      commit('setUser', _user)
    },
    cleanUser ({ commit }) {
      commit('cleanUser')
    },
    setSnippets ({ commit }, _snippets: Snippet[]) {
      commit('setSnippets', _snippets)
    },
    cleanSnippets ({ commit }) {
      commit('cleanSnippets')
    },
    setAllSnippets ({ commit }, _allSnippets: Snippet[]) {
      commit('setAllSnippets', _allSnippets)
    },
    cleanAllSnippets ({ commit }) {
      commit('cleanAllSnippets')
    }
  }
})
