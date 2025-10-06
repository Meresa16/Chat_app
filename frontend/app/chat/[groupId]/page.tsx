'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../api/axios';
import { useSocket } from '../../hooks/useSocket';

interface Message {
  id: number;
  content: string;
  sender: { name: string };
  createdAt: string;
}

export default function ChatPage() {
  const { groupId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/messages/${groupId}`)
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]));
  }, [groupId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinGroup', groupId);
    socket.on('newMessage', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      socket.off('newMessage');
      socket.emit('leaveGroup', groupId);
    };
  }, [socket, groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    socket.emit('sendMessage', { groupId, content: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map(msg => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold">{msg.sender.name}: </span>
            <span>{msg.content}</span>
            <span className="text-xs text-gray-400 ml-2">{new Date(msg.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex p-4 bg-white border-t">
        <input
          className="flex-1 border rounded p-2 mr-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Send</button>
      </form>
    </div>
  );
}
