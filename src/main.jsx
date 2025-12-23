// PASTE THIS EXACT CODE INTO src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { MessagesProvider } from './context/MessagesContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MessagesProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </MessagesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);