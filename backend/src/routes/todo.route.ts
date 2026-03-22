import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';
import { todoSchema } from '../validations/todo.validation';
import { validate } from '../middleware/validate.middleware';
const router = Router();

router.post('/', validate(todoSchema), todoController.createTodo);
router.get('/', todoController.getTodo);
router.get('/', todoController.getTodoById);
router.put('/:id', validate(todoSchema), todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;
