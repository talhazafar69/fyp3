# Herbal Chatbot and Appointment Booking System

A full-stack MERN application for a Pakistani herbal medicine chatbot and appointment booking system with hakeems (herbal doctors).

## Features

- User Authentication (Patients and Hakeems)
- Rule-based Herbal Chatbot
- Hakeem Search and Profiles
- Appointment Booking System
- Patient and Hakeem Dashboards
- Profile Management
- Clinic Registration

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- CSS Modules/SCSS for styling
- Light green (#90EE90) and white (#FFFFFF) color scheme

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture

## Project Structure

```
fyp3/
├── frontend/                 # React frontend (Vite)
├── backend/                  # Node.js backend
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── data/                 # Seed data
│   ├── .env                  # Environment variables
│   └── server.js             # Entry point
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd frontend
   npm install
   ```

4. Configure environment variables
   - Create or modify `.env` file in the backend directory
   - Set MongoDB connection string, JWT secret, etc.

5. Seed the database with sample herbal medicines
   ```
   cd backend
   npm run seed
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Development Progress

The project is currently in the initial setup phase. The following components have been implemented:

- Project structure and configuration
- Database models (User, Appointment, HerbalMedicine)
- Authentication middleware
- Seed data for herbal medicines

Next steps include implementing the API endpoints, frontend components, and connecting everything together.

## License

This project is part of a final year project and is intended for educational purposes.