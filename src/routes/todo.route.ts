import { Router } from 'express';

import * as todoController from '../controllers/todo.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { todoSchema } from '../validations/todo.validation';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(todoSchema), todoController.createTodo);
router.get('/', todoController.getTodo);
router.get('/:id', todoController.getTodoById);
router.put('/:id', validate(todoSchema), todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;
