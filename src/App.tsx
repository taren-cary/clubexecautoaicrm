import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DualLayout } from './components/layout/DualLayout';
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
            <Route path="b2b">
              <Route path="calls" element={<B2BCallsPage />} />
              <Route path="contacts" element={<B2BContactsPage />} />
            </Route>
            {/* Redirect any B2C routes to B2B */}
            <Route path="b2c/*" element={<Navigate to="/b2b/calls" replace />} />
            {/* Catch-all redirect to B2B */}
            <Route path="*" element={<Navigate to="/b2b/calls" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 