export interface IOAuthUser {
  email: string;
  username?: string;
  password: 'password';
  phone: '';
  address: '';
  provider: 'google' | 'facebook';
}

export interface FacebookProfile {
  id: string;
  displayName?: string;
  emails?: { value: string }[];
}
