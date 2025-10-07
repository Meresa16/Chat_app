export interface User {
  user_id: number;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'member';
}
