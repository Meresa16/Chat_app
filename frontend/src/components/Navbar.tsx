'use client';

import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Chat App</h1>
      {user && (
        <div className="flex items-center space-x-4">
          <span>{user.username} ({user.role})</span>
          <button
            className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
