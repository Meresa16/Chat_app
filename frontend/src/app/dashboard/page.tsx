'use client';

import { useEffect, useState } from 'react';
import API from '../../lib/api';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import CreateGroupForm from './CreateGroupForm';

interface Group {
  group_id: number;
  group_name: string;
  description: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchGroups = async () => {
      const res = await API.get('/groups');
      setGroups(res.data);
    };

    fetchGroups();
  }, [user]);

  if (!user) return <p>Loading...</p>;
{user.role === 'admin' && <CreateGroupForm />}
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Groups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Link
            key={group.group_id}
            href={`/dashboard/${group.group_id}`}
            className="p-4 bg-white shadow rounded hover:bg-blue-50"
          >
            <h3 className="text-lg font-semibold">{group.group_name}</h3>
            <p className="text-gray-600">{group.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
