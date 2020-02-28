

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
}


type accountProvider = 'local' | 'facebook' | 'twitter' | 'github' | 'google'