export interface IOAuthUser {
  email: string;
  username?: string;
  provider: 'google' | 'facebook';
}

export interface FacebookProfile {
  id: string;
  displayName?: string;
  emails?: { value: string }[];
}
