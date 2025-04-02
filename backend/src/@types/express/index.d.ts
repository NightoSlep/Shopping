import { IUser } from 'src/user/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: IUser;
  }
}
