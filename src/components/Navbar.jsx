import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MessagesBox from './MessagesBox';

// Minimal Navbar: logo left, Sign In / Sign Up on right.
// Uses `setRoute` prop when provided (for non-router setups), otherwise uses react-router `navigate`.

const Navbar = ({ setRoute }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMessages, setShowMessages] = useState(false);

  const go = (path) => {
    if (typeof setRoute === 'function') return setRoute(path);
    if (path) navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900 text-white py-5 px-6 shadow-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => go('/')} className="text-2xl font-extrabold tracking-tight transition duration-200 hover:text-purple-400">
          Tool<span className="text-purple-500">Swap</span>
        </button>

        <div className="flex items-center gap-3">
          {user ? (
            <>
          <span className="text-gray-200 mr-2 hidden sm:inline">Hello, {user.name}</span>
              <div className="relative">
                <button
                  className="px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition"
                  onClick={() => setShowMessages((v) => !v)}
                > 
                Messages
                </button>
                {showMessages && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <MessagesBox />
                  </div>
                )}
              </div>
              <button
                className="px-4 py-2 rounded-md text-sm bg-purple-600 text-white hover:bg-purple-700 transition"
                onClick={() => go('/add-tool')}
              >
                List a Tool
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition"
                onClick={() => go('/dashboard')}
              >
                Dashboard
              </button>
              <button
                className="px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition"
                onClick={() => { setShowMessages(false); logout(); go('/'); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="px-5 py-2 rounded-full border border-gray-600 text-gray-300 font-medium hover:bg-gray-700 hover:border-gray-500 transition duration-200"
                onClick={() => go('/login')}
              >
                Sign In
              </button>

              <button
                className="px-5 py-2 rounded-full bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30 hover:bg-purple-700 transition duration-200 transform hover:scale-[1.02]"
                onClick={() => go('/register')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;