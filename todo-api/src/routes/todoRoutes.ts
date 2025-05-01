import { Router } from 'express';
import * as todoController from '../controllers/todoController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/')
  .get(todoController.getAllTodos)
  .post(todoController.createTodo);

router.route('/:id')
  .get(todoController.getTodo)
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo);

export default router;