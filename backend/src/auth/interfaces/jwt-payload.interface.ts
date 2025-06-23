import { UserRole } from 'src/user/entities/user.entity';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface UserPayload extends JwtPayload {
  username?: string;
}
