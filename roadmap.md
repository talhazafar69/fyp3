Project Prompt: Herbal Chatbot and Appointment Booking System

Develop a full-stack web application using the MERN stack (MongoDB, Express.js, React, Node.js) with Vite for the frontend setup. The application is a herbal chatbot and appointment booking system focused on Pakistani herbal medicines and hakeems (herbal doctors). It must use the latest versions of all libraries and tools to avoid compatibility issues. The theme should be simple, using a light green (#90EE90) and white (#FFFFFF) color scheme.



Core Features

1. User Authentication





Separate login/signup for patients and hakeems.



Patients: Fields: name, email, password.



Hakeems: Fields: name, email, password, and an additional license number (stored as a string, no verification required).



Use JWT (JSON Web Tokens) for token-based authentication.



Protect routes to ensure only authenticated users access relevant features.

2. Herbal Chatbot





A rule-based chatbot (not ML-based for simplicity, despite the query mentioning ML) allowing patients to enter symptoms via free text.



Extract symptoms using keyword matching or a library like string-similarity.



Respond with Pakistani herbal medicine recommendations based on a predefined dataset.



Interface: Mimic ChatGPT—simple and elegant with a text input and conversation history.



Implement a custom chat component or use a library like react-chatbot-kit.

3. Hakeem Search and Profiles





Patients can search hakeems by location, specialty, or name using filters.



Display hakeem profiles with:





Clinic details: location, fees, timings, availability, specialty.



Include a "Book Appointment" button on each profile.

4. Appointment Booking





Patients can book appointments with hakeems if unsatisfied with the chatbot.



Hakeems set their availability:





Fields: working days (e.g., Mon-Fri), start time (e.g., 9:00 AM), end time (e.g., 5:00 PM), slot duration (e.g., 30 minutes).



Backend calculates available slots for a given date, excluding booked appointments.



Prevent double bookings by checking existing appointments for the hakeem, date, and time.



Patients can cancel appointments.

5. Dashboards





Patient Dashboard:





List of upcoming appointments with patient name, hakeem, date, time, and a cancel option.



Hakeem Dashboard:





Display today’s appointments with patient name, time, and status (e.g., "upcoming", "completed").



Interpret "incoming" as upcoming patients and "outgoing" as completed ones.

6. Profile Settings





Both patients and hakeems can:





Update personal info (name, email).



Logout.



Hakeems can also update clinic details (location, fees, timings, specialty).

7. Clinic Registration





After hakeem signup/login, provide a form to register their clinic with:





Location, timings, availability, fees, specialty.



Technical Specifications

Frontend





Framework: React with Vite for fast setup and builds.



Routing: Use React Router for navigation.



Pages:





Home: Landing page with app info and login/signup links.



Login: Form with email, password, and role selector (patient/hakeem).



Signup: Form with name, email, password, role, and license number (for hakeems).



Chatbot: Full-screen chat interface for patients.



Hakeem Search: Search bar, filters, and list of hakeems.



Hakeem Profile: Clinic details and booking option.



Appointment Booking: Select date and available time slots.



Patient Dashboard: Upcoming appointments with cancel button.



Hakeem Dashboard: Today’s appointments.



Profile Settings: Update info and logout.



Clinic Registration: Form for hakeems to input clinic details.



Styling: Use CSS modules or SCSS with variables for light green (#90EE90) and white (#FFFFFF).



Ensure responsiveness across screen sizes.



Handle loading states (e.g., spinners) and errors (e.g., messages).

Backend





Server: Node.js with Express.js.



Database: MongoDB with Mongoose for schema management.



RESTful APIs:





POST /api/auth/signup: Register user (patient/hakeem).



POST /api/auth/login: Login and return JWT.



GET /api/users/me: Get current user details.



PUT /api/users/me: Update current user details.



POST /api/chatbot: Send message, return herbal medicine recommendations.



GET /api/hakeems: List hakeems with filters (location, specialty, name).



GET /api/hakeems/:id: Get specific hakeem details.



GET /api/hakeems/:id/available-slots?date=YYYY-MM-DD: Get available slots for a hakeem on a date.



POST /api/appointments: Book an appointment.



DELETE /api/appointments/:id: Cancel an appointment.



GET /api/appointments: Get user’s appointments (filter by role and date for hakeems).



POST /api/clinics: Register/update clinic details (hakeems only).



Middleware: Authenticate requests with JWT and restrict access by role (patient/hakeem).

Database Schema





Users Collection:





id, name, email, password (hashed), role (patient/hakeem), license_number (hakeems only), clinic_details (embedded for hakeems: location, timings, fees, specialty, availability {working_days, start_time, end_time, slot_duration}).



Appointments Collection:





id, patient_id, hakeem_id, date, time, status (booked, completed, cancelled).



HerbalMedicines Collection:





id, name, description, indications (array of symptoms, e.g., ["cough", "fever"]).

Chatbot Logic





Take user input (e.g., "I have a cough and fever").



Split into words, match against symptoms in HerbalMedicines using keyword matching.



Return medicines where indications include matched symptoms.



Include a seed script to populate the database with 20-30 sample medicines (e.g., Habb-e-Shifa for cough, Joshanda for fever).



Additional Requirements





Security: Validate inputs, hash passwords, restrict routes by role.



Error Handling: Return meaningful error messages (e.g., "Slot already booked").



Code Quality: Use ESLint and Prettier.



Setup: Include package.json files with dependencies and instructions for environment variables (e.g., MongoDB URI, JWT secret).



Deployment: Provide steps to run locally (e.g., npm install, npm run dev for frontend/backend).



This application should be a functional prototype for a final year project, balancing complexity and feasibility while meeting all specified requirements.