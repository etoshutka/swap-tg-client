export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

export interface User {
  id: string;
  telegram_id: string;
  username: string;
  first_name: string;
  last_name: string;
  status: UserStatus;
  role: UserRole;
  language_code: string;
  created_at: string;
  is_admin: boolean;
  is_inactive: boolean;
  is_banned: boolean;
}
