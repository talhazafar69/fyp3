# Testing Documentation for AI Hakeem

This document provides comprehensive information on how to run tests for the AI Hakeem application, covering both backend and frontend testing.

## Overview

The AI Hakeem application has a complete test suite covering:

1. **Backend API Testing**: Using Jest and Supertest
2. **Frontend Component Testing**: Using Vitest and React Testing Library

## Requirements

To run tests, you need:

- Node.js (v14+ recommended)
- npm (v6+ recommended)
- A working MongoDB installation (for backend tests) or MongoDB Memory Server (included in dependencies)

## Running Tests

### All Tests

For convenience, we provide scripts to run all tests:

- On Unix/Mac/Linux: `./run-tests.sh`
- On Windows: `run-tests.bat`

### Backend Tests Only

```bash
cd backend
npm test
```

To run tests in watch mode:

```bash
cd backend
npm run test:watch
```

### Frontend Tests Only

```bash
cd frontend
npm test
```

To run tests in watch mode:

```bash
cd frontend
npm run test:watch
```

To generate coverage reports:

```bash
cd frontend
npm run test:coverage
```

## Backend Test Structure

Backend tests are located in the `backend/tests` directory and are organized by feature:

- `auth.test.js`: Authentication API tests
- `users.test.js`: User API tests
- `hakeems.test.js`: Hakeem API tests
- `appointments.test.js`: Appointment API tests
- `chatbot.test.js`: Chatbot API tests
- `clinic.test.js`: Clinic API tests
- `dashboard.test.js`: Dashboard API tests

The tests use MongoDB Memory Server for testing, which creates an in-memory MongoDB instance for testing without affecting your actual database.

## Frontend Test Structure

Frontend tests are located in the `frontend/src/tests` directory:

- `Profile.test.jsx`: Tests for the Profile component
- `HakeemDashboard.test.jsx`: Tests for the HakeemDashboard component
- `FindHakeem.test.jsx`: Tests for the FindHakeem component
- `Chatbot.test.jsx`: Tests for the Chatbot component

The frontend tests use:
- **Vitest**: A Vite-native test runner
- **React Testing Library**: For component testing
- **MSW**: For mocking API responses

## Mocking Strategy

### Backend

- MongoDB Memory Server is used to create an ephemeral database for testing
- Each test file sets up the necessary test data in `beforeEach` hooks

### Frontend

- API calls are mocked using the `fetch` global object
- React Router's `useNavigate` is mocked for testing navigation
- localStorage is mocked for testing authentication flows

## Test Coverage

Test coverage reports can be generated for both backend and frontend:

### Backend Coverage

```bash
cd backend
npm test -- --coverage
```

### Frontend Coverage

```bash
cd frontend
npm run test:coverage
```

## Adding New Tests

### Backend

1. Create a new test file in `backend/tests` if testing a new feature
2. Import the necessary modules:
   ```javascript
   const request = require('supertest');
   const app = require('../server');
   ```
3. Use Jest's `describe` and `it` functions to organize tests
4. Use Supertest to make API requests and Jest assertions to verify responses

### Frontend

1. Create a new test file in `frontend/src/tests`
2. Import the necessary modules:
   ```javascript
   import { describe, it, expect, vi } from 'vitest'
   import { render, screen, waitFor } from '@testing-library/react'
   ```
3. Mock any necessary dependencies
4. Render components with React Testing Library
5. Use assertions to verify component behavior

## Troubleshooting

### Backend Tests

- If tests are timing out, increase the timeout in Jest configuration
- If MongoDB connection errors occur, ensure MongoDB Memory Server is properly installed

### Frontend Tests

- If tests fail with "Unable to find element", ensure the component is properly rendering
- If tests fail with "Not wrapped in act()", ensure all asynchronous operations are properly awaited

## Continuous Integration

Tests are run automatically on each push to the main branch using GitHub Actions. The configuration can be found in `.github/workflows/test.yml`. 