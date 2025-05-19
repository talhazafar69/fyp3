import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FindHakeem from '../pages/FindHakeem'
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

describe('FindHakeem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('fake-token')
  })

  it('renders loading state initially', () => {
    // Mock initial hakeem fetch
    mockFetch([])
    
    render(
      <MemoryRouter>
        <FindHakeem />
      </MemoryRouter>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to login page if no token', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(
      <MemoryRouter>
        <FindHakeem />
      </MemoryRouter>
    )
    
    // Since we're redirecting via window.location.href
    expect(global.window.location.href).toBe('/login')
  })

  it('displays hakeem search results', async () => {
    const mockHakeems = [
      {
        _id: 'hakeem1',
        name: 'Dr. First Hakeem',
        specialty: 'Digestive Health',
        location: 'Lahore',
        experience: '5 years',
        rating: 4.5,
        clinic: {
          name: 'Herbal Wellness Clinic',
          city: 'Lahore',
          address: { street: '123 Main St', city: 'Lahore' },
          fees: 1500,
          services_offered: ['Consultations', 'Herbal Remedies']
        }
      },
      {
        _id: 'hakeem2',
        name: 'Dr. Second Hakeem',
        specialty: 'Respiratory Health',
        location: 'Karachi',
        experience: '8 years',
        rating: 4.8,
        clinic: {
          name: 'Respiratory Care Center',
          city: 'Karachi',
          address: { street: '456 Park Ave', city: 'Karachi' },
          fees: 2000,
          services_offered: ['Consultations', 'Breathing Treatments']
        }
      }
    ]
    
    // Mock initial hakeem fetch
    mockFetch(mockHakeems)
    
    // Mock user role check
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ role: 'patient' })
    }))
    
    render(
      <MemoryRouter>
        <FindHakeem />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Dr. First Hakeem')).toBeInTheDocument()
      expect(screen.getByText('Dr. Second Hakeem')).toBeInTheDocument()
    })
    
    // Check clinic info is displayed
    expect(screen.getByText('Clinic: Herbal Wellness Clinic')).toBeInTheDocument()
    expect(screen.getByText('Fees: Rs. 1500')).toBeInTheDocument()
    expect(screen.getByText('Clinic: Respiratory Care Center')).toBeInTheDocument()
    expect(screen.getByText('Fees: Rs. 2000')).toBeInTheDocument()
  })

  it('allows searching for hakeem by name', async () => {
    // Mock initial fetch
    mockFetch([
      { _id: 'hakeem1', name: 'Dr. First Hakeem', specialty: 'Digestive Health' }
    ])
    
    // Mock user role check
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ role: 'patient' })
    }))
    
    render(
      <MemoryRouter>
        <FindHakeem />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Dr. First Hakeem')).toBeInTheDocument()
    })
    
    // Mock search results
    mockFetch([
      { _id: 'hakeem3', name: 'Dr. John Smith', specialty: 'Skin Care' }
    ])
    
    // Enter search query
    const searchInput = screen.getByPlaceholderText('Search by name or keyword')
    fireEvent.change(searchInput, { target: { value: 'John' } })
    
    // Submit search form
    const searchButton = screen.getByText('Search')
    fireEvent.click(searchButton)
    
    // Check that the API was called with name parameter
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/hakeems/search?name=John',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer fake-token',
          })
        })
      )
    })
    
    // Check search results displayed
    await waitFor(() => {
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument()
    })
  })

  it('allows filtering by specialty and location', async () => {
    // Mock initial fetch
    mockFetch([
      { _id: 'hakeem1', name: 'Dr. First Hakeem', specialty: 'Digestive Health', location: 'Lahore' }
    ])
    
    // Mock user role check
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ role: 'patient' })
    }))
    
    render(
      <MemoryRouter>
        <FindHakeem />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Dr. First Hakeem')).toBeInTheDocument()
    })
    
    // Mock search results
    mockFetch([
      { _id: 'hakeem4', name: 'Dr. Specialist', specialty: 'Skin Care', location: 'Islamabad' }
    ])
    
    // Select specialty
    const specialtySelect = screen.getByText('Select Specialty')
    fireEvent.change(specialtySelect, { target: { value: 'Skin Care' } })
    
    // Select location
    const locationSelect = screen.getByText('Select Location')
    fireEvent.change(locationSelect, { target: { value: 'Islamabad' } })
    
    // Submit search form
    const searchButton = screen.getByText('Search')
    fireEvent.click(searchButton)
    
    // Check that the API was called with correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/hakeems/search?specialty=Skin%20Care&location=Islamabad',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer fake-token',
          })
        })
      )
    })
    
    // Check search results displayed
    await waitFor(() => {
      expect(screen.getByText('Dr. Specialist')).toBeInTheDocument()
    })
  })

  it('shows book appointment modal when book button clicked', async () => {
    const mockHakeems = [
      {
        _id: 'hakeem1',
        name: 'Dr. First Hakeem',
        specialty: 'Digestive Health',
        location: 'Lahore'
      }
    ]
    
    // Mock initial hakeem fetch
    mockFetch(mockHakeems)
    
    // Mock user role check
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ role: 'patient' })
    }))
    
    render(
      <MemoryRouter>
        <FindHakeem />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Dr. First Hakeem')).toBeInTheDocument()
    })
    
    // Click book appointment
    const bookButton = screen.getByText('Book Appointment')
    fireEvent.click(bookButton)
    
    // Check that date picker modal is shown
    expect(screen.getByText('Select Appointment Date')).toBeInTheDocument()
  })

  it('navigates to chatbot page when back button is clicked', async () => {
    // Mock initial hakeem fetch
    mockFetch([])
    
    // Mock user role check
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ role: 'patient' })
    }))
    
    render(
      <MemoryRouter>
        <FindHakeem />
      </MemoryRouter>
    )
    
    // Find and click back button
    const backButton = screen.getByText('← Back to Chatbot')
    fireEvent.click(backButton)
    
    // Since we're using Link, check that it has the correct 'to' prop
    expect(backButton.getAttribute('href')).toBe('/chatbot')
  })

  it('refreshes hakeem listings when refresh button is clicked', async () => {
    // Mock initial fetch
    mockFetch([
      { _id: 'hakeem1', name: 'Dr. First Hakeem', specialty: 'Digestive Health' }
    ])
    
    // Mock user role check
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ role: 'patient' })
    }))
    
    render(
      <MemoryRouter>
        <FindHakeem />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Dr. First Hakeem')).toBeInTheDocument()
    })
    
    // Mock refresh results with new hakeem
    mockFetch([
      { _id: 'hakeem1', name: 'Dr. First Hakeem', specialty: 'Digestive Health' },
      { _id: 'hakeem5', name: 'Dr. New Hakeem', specialty: 'Joint & Muscle Health' }
    ])
    
    // Click refresh button
    const refreshButton = screen.getByText('↻ Refresh Listings')
    fireEvent.click(refreshButton)
    
    // Check that the API was called again
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/hakeems/search',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer fake-token',
          })
        })
      )
    })
    
    // Check that new hakeem is displayed
    await waitFor(() => {
      expect(screen.getByText('Dr. New Hakeem')).toBeInTheDocument()
    })
  })
}) 