import { Router } from 'express';
import { postController } from '../controllers/post.controller';

const router = Router();

router.post('/', postController.create);
router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);

router.get('/author/:authorId', postController.getByAuthor);

export default router;
