import { Document } from 'mongoose'

export interface UserDoc {
  id?: string;
  name: string;
  email: string,
  password: string,
  is_deleted: boolean;
  is_active: boolean;
  is_confirmed: boolean;
  is_admin: boolean;
  provider: accountProvider;
  pwd_change: boolean;
  website: string;
  twitterId: string;
  googleId: string;
  facebookId: string
  githubId: string;
  gender: string;
  resetToken: string;
  account_confirmed: boolean;
  paginate: any;
}

export class User extends Document implements UserDoc {
  id?: string;
  name: string;
  email: string;
  password: string;
  is_deleted: boolean;
  is_active: boolean;
  is_confirmed: boolean;
  is_admin: boolean;
  provider: accountProvider;
  pwd_change: boolean;
  website: string;
  twitterId: string;
  googleId: string;
  facebookId: string;
  githubId: string;
  gender: string;
  resetToken: string;
  account_confirmed: boolean;
  paginate: () => void;
  validatePassword: (password: string) => boolean;
}


type accountProvider = 'local' | 'facebook' | 'twitter' | 'github' | 'google'