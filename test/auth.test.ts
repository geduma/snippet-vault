import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { auth } from '../src/services/auth.service'

describe('auth service', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('calls the correct endpoint with the code', async () => {
    const mockUser = { id: 1, email: 'test@test.com', login: 'testuser', avatarUrl: 'avatar.jpg' }
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: mockUser })
    })

    const result = await auth('testcode')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth?code=testcode'),
      expect.any(Object)
    )
    expect(result).toEqual(mockUser)
  })

  it('rejects on fetch failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    await expect(auth('testcode')).rejects.toThrow()
  })
})