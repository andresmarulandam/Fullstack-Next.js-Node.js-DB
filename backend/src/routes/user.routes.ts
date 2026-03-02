import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
//Public route
router.post('/import/:id', authMiddleware, userController.importUser);

//Protected routes
router.get('/saved', authMiddleware, userController.getSavedUsers);
router.get('/saved/:id', authMiddleware, userController.getSavedUserById);
router.delete('/saved/:id', authMiddleware, userController.deleteSavedUser);

export default router;
