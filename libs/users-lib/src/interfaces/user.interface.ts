import { UserRole } from '../enums/user.enums';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  birthDate: Date;
  role: UserRole;
  isVerified: boolean;
}
