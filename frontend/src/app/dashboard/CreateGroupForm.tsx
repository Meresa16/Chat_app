'use client';

import { useState } from 'react';
import API from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

export default function CreateGroupForm() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [message, setMessage] = useState('');

  if (!user || user.role !== 'admin') return null;

  const createGroup = async () => {
    try {
      const res = await API.post('/groups', {
        group_name: name,
        description: desc,
      });
      setMessage('Group created successfully!');
      setName('');
      setDesc('');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to create group');
    }
  };

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded shadow">
      <h3 className="font-bold mb-2">Create New Group</h3>
      <input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="text"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={createGroup}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Group
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
