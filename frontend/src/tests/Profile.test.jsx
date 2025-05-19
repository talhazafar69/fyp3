import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Profile from '../pages/Profile'
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

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('fake-token')
  })

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to auth page if no token', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/auth')
    })
  })

  it('displays user profile data when loaded', async () => {
    const mockUserData = {
      name: 'Test User',
      email: 'test@test.com',
      role: 'patient',
      createdAt: '2023-01-01T00:00:00.000Z',
    }
    
    mockFetch(mockUserData)
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@test.com')).toBeInTheDocument()
      expect(screen.getByText('Patient')).toBeInTheDocument()
    })
  })

  it('handles logging out correctly', async () => {
    const mockUserData = {
      name: 'Test User',
      email: 'test@test.com',
      role: 'patient',
      createdAt: '2023-01-01T00:00:00.000Z',
    }
    
    mockFetch(mockUserData)
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })
    
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    expect(mockedNavigate).toHaveBeenCalledWith('/login')
  })

  it('allows editing the profile', async () => {
    const mockUserData = {
      name: 'Test User',
      email: 'test@test.com',
      role: 'patient',
      createdAt: '2023-01-01T00:00:00.000Z',
    }
    
    mockFetch(mockUserData)
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })
    
    // Click edit button
    const editButton = screen.getByText('Edit Profile')
    fireEvent.click(editButton)
    
    // Edit form should be visible now
    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    
    // Update name field
    const nameInput = screen.getByLabelText('Name')
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } })
    
    // Mock the update response
    mockFetch({
      name: 'Updated Name',
      email: 'test@test.com',
      role: 'patient',
      createdAt: '2023-01-01T00:00:00.000Z',
    })
    
    // Submit the form
    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)
    
    // Check that the API was called with token
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users/me', expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Authorization': 'Bearer fake-token'
        })
      }))
    })
  })

  it('handles back button navigation correctly for hakeem', async () => {
    const mockUserData = {
      name: 'Test Hakeem',
      email: 'hakeem@test.com',
      role: 'hakeem',
      createdAt: '2023-01-01T00:00:00.000Z',
    }
    
    mockFetch(mockUserData)
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Hakeem')).toBeInTheDocument()
    })
    
    const backButton = screen.getByText('Back')
    fireEvent.click(backButton)
    
    expect(mockedNavigate).toHaveBeenCalledWith('/hakeem-dashboard')
  })

  it('handles back button navigation correctly for patient', async () => {
    const mockUserData = {
      name: 'Test Patient',
      email: 'patient@test.com',
      role: 'patient',
      createdAt: '2023-01-01T00:00:00.000Z',
    }
    
    mockFetch(mockUserData)
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Patient')).toBeInTheDocument()
    })
    
    const backButton = screen.getByText('Back')
    fireEvent.click(backButton)
    
    expect(mockedNavigate).toHaveBeenCalledWith('/chatbot')
  })
}) 