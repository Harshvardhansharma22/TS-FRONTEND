import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PublicHome from './pages/PublicHome';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashBoardPage from './pages/DashBoardPage';
import AddToolPage from './pages/AddToolPage';
import ToolDetailPage from './pages/ToolDetailPage';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  const { user } = useAuth();
  return (
    <div className="bg-gray-900 ">
      <Navbar />
      <main className="container mx-auto p-4">

        <Routes>
          <Route path="/" element={user ? <HomePage /> : <PublicHome />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashBoardPage />
            </ProtectedRoute>
          } />
          <Route path="/add-tool" element={
            <ProtectedRoute>
              <AddToolPage />
            </ProtectedRoute>
          } />
          <Route path="/tool/:id" element={
            <ProtectedRoute>
              <ToolDetailPage />
            </ProtectedRoute>
          } />

        </Routes>
      </main>
    </div>
  );
}

export default App;
