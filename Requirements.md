# AI HAKEEM - COMPREHENSIVE PROJECT DOCUMENTATION

## 1. PROJECT OVERVIEW

AI Hakeem is a comprehensive telemedicine platform connecting patients with traditional medicine practitioners (Hakeems) in Pakistan. The system leverages artificial intelligence to provide initial symptom assessment through a chatbot and facilitates appointment scheduling with qualified Hakeem practitioners.

## 2. FUNCTIONAL REQUIREMENTS

### User Management
- FR1: Users shall be able to register as either patients or Hakeems
- FR2: Users shall be able to log in with email and password
- FR3: Users shall be able to view and update their profiles
- FR4: Users shall be able to reset passwords if forgotten
- FR5: The system shall authenticate users before allowing access to protected resources

### Patient Features
- FR6: Patients shall be able to interact with an AI chatbot for initial health assessment
- FR7: Patients shall be able to search for Hakeems by name, specialty, or location
- FR8: Patients shall be able to view Hakeem profiles with details including clinic information
- FR9: Patients shall be able to book appointments with available Hakeems
- FR10: Patients shall be able to view and manage their appointment history
- FR11: Patients shall be able to start new chat sessions with the AI assistant
- FR12: Patients shall be able to view their chat history with the AI

### Hakeem Features
- FR13: Hakeems shall be able to set up and manage their clinic information
- FR14: Hakeems shall be able to view their dashboard with appointment statistics
- FR15: Hakeems shall be able to set available time slots for appointments
- FR16: Hakeems shall be able to view upcoming appointments
- FR17: Hakeems shall be able to mark appointments as completed
- FR18: Hakeems shall be able to update their specialty and professional information

### Appointment Management
- FR19: The system shall prevent double-booking of appointment slots
- FR20: The system shall send notifications for appointment confirmations
- FR21: The system shall allow rescheduling of appointments
- FR22: The system shall maintain a history of all appointments

### AI Chatbot
- FR23: The chatbot shall provide health assessment based on symptoms described
- FR24: The chatbot shall recommend relevant Hakeem specialties based on assessment
- FR25: The chatbot shall maintain conversation context within a session
- FR26: The chatbot shall save conversation history for future reference

## 3. NON-FUNCTIONAL REQUIREMENTS

### Performance
- NFR1: The system shall respond to user interactions within 2 seconds
- NFR2: The system shall support at least 1000 concurrent users
- NFR3: The chatbot shall respond to queries within 5 seconds

### Security
- NFR4: All passwords shall be stored as hashed values, not plaintext
- NFR5: All API communication shall be encrypted using HTTPS
- NFR6: User authentication tokens shall expire after 24 hours
- NFR7: The system shall implement role-based access control

### Usability
- NFR8: The user interface shall be responsive and work on mobile devices
- NFR9: The system shall provide clear error messages to users
- NFR10: The chatbot interface shall be intuitive with minimal instructions needed

### Reliability
- NFR11: The system shall have 99.5% uptime
- NFR12: The system shall perform daily database backups
- NFR13: The system shall handle exceptions gracefully without crashing

### Scalability
- NFR14: The architecture shall allow horizontal scaling to handle increased load
- NFR15: Database design shall optimize for query performance as data grows

### Compatibility
- NFR16: The web application shall work on major browsers (Chrome, Firefox, Safari, Edge)
- NFR17: The system shall be accessible on both desktop and mobile devices

## 4. USE CASES

### Patient Use Cases
1. UC1: Register as patient
2. UC2: Log in to patient account
3. UC3: Update patient profile
4. UC4: Interact with AI chatbot
5. UC5: Search for Hakeems
6. UC6: View Hakeem profile
7. UC7: Book appointment with Hakeem
8. UC8: View appointment history
9. UC9: View chat history
10. UC10: Start new chat with AI
11. UC11: Reset password

### Hakeem Use Cases
12. UC12: Register as Hakeem
13. UC13: Log in to Hakeem account
14. UC14: Update Hakeem profile
15. UC15: Set up clinic information
16. UC16: View dashboard statistics
17. UC17: Set available appointment slots
18. UC18: View upcoming appointments
19. UC19: Mark appointment as completed
20. UC20: Reset password

### Administrator Use Cases
21. UC21: Verify Hakeem credentials
22. UC22: Manage user accounts
23. UC23: View system statistics
24. UC24: Configure system settings

## 5. TEST CASES AND RESULTS

### Backend Test Cases

#### Authentication Tests
- TC1: User registration with valid data (PASS)
- TC2: User registration with invalid data (PASS)
- TC3: User login with correct credentials (PASS)
- TC4: User login with incorrect credentials (PASS)
- TC5: Password reset request (PASS)
- TC6: Access protected route without token (PASS)
- TC7: Access protected route with invalid token (PASS)

#### User API Tests
- TC8: Fetch current user profile (PASS)
- TC9: Update user profile with valid data (PASS)
- TC10: Update user password (PASS)
- TC11: Access user data without authentication (PASS)

#### Hakeem API Tests
- TC12: Search Hakeems without filters (PASS)
- TC13: Search Hakeems by name (PASS)
- TC14: Search Hakeems by specialty (PASS)
- TC15: Search Hakeems by location (PASS)
- TC16: Get specific Hakeem profile by ID (PASS)
- TC17: Get available slots for specific Hakeem (PASS)
- TC18: Try accessing nonexistent Hakeem (PASS)

#### Appointment API Tests
- TC19: Create appointment with valid data (PASS)
- TC20: Get patient appointments (PASS)
- TC21: Get Hakeem appointments (PASS)
- TC22: Update appointment status (PASS)
- TC23: Try double-booking slot (PASS)
- TC24: Cancel appointment (PASS)

#### Chatbot API Tests
- TC25: Send message to chatbot (PASS)
- TC26: Retrieve chat history (PASS)
- TC27: Create new chat session (PASS)
- TC28: Save chat session (PASS)

#### Dashboard API Tests
- TC29: Get Hakeem dashboard data (PASS)
- TC30: Patient accessing Hakeem dashboard (PASS)
- TC31: Dashboard with appointment data (PASS)
- TC32: Dashboard appointment statistics (PASS)

#### Clinic API Tests
- TC33: Register clinic with valid data (PASS)
- TC34: Get clinic information (PASS)
- TC35: Update clinic details (PASS)
- TC36: Access clinic data without authorization (PASS)

### Frontend Test Cases

#### Profile Component Tests
- TC37: Renders loading state initially (PASS)
- TC38: Redirects to auth page if no token (PASS)
- TC39: Displays user profile data when loaded (PASS)
- TC40: Handles logging out correctly (PASS)
- TC41: Allows editing the profile (PASS)
- TC42: Handles back button navigation for Hakeem (PASS)
- TC43: Handles back button navigation for patient (PASS)

#### Hakeem Dashboard Component Tests
- TC44: Renders loading state initially (PASS)
- TC45: Redirects to login page if no token (PASS)
- TC46: Displays Hakeem dashboard with appointments (PASS)
- TC47: Handles marking an appointment as completed (PASS)
- TC48: Navigates to clinic management (PASS)
- TC49: Displays profile icon with link to profile page (PASS)

#### Find Hakeem Component Tests
- TC50: Renders loading state initially (PASS)
- TC51: Redirects to login page if no token (PASS)
- TC52: Displays Hakeem search results (PASS)
- TC53: Allows searching for Hakeem by name (PASS)
- TC54: Allows filtering by specialty and location (PASS)
- TC55: Shows book appointment modal when book button clicked (PASS)
- TC56: Navigates to chatbot page when back button is clicked (PASS)
- TC57: Refreshes Hakeem listings when refresh button is clicked (PASS)

#### Chatbot Component Tests
- TC58: Renders initial greeting message (PASS)
- TC59: Fetches chat history on load (PASS)
- TC60: Allows sending a message and receives response (PASS)
- TC61: Displays loading state while waiting for bot response (PASS)
- TC62: Loads chat history when available (PASS)
- TC63: Creates a new chat when button is clicked (PASS)
- TC64: Navigates to profile page when profile link is clicked (PASS)
- TC65: Navigates to find Hakeem page when find Hakeems link is clicked (PASS)

## 6. SYSTEM ARCHITECTURE

AI Hakeem uses a modern web application architecture consisting of:

### Frontend
- **Technology**: React.js with Vite
- **State Management**: React Context API and Hooks
- **Routing**: React Router
- **Testing**: Vitest, React Testing Library, MSW for API mocking
- **Key Components**:
  - Authentication (Login/Register)
  - User Profile
  - Chatbot Interface
  - Hakeem Search and Filtering
  - Appointment Booking System
  - Hakeem Dashboard
  - Clinic Management

### Backend
- **Technology**: Node.js with Express
- **Database**: MongoDB (NoSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **API Design**: RESTful API
- **Testing**: Jest and Supertest
- **Key Modules**:
  - Authentication Service
  - User Service
  - Hakeem Service
  - Appointment Service
  - Chatbot Service
  - Clinic Service
  - Dashboard Service

### Data Layer
- MongoDB for structured data:
  - User collection (patients and Hakeems)
  - Appointment collection
  - Chat history collection
  - Clinic information collection

### Integration Points
- **AI Integration**: The chatbot communicates with an AI service for symptom analysis
- **Authentication**: JWT for secure API communication
- **Data Flow**: Frontend components make API calls to backend services

## 7. DOMAIN MODEL

The key entities in the system are:

### User
- Base class with common attributes (id, name, email, password, role)
- Extended by Patient and Hakeem subclasses

### Patient
- Extends User
- Has attributes for medical history, age, gender
- Has relationships to appointments and chat sessions

### Hakeem
- Extends User
- Has attributes for specialty, license number, experience
- Has relationships to clinic, appointments, available slots

### Appointment
- Links Patient and Hakeem
- Has attributes for date, time, status, notes
- Status transitions: booked → completed/cancelled

### Clinic
- Belongs to one Hakeem
- Has attributes for name, address, contact information, fees
- Has services offered

### Chat Session
- Belongs to a Patient
- Contains multiple messages
- Has attributes for date, title

### Message
- Part of a Chat Session
- Has attributes for text, sender (user/bot), timestamp

## 8. STATE TRANSITIONS

### Appointment States
1. **Requested**: Initial state when patient requests an appointment
2. **Booked**: Appointment confirmed and scheduled
3. **Completed**: Appointment has taken place
4. **Cancelled**: Appointment cancelled by patient or Hakeem
5. **No-show**: Patient didn't attend the appointment

### User Account States
1. **Registered**: Account created but not verified
2. **Active**: Normal operating state
3. **Suspended**: Temporarily deactivated (manual action)
4. **Deactivated**: User has deactivated their account

### Chatbot Conversation States
1. **New**: Fresh conversation started
2. **In-progress**: Active conversation
3. **Recommending**: Providing health advice/recommendations
4. **Referring**: Suggesting to see specific Hakeem specialty
5. **Saved**: Conversation stored in history

## 9. SYSTEM FLOW

### Patient Journey
1. Patient registers and logs in
2. Patient interacts with AI chatbot describing symptoms
3. Chatbot provides initial assessment and recommends Hakeem specialty
4. Patient searches for Hakeems by specialty or location
5. Patient views Hakeem profiles and clinic information
6. Patient books appointment with selected Hakeem
7. Patient receives appointment confirmation
8. Patient attends appointment (physical/virtual)
9. Patient can view appointment history and chat history

### Hakeem Journey
1. Hakeem registers with professional credentials
2. Admin verifies Hakeem credentials (manual process)
3. Hakeem sets up clinic information
4. Hakeem configures available appointment slots
5. Hakeem views upcoming appointments on dashboard
6. Hakeem conducts appointments
7. Hakeem marks appointments as completed
8. Hakeem views appointment statistics

## 10. RELATIONSHIPS BETWEEN ENTITIES (ERD BASIS)

### One-to-One Relationships
- Hakeem to Clinic: Each Hakeem has one clinic

### One-to-Many Relationships
- User to Appointments: One user can have many appointments
- Patient to Chat Sessions: One patient can have many chat sessions
- Chat Session to Messages: One chat session contains many messages
- Hakeem to Available Slots: One Hakeem has many available time slots

### Many-to-Many Relationships
- Patient to Hakeem: Connected through appointments

## 11. SYSTEM IMPLEMENTATION DETAILS

### Authentication Flow
1. User enters credentials
2. Backend validates credentials
3. If valid, JWT token is generated and returned
4. Frontend stores token in localStorage
5. Token is sent with subsequent API requests
6. Backend middleware validates token for protected routes

### Appointment Booking Flow
1. Patient selects Hakeem
2. System displays Hakeem's available slots
3. Patient selects date and time
4. System verifies slot availability
5. System creates appointment record
6. System notifies Hakeem of new appointment
7. Appointment appears in both Patient's and Hakeem's dashboards

### Chatbot Interaction Flow
1. Patient starts or continues chat session
2. Patient enters symptoms or questions
3. System processes input and generates appropriate response
4. If assessment indicates professional care needed, system recommends Hakeem specialty
5. Chat history is saved for future reference

### Database Schema Considerations
- Optimized for query performance
- Properly indexed fields for search operations
- Structured for efficient data retrieval
- Designed with scalability in mind

## 12. CONCLUSION

The AI Hakeem system represents a comprehensive telemedicine platform that bridges traditional medicine practitioners with patients through modern technology. Its key innovations include:

1. AI-powered initial health assessment
2. Streamlined appointment booking process
3. Specialized focus on traditional medicine practitioners
4. Complete clinic management system for Hakeems
5. Comprehensive patient history tracking

This platform addresses healthcare accessibility challenges in regions where traditional medicine is practiced while providing modern conveniences of digital healthcare systems.

The test results indicate that all core functionalities are working as expected, with both backend API tests and frontend component tests passing successfully. 