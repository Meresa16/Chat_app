import { useEffect, useState } from 'react';
import api from '../api/axios';
import Link from 'next/link';

interface Group {
  id: number;
  name: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/group')
      .then(res => setGroups(res.data))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Groups</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-4">
          {groups.map(group => (
            <li key={group.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <span>{group.name}</span>
              <Link href={`/chat/${group.id}`} className="text-blue-600 hover:underline">Join</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
