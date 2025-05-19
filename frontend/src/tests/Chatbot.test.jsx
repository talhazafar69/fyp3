import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Chatbot from '../pages/Chatbot'
import { mockFetch } from './setup'

// Mock React Router's navigate function
const mockedNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  }
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Chatbot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('fake-token')
    
    // Mock chat history fetch with empty array
    mockFetch([])
  })

  it('renders initial greeting message', () => {
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    )
    
    expect(screen.getByText("Hello! I'm your AI Hakeem assistant. How can I help you today?")).toBeInTheDocument()
  })

  it('fetches chat history on load', async () => {
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    )
    
    // Verify that fetch was called with correct endpoint
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/chatbot/history', expect.objectContaining({
        headers: {
          'Authorization': 'Bearer fake-token'
        }
      }))
    })
  })

  it('allows sending a message and receives response', async () => {
    // Mock the chatbot response
    const mockResponse = {
      response: "Garlic is commonly used in herbal medicine for its health benefits."
    }

    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    )
    
    // Type a message
    const inputField = screen.getByPlaceholderText('Type your message here...')
    fireEvent.change(inputField, { target: { value: 'Tell me about garlic' } })
    
    // Mock the fetch response for the chatbot API
    mockFetch(mockResponse)
    
    // Submit the message
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    
    // Check that the user message is shown
    expect(screen.getByText('Tell me about garlic')).toBeInTheDocument()
    
    // Check that API was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/chatbot', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }),
        body: expect.stringContaining('Tell me about garlic')
      }))
    })
    
    // Check that bot response is displayed
    await waitFor(() => {
      expect(screen.getByText('Garlic is commonly used in herbal medicine for its health benefits.')).toBeInTheDocument()
    })
  })

  it('displays loading state while waiting for bot response', async () => {
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    )
    
    // Type and send a message
    const inputField = screen.getByPlaceholderText('Type your message here...')
    fireEvent.change(inputField, { target: { value: 'Hello' } })
    
    // Create a promise that never resolves
    global.fetch.mockImplementationOnce(() => new Promise(() => {}))
    
    // Submit the message
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    
    // Loading indicator should appear
    await waitFor(() => {
      expect(document.querySelector('.loading-indicator')).toBeInTheDocument()
    })
  })

  it('loads chat history when available', async () => {
    const mockChatHistory = [
      {
        id: 'chat-1',
        title: 'Previous Chat',
        date: new Date().toISOString(),
        messages: [
          { id: 1, sender: 'user', text: 'Hello bot', timestamp: new Date().toISOString() },
          { id: 2, sender: 'bot', text: 'Hello user', timestamp: new Date().toISOString() }
        ]
      }
    ]
    
    // Mock chat history fetch
    mockFetch(mockChatHistory)
    
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    )
    
    // Check that history item is displayed in sidebar
    await waitFor(() => {
      expect(screen.getByText('Previous Chat')).toBeInTheDocument()
    })
  })

  it('creates a new chat when button is clicked', async () => {
    const mockChatHistory = [
      {
        id: 'chat-1',
        title: 'Previous Chat',
        date: new Date().toISOString(),
        messages: [
          { id: 1, sender: 'user', text: 'Hello bot', timestamp: new Date().toISOString() },
          { id: 2, sender: 'bot', text: 'Hello user', timestamp: new Date().toISOString() }
        ]
      }
    ]
    
    // Mock chat history fetch
    mockFetch(mockChatHistory)
    
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Previous Chat')).toBeInTheDocument()
    })
    
    // Mock chat history save API
    mockFetch({ success: true, chatHistory: {} })
    
    // Click new chat button
    const newChatButton = screen.getByText('+ New Chat')
    fireEvent.click(newChatButton)
    
    // Check we go back to initial message
    expect(screen.getByText("Hello! I'm your AI Hakeem assistant. How can I help you today?")).toBeInTheDocument()
    expect(screen.queryByText('Hello bot')).not.toBeInTheDocument()
    expect(screen.queryByText('Hello user')).not.toBeInTheDocument()
  })

  it('navigates to profile page when profile link is clicked', async () => {
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    )
    
    // Click profile link
    const profileLink = screen.getByText('Profile')
    fireEvent.click(profileLink)
    
    // Check that it has proper href
    expect(profileLink.getAttribute('href')).toBe('/profile')
  })

  it('navigates to find hakeem page when find hakeems link is clicked', async () => {
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    )
    
    // Click find hakeems link  
    const findHakeemsLink = screen.getByText('Find Hakeems')
    fireEvent.click(findHakeemsLink)
    
    // Check that it has proper href
    expect(findHakeemsLink.getAttribute('href')).toBe('/hakeems')
  })
}) 