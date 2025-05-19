import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';
import FindHakeem from './pages/FindHakeem';
import HakeemDashboard from './pages/HakeemDashboard';
import ManageClinic from './pages/ManageClinic';
import PatientAppointments from './pages/PatientAppointments';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hakeems" element={<FindHakeem />} />
        <Route path="/hakeem-dashboard" element={<HakeemDashboard />} />
        <Route path="/clinic-registration" element={<ManageClinic />} />
        <Route path="/appointments" element={<PatientAppointments />} />
      </Routes>
    </Router>
  );
}

export default App;
