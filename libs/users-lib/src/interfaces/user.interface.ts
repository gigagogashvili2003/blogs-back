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
  avatar: Buffer | null;
  isDeactivated: boolean;
  accountDeactivationDate: Date | null;
}

export interface IUserResponse {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  birthDate: Date;
  role: UserRole;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
