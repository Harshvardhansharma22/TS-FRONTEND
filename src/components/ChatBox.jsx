import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { useMessages } from '../context/MessagesContext';
import api from '../api/axiosConfig';

const ChatBox = ({ toUserId, isOwner, partnerName }) => {
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const { messages, dispatch } = useMessages();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [chatPartnerId, setChatPartnerId] = useState(toUserId);

  useEffect(() => {
    // Update when prop changes (MessagesBox remounts ChatBox with key, but keep this for safety)
    setChatPartnerId(toUserId);
  }, [toUserId]);

  // Use global messages context for chat history
  const conversationMessages = messages[chatPartnerId] || [];

  useEffect(() => {
    if (!socket) {
      setError('Chat is unavailable. Please make sure you are logged in and connected.');
      return;
    }
    setError('');
    const handleReceiveMessage = (data) => {
      if (isOwner && data.fromUserId) {
        setChatPartnerId(data.fromUserId); // Owner replies to last user who messaged
      }
    };
    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, isOwner]);

  useEffect(() => {
    // Fetch chat history from backend when chatPartnerId changes
    async function fetchMessages() {
      if (user && chatPartnerId) {
        try {
          const { data } = await api.get(`/chat/messages?userA=${user._id}&userB=${chatPartnerId}`);
          // Format messages for local state
          const formatted = data.map(msg => ({
            message: msg.text,
            fromUserId: msg.sender,
            incoming: msg.sender !== user._id
          }));
          dispatch({ type: 'LOAD_CONVERSATION', payload: { userId: chatPartnerId, messages: formatted } });
        } catch (err) {
          console.log(err)
        }
      }
    }
    fetchMessages();
  }, [chatPartnerId, user, dispatch]);

  const sendMessage = async () => {
    if (!socket) {
      setError('Socket not connected.');
      return;
    }
    if (!user) {
      setError('You must be logged in to send messages.');
      return;
    }
    if (message.trim()) {
      socket.emit('send_message', {
        toUserId: chatPartnerId,
        message,
        fromUserId: user._id,
      });
      dispatch({ type: 'SEND_MESSAGE', payload: { toUserId: chatPartnerId, message, fromUserId: user._id } });
      // Save to backend
      try {
        await api.post('/chat/message', {
          sender: user._id,
          receiver: chatPartnerId,
          text: message
        });
      } catch (err) {
        console.log(err)
      }
      setMessage('');
      setError('');
    }
  };

  return (
    <div style={{ background: '#071028', border: '1px solid #131827', padding: 12, borderRadius: 8, color: '#e6eef8', minWidth: 300 }}>
      {/* Partner header */}
      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 18, color: '#fff' }}>
        {partnerName || (chatPartnerId ? chatPartnerId : 'Chat')}
      </div>
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
        {conversationMessages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.incoming ? 'flex-start' : 'flex-end', marginBottom: 8 }}>
            <span style={{ display: 'inline-block', maxWidth: '75%', padding: '8px 10px', borderRadius: 10, background: msg.incoming ? '#0f1724' : '#6d28d9', color: msg.incoming ? '#e6eef8' : '#fff' }}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      {error && <div style={{ color: '#fca5a5', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={partnerName ? `Message ${partnerName}...` : 'Type a message...'}
          style={{ width: '80%', background: '#0b1220', color: '#e6eef8', border: '1px solid #1f2937', padding: '8px 10px', borderRadius: 6 }}
          disabled={!socket || !user}
        />
        <button onClick={sendMessage} style={{ padding: '8px 14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6 }} disabled={!socket || !user || !message.trim()}>
          Send
        </button>
      </div>
      {isOwner && chatPartnerId && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#9aa4bf' }}>
          Replying to user: {partnerName || chatPartnerId}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
