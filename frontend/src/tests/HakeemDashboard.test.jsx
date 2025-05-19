import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HakeemDashboard from '../pages/HakeemDashboard'
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

describe('HakeemDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('fake-token')
  })

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <HakeemDashboard />
      </MemoryRouter>
    )
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument()
  })

  it('redirects to login page if no token', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(
      <MemoryRouter>
        <HakeemDashboard />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('displays hakeem dashboard with appointments', async () => {
    const mockUserData = {
      name: 'Dr. Test Hakeem',
    }

    const mockAppointments = [
      {
        _id: 'app1',
        patient_id: { name: 'Patient One' },
        date: '2023-05-20',
        time: '10:00 AM',
        status: 'booked',
        notes: 'First consultation'
      },
      {
        _id: 'app2',
        patient_id: { name: 'Patient Two' },
        date: '2023-05-21',
        time: '11:00 AM',
        status: 'completed',
        notes: 'Follow-up'
      }
    ]
    
    // Mock user data fetch
    mockFetch(mockUserData)
    
    // Mock appointments fetch (second API call)
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockAppointments)
    }))
    
    render(
      <MemoryRouter>
        <HakeemDashboard />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Welcome, Dr. Test Hakeem')).toBeInTheDocument()
    })
    
    // Verify appointments are displayed
    expect(screen.getByText('Patient One')).toBeInTheDocument()
    expect(screen.getByText('First consultation')).toBeInTheDocument()
    expect(screen.getByText('Patient Two')).toBeInTheDocument()
    expect(screen.getByText('Follow-up')).toBeInTheDocument()
  })

  it('handles marking an appointment as completed', async () => {
    const mockUserData = {
      name: 'Dr. Test Hakeem',
    }

    const mockAppointments = [
      {
        _id: 'app1',
        patient_id: { name: 'Patient One' },
        date: '2023-05-20',
        time: '10:00 AM',
        status: 'booked',
        notes: 'First consultation'
      }
    ]
    
    // Mock user data fetch
    mockFetch(mockUserData)
    
    // Mock appointments fetch
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockAppointments)
    }))
    
    render(
      <MemoryRouter>
        <HakeemDashboard />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Patient One')).toBeInTheDocument()
    })
    
    // Mock the update response
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'completed' })
    }))
    
    // Click "Mark as Completed" button
    const completeButton = screen.getByText('Mark as Completed')
    fireEvent.click(completeButton)
    
    // Check that the API was called with the right params
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/appointments/app1', 
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Authorization': 'Bearer fake-token'
          }),
          body: expect.stringContaining('completed')
        })
      )
    })
  })

  it('navigates to clinic management when button is clicked', async () => {
    const mockUserData = {
      name: 'Dr. Test Hakeem',
    }

    const mockAppointments = []
    
    // Mock user data fetch
    mockFetch(mockUserData)
    
    // Mock appointments fetch
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockAppointments)
    }))
    
    render(
      <MemoryRouter>
        <HakeemDashboard />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Welcome, Dr. Test Hakeem')).toBeInTheDocument()
    })
    
    // Click "Manage Clinic" button
    const clinicButton = screen.getByText('Manage Clinic')
    fireEvent.click(clinicButton)
    
    expect(mockedNavigate).toHaveBeenCalledWith('/clinic-registration')
  })

  it('displays profile icon that links to profile page', async () => {
    const mockUserData = {
      name: 'Dr. Test Hakeem',
    }

    const mockAppointments = []
    
    mockFetch(mockUserData)
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockAppointments)
    }))
    
    render(
      <MemoryRouter>
        <HakeemDashboard />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Welcome, Dr. Test Hakeem')).toBeInTheDocument()
    })
    
    // Find profile icon (it should be a link with profile-icon class)
    const profileIcon = document.querySelector('.profile-icon')
    expect(profileIcon).toBeInTheDocument()
    expect(profileIcon.getAttribute('href')).toBe('/profile')
  })
}) 