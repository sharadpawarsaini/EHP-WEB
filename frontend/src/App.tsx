import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmergencyPage from './pages/EmergencyPage';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Layout from './components/Layout';
import { AdminRoute } from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import FeedbackManagement from './pages/admin/FeedbackManagement';
import AuditLogs from './pages/admin/AuditLogs';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import Analytics from './pages/admin/Analytics';
import SOSMonitor from './pages/admin/SOSMonitor';
import CommunicationCenter from './pages/admin/CommunicationCenter';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <Router>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/e/:slug" element={<EmergencyPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Separate Admin Auth Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="feedback" element={<FeedbackManagement />} />
              <Route path="sos" element={<SOSMonitor />} />
              <Route path="communication" element={<CommunicationCenter />} />
              <Route path="logs" element={<AuditLogs />} />
            </Route>

          </Routes>

        </Router>
      </ProfileProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
