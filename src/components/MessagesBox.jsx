import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';
import { useMessages } from '../context/MessagesContext';
import ChatBox from './ChatBox';
import { useAuth } from '../context/AuthContext';

const MessagesBox = () => {
  const { messages, dispatch } = useMessages();
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userNames, setUserNames] = useState({});


  // On mount, fetch all chat partners for the logged-in user (owner)
  useEffect(() => {
    async function fetchPartnersAndConversations() {
      if (!user?._id) return;
      try {
        // Fetch all chat partners for this user
        const { data: partners } = await api.get(`/chat/partners?userId=${user._id}`);
        const names = {};
        for (const partnerId of partners) {
          // Fetch user name from backend
          try {
            const { data: userData } = await api.get(`/users/${partnerId}`);
            names[partnerId] = userData.name || userData.username || partnerId;
          } catch {
            names[partnerId] = partnerId;
          }
          // Fetch conversation with each partner
          const { data: conv } = await api.get(`/chat/messages?userA=${user._id}&userB=${partnerId}`);
          const formatted = conv.map(msg => ({
            message: msg.text,
            fromUserId: msg.sender,
            incoming: msg.sender !== user._id
          }));
          // Dispatch to context
          dispatch({ type: 'LOAD_CONVERSATION', payload: { userId: partnerId, messages: formatted } });
        }
        setUserNames(names);
      } catch {
        // Optionally handle error
      }
    }
    fetchPartnersAndConversations();
    // Only run on mount or user change
  }, [user, dispatch]);

  const userList = Object.keys(messages).filter(id => id !== user._id);

  const boxRef = useRef(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      // cleanup in case
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setTranslate({ x: start.current.tx + dx, y: start.current.ty + dy });
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseDown = (e) => {
    dragging.current = true;
    start.current = { x: e.clientX, y: e.clientY, tx: translate.x, ty: translate.y };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  };

  // Touch support
  const onTouchMove = (e) => {
    if (!dragging.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - start.current.x;
    const dy = touch.clientY - start.current.y;
    setTranslate({ x: start.current.tx + dx, y: start.current.ty + dy });
  };

  const onTouchEnd = () => {
    dragging.current = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  };

  const onTouchStart = (e) => {
    const touch = e.touches[0];
    dragging.current = true;
    start.current = { x: touch.clientX, y: touch.clientY, tx: translate.x, ty: translate.y };
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    e.preventDefault();
  };

  return (
    <div
      ref={boxRef}
      style={{
        background: '#0b1220',
        border: '1px solid #1f2937',
        borderRadius: 8,
        width: 340,
        zIndex: 1000,
        color: '#e6eef8',
        boxShadow: '0 10px 30px rgba(2,6,23,0.6)',
        transform: `translate(${translate.x}px, ${translate.y}px)`
      }}
    >
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.04)', margin: 0, color: '#e6eef8', cursor: 'grab', userSelect: 'none' }}
      >
        Messages
      </div>
      <div style={{ maxHeight: 220, overflowY: 'auto', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        {userList.length === 0 && <div style={{ padding: 12, color: '#9aa4bf' }}>No messages yet.</div>}
        {userList.map(id => (
          <div
            key={id}
            style={{
              padding: 12,
              cursor: 'pointer',
              background: selectedUserId === id ? 'rgba(124,58,237,0.12)' : 'transparent',
              color: selectedUserId === id ? '#fff' : '#e6eef8'
            }}
            onClick={() => setSelectedUserId(id)}
          >
            {userNames[id] || id}
          </div>
        ))}
      </div>
      {selectedUserId && (
        <div style={{ padding: 12 }}>
          {/* Remount ChatBox when selectedUserId changes to reset its state */}
          <ChatBox key={selectedUserId} toUserId={selectedUserId} partnerName={userNames[selectedUserId]} />
        </div>
      )}
    </div>
  );
};

export default MessagesBox;
