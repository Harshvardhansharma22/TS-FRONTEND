import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from './MessagesContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const { dispatch } = useMessages();

  useEffect(() => {
    if (user) {
       console.log('--- 1. FRONTEND: User logged in. Attempting to connect to socket... ---');
      const newSocket = io('http://localhost:3000');
      setSocket(newSocket);
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });
      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
      });
      console.log('--- 3. FRONTEND: Emitting "add_user" with ID:', user._id, '---');
      newSocket.emit('add_user', user._id);
      console.log('--- CONTEXT: User logged in, attempting to add user to socket ---');
      console.log('--- CONTEXT: Emitting add_user with ID:', user._id);
      newSocket.emit('add_user', user._id);
      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && socket) {
      socket.on('receive_message', (data) => {
        // For owner, store messages under sender's ID
        const key = data.fromUserId === user._id ? data.toUserId : data.fromUserId;
        dispatch({ type: 'RECEIVE_MESSAGE', payload: { ...data, fromUserId: key } });
      });
      socket.on('send_message', (data) => {
        dispatch({ type: 'SEND_MESSAGE', payload: data });
      });
      return () => {
        socket.off('receive_message');
        socket.off('send_message');
      };
    }
  }, [user, socket, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };