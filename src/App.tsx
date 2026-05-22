import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CustomerDataProvider } from './contexts/CustomerDataContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './Landing';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import SetupPage from './pages/SetupPage';
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/auth/AdminRoute';

export default function App() {
  return (
    <AuthProvider>
      <CustomerDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/configurar" element={<SetupPage />} />
          <Route
            path="/conta"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </CustomerDataProvider>
    </AuthProvider>
  );
}
