import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { Demo } from './pages/Demo';
import { Login } from './pages/Login';
import { OnboardingFlow } from './pages/OnboardingFlow';
import { AgencyDashboard } from './pages/AgencyDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { AgencyWebsite } from './pages/AgencyWebsite';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<><Navbar /><HomePage /></>} />
          <Route path="/features" element={<><Navbar /><Features /></>} />
          <Route path="/pricing" element={<><Navbar /><Pricing /></>} />
          <Route path="/demo" element={<><Navbar /><Demo /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<OnboardingFlow />} />
          <Route path="/dashboard" element={<AgencyDashboard />} />
          <Route path="/admin" element={<SuperAdminDashboard />} />
          <Route path="/site/:agencyId" element={<AgencyWebsite />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;