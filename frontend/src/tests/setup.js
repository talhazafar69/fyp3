import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'

// Auto cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock implementation for fetch or any browser APIs if needed
global.fetch = vi.fn()

// Helper function to mock fetch responses for tests
export const mockFetch = (data) => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  })
}

// Helper function to mock fetch error responses
export const mockFetchError = (status = 400, message = 'Bad Request') => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ message }),
  })
}

// Reset fetch mocks after each test
afterEach(() => {
  global.fetch.mockReset()
})

// Setup MSW server for API mocking if needed
export const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close()) 