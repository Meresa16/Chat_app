import './globals.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Chat App',
  description: 'Next.js Chat Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="p-4 flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
