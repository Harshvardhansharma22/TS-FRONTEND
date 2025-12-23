import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    try {
      const { data } = await api.post('${VITE_BACKEND_URL}/auth/login', { email, password });
      login(data);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    // Set up the dark background for the whole page
    <div className="bg-gray-950 flex items-start justify-center pt-20 pb-20">
      {/* Login Card: Deep gray background with subtle shadow */}
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700/50">
        
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white border-b border-purple-500/50 pb-4">
          Welcome Back
        </h2>
        
        {/* Error Message: Dark red/purple background, light error text */}
        {error && (
          <p className="bg-red-900/50 text-red-400 p-4 rounded-lg mb-6 border border-red-700">
            {error}
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              // Dark input styling
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-500" 
              placeholder="you@example.com"
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              // Dark input styling
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-500" 
              placeholder="••••••••"
            />
          </div>
          
          {/* Submit Button: Primary purple color matching the dark theme */}
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white text-lg font-semibold py-3 rounded-xl shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Sign In to ToolSwap
          </button>
        </form>
        
        <p className="mt-8 text-center text-gray-400 text-sm">
          Don't have an account? 
          <link to="/login" className="text-purple-400 hover:text-purple-300 font-medium ml-1 transition duration-200">
            Sign Up here
          </link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;