import { Table, Column, DataType, Model } from 'sequelize-typescript';
import { UserRole } from '../enums/user.enums';
import { allowedPasswordLength } from '../constants/user.constants';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    field: 'first_name',
    allowNull: false,
    type: DataType.STRING,
  })
  firstName: string;

  @Column({
    field: 'last_name',
    allowNull: false,
    type: DataType.STRING,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  username: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'birth_date',
    validate: {
      isPastDate(value: Date): void {
        if (value >= new Date()) {
          throw new Error('Birth date must be in the past.');
        }
      },
    },
  })
  birthDate: Date;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    validate: {
      len: allowedPasswordLength,
      msg: 'Password must be between 8 and 50 characters.',
    },
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [Object.values(UserRole)],
    },
  })
  role: UserRole;

  @Column({
    field: 'is_verified',
    type: DataType.BOOLEAN,
  })
  isVerified: boolean;
}
