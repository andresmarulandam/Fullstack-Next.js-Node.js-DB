import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

//Protected routes
router.post('/', authMiddleware, postController.create);
router.get('/', authMiddleware, postController.getAll);
router.get('/:id', authMiddleware, postController.getById);
router.put('/:id', authMiddleware, postController.update);
router.delete('/:id', authMiddleware, postController.delete);
router.get('/author/:authorId', authMiddleware, postController.getByAuthor);

export default router;
