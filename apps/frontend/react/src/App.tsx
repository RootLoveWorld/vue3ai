import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nextProvider } from './contexts/I18nContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Users from './pages/Users';
import Organizations from './pages/Organizations';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import './App.css';

function App() {
  return (
    <I18nextProvider>
      <ThemeProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/users" element={<Users />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;