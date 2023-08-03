import { Table, Column, DataType, Model, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';

@Table
export class RefreshToken extends Model<RefreshToken> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    unique: true,
  })
  token: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    field: 'user_id',
    unique: true,
    type: DataType.INTEGER,
  })
  userId: number;
}
