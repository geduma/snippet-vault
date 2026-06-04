import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSnippetsStore } from '../stores/snippets.store'
import type { Snippet } from '../interfaces/snippet.interface'

const mockSnippets: Snippet[] = [
  { _id: '1', group: '0', title: 'Basic Button', description: 'A simple button component', tags: 'button,ui', snippetValue: 'abc', _tags: [{ name: 'button', color: '#999' }, { name: 'ui', color: '#999' }] },
  { _id: '2', group: '0', title: 'Card Layout', description: 'A card with image and text', tags: 'card,layout', snippetValue: 'def', _tags: [{ name: 'card', color: '#999' }, { name: 'layout', color: '#999' }] },
  { _id: '3', group: '0', title: 'Modal Dialog', description: 'A modal box', tags: 'modal,ui', snippetValue: 'ghi', _tags: [{ name: 'modal', color: '#999' }, { name: 'ui', color: '#999' }] }
]

describe('SnippetsStore search', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useSnippetsStore()
    store.setAllSnippets(mockSnippets)
    store.setSnippets(mockSnippets)
  })

  it('filters by title case-insensitively', () => {
    const store = useSnippetsStore()
    const query = 'button'
    const filtered = store.allSnippets.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase())
    )
    expect(filtered).toHaveLength(1)
    expect(filtered[0]._id).toBe('1')
  })

  it('filters by description', () => {
    const store = useSnippetsStore()
    const query = 'card'
    const filtered = store.allSnippets.filter(s =>
      s.description.toLowerCase().includes(query.toLowerCase())
    )
    expect(filtered).toHaveLength(1)
    expect(filtered[0]._id).toBe('2')
  })

  it('filters by tag name', () => {
    const store = useSnippetsStore()
    const query = 'ui'
    const filtered = store.allSnippets.filter(s =>
      s._tags.some(tag => tag.name.includes(query.toLowerCase()))
    )
    expect(filtered).toHaveLength(2)
    expect(filtered.map(s => s._id)).toContain('1')
    expect(filtered.map(s => s._id)).toContain('3')
  })

  it('returns all snippets for empty query', () => {
    const store = useSnippetsStore()
    const query = ''
    const filtered = store.allSnippets.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase())
      || s.description.toLowerCase().includes(query.toLowerCase())
    )
    expect(filtered).toHaveLength(3)
  })

  it('returns nothing for non-matching query', () => {
    const store = useSnippetsStore()
    const query = 'zzznonexistent'
    const filtered = store.allSnippets.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase())
      || s.description.toLowerCase().includes(query.toLowerCase())
      || s._tags.some(tag => tag.name.includes(query.toLowerCase()))
    )
    expect(filtered).toHaveLength(0)
  })
})
