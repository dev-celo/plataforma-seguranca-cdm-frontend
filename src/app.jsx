import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { EmpresaProvider } from './contexts/EmpresaContext'; // ← JÁ ESTÁ IMPORTADO
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ReportForm from './components/Reports/ReportForm';
import ReportList from './components/Reports/ReportList';
import ExportExcel from './components/Export/ExportExcel';
import Layout from './components/Layout/Layout';
import Planejamento from './pages/Planejamento';
import SelecionarEmpresa from './pages/SelecionarEmpresa';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmpresaProvider> {/* 🔥 ADICIONE ESTA LINHA */}
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/selecionar-empresa" element={<SelecionarEmpresa />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/planejamento" element={<Planejamento />} />
                  <Route path="/reports/new" element={<ReportForm />} />
                  <Route path="/reports/edit/:id" element={<ReportForm />} />
                  <Route path="/reports/list" element={<ReportList />} />
                  <Route path="/export" element={<ExportExcel />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </EmpresaProvider> {/* 🔥 ADICIONE ESTA LINHA */}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;