import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/components/Login';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Usuarios } from '@/pages/Usuarios';
import { Proyectos } from '@/pages/Proyectos';
import { ProyectoDetalle } from '@/pages/ProyectoDetalle';
import { Personal } from '@/pages/Personal';
import { Ausencias } from '@/pages/Ausencias';
import { Asistencia } from '@/pages/Asistencia';
import { Contratos } from '@/pages/Contratos';
import { Toaster } from '@/app/components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'JEFATURA']}>
                  <Layout>
                    <Usuarios />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/proyectos"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'JEFATURA', 'DIRECTOR']}>
                  <Layout>
                    <Proyectos />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/proyectos/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'JEFATURA', 'DIRECTOR']}>
                  <Layout>
                    <ProyectoDetalle />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/personal"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'JEFATURA', 'DIRECTOR']}>
                  <Layout>
                    <Personal />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ausencias"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'JEFATURA', 'DIRECTOR']}>
                  <Layout>
                    <Ausencias />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/asistencia"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'JEFATURA', 'DIRECTOR', 'AYUDANTE']}>
                  <Layout>
                    <Asistencia />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contratos"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'AYUDANTE']}>
                  <Layout>
                    <Contratos />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  );
}