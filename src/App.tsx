import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DualLayout } from './components/layout/DualLayout';
import { B2CCallsPage } from './pages/b2c/CallsPage';
import { B2CContactsPage } from './pages/b2c/ContactsPage';
import { B2BCallsPage } from './pages/b2b/CallsPage';
import { B2BContactsPage } from './pages/b2b/ContactsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DualLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/b2b/calls" replace />} />
            <Route path="b2c">
              <Route path="calls" element={<B2CCallsPage />} />
              <Route path="contacts" element={<B2CContactsPage />} />
            </Route>
            <Route path="b2b">
              <Route path="calls" element={<B2BCallsPage />} />
              <Route path="contacts" element={<B2BContactsPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 