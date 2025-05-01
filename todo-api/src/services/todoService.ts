import Todo from '../models/todoModel';
import APIFeatures from '../utils/apiFeatures';
import { AppError } from '../utils/appError';

class TodoService {
  async createTodo(title: string, description: string | undefined, userId: number) {
    const todo = await Todo.create({ title, description, userId });
    return todo;
  }

  async getTodoById(id: number, userId: number) {
    const todo = await Todo.findOne({ where: { id, userId } });
    if (!todo) {
      throw new AppError('Todo not found', 404);
    }
    return todo;
  }

  async getAllTodos(userId: number, query: any) {
    const features = new APIFeatures(Todo, query, { userId })
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const result = await features.execute();
    return result;
  }

  async updateTodo(id: number, title: string, description: string | undefined, userId: number) {
    const todo = await this.getTodoById(id, userId);

    todo.title = title;
    if (description !== undefined) {
      todo.description = description;
    }

    await todo.save();
    return todo;
  }

  async deleteTodo(id: number, userId: number) {
    const todo = await this.getTodoById(id, userId);
    await todo.destroy();
  }
}

export default new TodoService();