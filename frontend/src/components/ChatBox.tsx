'use client';

import { useEffect, useState } from 'react';
import { getSocket, connectSocket } from '../services/socket';
import { useAuth } from '../hooks/useAuth';
import API from '../lib/api';

interface Message {
  message_id: number;
  content: string;
  created_at: string;
  sender: { username: string };
}

interface ChatBoxProps {
  groupId: number;
}

export default function ChatBox({ groupId }: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!user) return;
    const socket = connectSocket(localStorage.getItem('token') || '');

    socket.emit('join_group', groupId);

    socket.on('new_message', (msg: any) => {
      if (msg.group_id === groupId) setMessages((prev) => [...prev, msg]);
    });

    const fetchMessages = async () => {
      const res = await API.get(`/messages/${groupId}`);
      setMessages(res.data);
    };
    fetchMessages();

    return () => {
      socket.off('new_message');
    };
  }, [groupId, user]);

  const sendMessage = () => {
    if (!input.trim() || !user) return;
    const socket = getSocket();
    socket.emit('send_message', {
      groupId,
      senderId: user.user_id,
      content: input,
    });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded shadow">
      <div className="flex-1 overflow-auto mb-2 space-y-2">
        {messages.map((msg) => (
          <div key={msg.message_id} className="p-2 border rounded">
            <strong>{msg.sender.username}:</strong> {msg.content}
            <span className="text-xs text-gray-500 float-right">
              {new Date(msg.created_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
