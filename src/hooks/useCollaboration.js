// hooks/useCollaboration.js
import { useState, useCallback } from 'react';

export const useCollaboration = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'You', email: 'you@example.com', avatar: '👤', online: true },
    { id: 2, name: 'Alex Chen', email: 'alex@company.com', avatar: '👨', online: true },
    { id: 3, name: 'Sarah Kim', email: 'sarah@company.com', avatar: '👩', online: false }
  ]);

  const shareSheet = useCallback((email, permission) => {
    // Mock sharing functionality
    const newUser = {
      id: users.length + 1,
      name: email.split('@')[0],
      email,
      avatar: '👤',
      online: false,
      permission
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [users.length]);

  const addComment = useCallback((cellId, comment) => {
    // Mock comment functionality
    console.log(`Comment added to cell ${cellId}: ${comment}`);
  }, []);

  return {
    users,
    shareSheet,
    addComment
  };
};