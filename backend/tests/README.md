# API Tests for AI Hakeem Backend

This directory contains automated tests for the AI Hakeem backend API endpoints.

## Test Coverage

The tests cover the following API endpoints:

1. **Authentication API**
   - Patient Signup
   - Hakeem Signup
   - Patient Login
   - Hakeem Login
   - Get Current User

2. **User Management API**
   - Get User Profile
   - Update User Profile

3. **Clinic Management API**
   - Create Clinic
   - Get All Clinics
   - Get Clinic by ID
   - Update Clinic

4. **Appointment Management API**
   - Create Appointment
   - Get Appointments (Patient view)
   - Get Appointments (Hakeem view)
   - Update Appointment Status

5. **Chatbot API**
   - Process Message

6. **Hakeem Dashboard API**
   - Get Hakeem Dashboard

## Remaining Endpoints to Implement

The following endpoints still need to be implemented according to the project plan:

1. **Hakeem Search API**
   - GET /api/hakeems - Search hakeems by location, specialty, or name
   - GET /api/hakeems/:hakeemId - Get detailed hakeem profile

2. **Appointment Availability API**
   - GET /api/appointments/availability/:hakeemId - Get available slots for a hakeem
   - POST /api/appointments/cancel/:appointmentId - Cancel an appointment

3. **Herbal Medicine Database API**
   - GET /api/herbal-medicines - Get list of herbal medicines
   - GET /api/herbal-medicines/:id - Get details of a specific herbal medicine
   - GET /api/herbal-medicines/search - Search herbal medicines by symptoms or name

## Running the Tests

1. First, update your backend package.json with the dependencies and scripts from the package.json.update file:

   ```bash
   npm install --save-dev jest supertest
   ```

2. Add the test scripts to your package.json:

   ```json
   "scripts": {
     "test": "jest --detectOpenHandles",
     "test:watch": "jest --watch"
   }
   ```

3. Create a test MongoDB database (or use a test instance of your existing database)

4. Set the environment variable for the test database:

   ```bash
   # For Windows
   set MONGODB_URI_TEST=mongodb://localhost:27017/herbal-chatbot-test
   
   # For Linux/Mac
   export MONGODB_URI_TEST=mongodb://localhost:27017/herbal-chatbot-test
   ```

5. Run the tests:

   ```bash
   npm test
   ```

## Notes

- The tests use a separate test database to avoid affecting your development or production data.
- The tests clean up after themselves by deleting test data before and after running.
- You may need to modify the tests if your API structure or response format differs from what's expected in the tests.