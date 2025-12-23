import React, { createContext, useContext, useReducer } from 'react';

const MessagesContext = createContext();

const initialState = {};
// { userId: [{ message, fromUserId, incoming }] }

function messagesReducer(state, action) {
  switch (action.type) {
    case 'RECEIVE_MESSAGE': {
      const { fromUserId, message } = action.payload;
      return {
        ...state,
        [fromUserId]: [...(state[fromUserId] || []), { message, fromUserId, incoming: true }],
      };
    }
    case 'SEND_MESSAGE': {
      const { toUserId, message, fromUserId } = action.payload;
      return {
        ...state,
        [toUserId]: [...(state[toUserId] || []), { message, fromUserId, incoming: false }],
      };
    }
    case 'LOAD_CONVERSATION': {
      const { userId, messages } = action.payload;
      return {
        ...state,
        [userId]: messages,
      };
    }
    default:
      return state;
  }
}

export const MessagesProvider = ({ children }) => {
  const [messages, dispatch] = useReducer(messagesReducer, initialState);
  return (
    <MessagesContext.Provider value={{ messages, dispatch }}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);
