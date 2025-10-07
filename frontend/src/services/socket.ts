import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
    auth: { token },
  });
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error('Socket not connected');
  return socket;
};
