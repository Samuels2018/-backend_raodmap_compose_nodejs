import { Sequelize } from 'sequelize-typescript';
import config from '../config/config';
import User from './userModel';
import Todo from './todoModel';

const sequelize = new Sequelize({
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  dialect: 'postgres',
  models: [User, Todo],
  logging: false,
});

export { sequelize, User, Todo };