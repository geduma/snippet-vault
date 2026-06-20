import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../src/stores/user.store'
import { useSnippetsStore } from '../src/stores/snippets.store'
import type { User } from '../src/interfaces/user.interface'
import type { Snippet } from '../src/interfaces/snippet.interface'

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets user correctly', () => {
    const store = useUserStore()
    const user: User = { id: '12345', email: 'test@test.com', displayName: 'Test User', avatarUrl: 'avatar.jpg' }
    store.setUser(user)
    expect(store.user).toEqual(user)
  })

  it('cleans user correctly', () => {
    const store = useUserStore()
    store.setUser({ id: '12345', email: 'test@test.com', displayName: 'Test User', avatarUrl: 'avatar.jpg' })
    store.cleanUser()
    expect(store.user.id).toBe('')
    expect(store.user.displayName).toBe('')
  })
})

describe('SnippetsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets and cleans snippets', () => {
    const store = useSnippetsStore()
    const snippets: Snippet[] = [
      { _id: '1', group: '0', title: 'Test', description: 'Desc', tags: 'html', snippetValue: 'abc', _tags: [] }
    ]
    store.setSnippets(snippets)
    expect(store.snippets).toHaveLength(1)
    store.cleanSnippets()
    expect(store.snippets).toHaveLength(0)
  })

  it('sets and cleans allSnippets', () => {
    const store = useSnippetsStore()
    const snippets: Snippet[] = [
      { _id: '1', group: '0', title: 'Test', description: 'Desc', tags: 'html', snippetValue: 'abc', _tags: [] }
    ]
    store.setAllSnippets(snippets)
    expect(store.allSnippets).toHaveLength(1)
    store.cleanAllSnippets()
    expect(store.allSnippets).toHaveLength(0)
  })
})
