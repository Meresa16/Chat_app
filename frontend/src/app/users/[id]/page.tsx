
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import API from '../../../lib/api';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await API.get(`/users/${userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.is_active ? 'Active' : 'Inactive'}</p>
    </div>
  );
}
