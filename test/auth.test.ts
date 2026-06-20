import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { login, getSession } from '../src/services/auth.service'

describe('auth service - login', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('calls POST /auth/login/{appId}/{providerId} and returns redirect URL', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ ok: true, data: { redirect: 'https://github.com/login/oauth/authorize?client_id=xxx' } })
    })

    const result = await login('app_test', 'prov_github')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login/app_test/prov_github'),
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toBe('https://github.com/login/oauth/authorize?client_id=xxx')
  })

  it('throws when login response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ ok: false, msg: 'Provider not enabled' })
    })

    await expect(login('app_test', 'prov_github')).rejects.toThrow('Provider not enabled')
  })

  it('rejects on fetch failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    await expect(login('app_test', 'prov_github')).rejects.toThrow()
  })
})

describe('auth service - getSession', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('calls GET /auth/session/{token} and returns User', async () => {
    const mockProviderData = {
      ok: true,
      data: {
        email: 'test@test.com',
        displayName: 'Test User',
        picture: 'https://example.com/pic.jpg',
        provider: 'github',
        rawData: { id: '12345', login: 'testuser' }
      }
    }
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockProviderData)
    })

    const result = await getSession('token123')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/session/token123'),
      expect.any(Object)
    )
    expect(result.id).toBe('12345')
    expect(result.email).toBe('test@test.com')
    expect(result.displayName).toBe('Test User')
    expect(result.avatarUrl).toContain('dicebear.com')
  })

  it('throws when session is not found', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ ok: false, msg: 'Session not found or expired' })
    })

    await expect(getSession('invalid')).rejects.toThrow('Session not found or expired')
  })

  it('rejects on fetch failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    await expect(getSession('token')).rejects.toThrow()
  })
})
