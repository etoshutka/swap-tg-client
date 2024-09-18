import { User } from '../../model/types/userSchema';
import { Wallet } from '@/entities/Wallet';

export interface SignUpParams {
  telegram_id: string;
  username: string;
  first_name: string;
  last_name: string;
  language_code: string;
}

export interface SignUpResult {
  user: User;
  wallets: Wallet[];
}
