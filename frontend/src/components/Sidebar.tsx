'use client';

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gray-200 p-4">
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        {user?.role === 'admin' && (
          <li>
            <Link href="/users">Users</Link>
          </li>
        )}
        <li>
          <Link href="/dashboard">Groups</Link>
        </li>
      </ul>
    </aside>
  );
}
