import { Table, Column, Model, HasMany, BeforeCreate } from 'sequelize-typescript';
import Todo from './todoModel';
import { hashPassword } from '../utils/hashPassword';

@Table({
  tableName: 'users',
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    allowNull: false,
  })
  name!: string;

  @Column({
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    allowNull: false,
  })
  password!: string;

  @HasMany(() => Todo)
  todos!: Todo[];

  /*@BeforeCreate
  static async hashPassword(user: User): Promise<void> {
    user.password = await hashPassword(user.password);
  }*/
}

export default User;