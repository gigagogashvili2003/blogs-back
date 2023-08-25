import { Table, Column, DataType, Model } from 'sequelize-typescript';
import { UserRole } from '../enums/user.enums';

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
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  avatar: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_disabled',
    defaultValue: false,
  })
  isDisabled: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'account_disable_time',
    defaultValue: null,
  })
  accountDisableTime: Date | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_deactivated',
    defaultValue: false,
  })
  isDeactivated: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'account_deactivation_date',
    defaultValue: null,
  })
  accountDeactivationDate: Date | null;

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
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [Object.values(UserRole)],
    },
    defaultValue: UserRole.USER,
  })
  role: string;

  @Column({
    field: 'is_verified',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isVerified: boolean = false;
}
