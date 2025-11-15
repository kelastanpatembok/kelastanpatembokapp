export type Role = 'owner' | 'member' | 'visitor' | 'mentor';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  email?: string;
}

export interface Session {
  userId: string;
  role: Role;
}

