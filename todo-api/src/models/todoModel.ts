import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './userModel';

@Table({
  tableName: 'todos',
  timestamps: true,
})
class Todo extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    allowNull: false,
  })
  title!: string;

  @Column
  description?: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

export default Todo;