'use client';

import { useEffect, useState } from 'react';
import API from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const fetchUsers = async () => {
      const res = await API.get('/users');
      setUsers(res.data);
    };
    fetchUsers();
  }, [user]);

  if (user?.role !== 'admin') return <p className="text-red-500">Access Denied</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u: any) => (
          <div key={u.user_id} className="p-4 bg-white rounded shadow">
            <h3 className="font-bold">{u.username}</h3>
            <p>{u.email}</p>
            <p>{u.role}</p>
            <Link href={`/users/${u.user_id}`} className="text-blue-600">
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
