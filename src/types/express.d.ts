import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    type User = IUser;
  }
}

