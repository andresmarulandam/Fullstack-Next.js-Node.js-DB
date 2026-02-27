import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.post('/import/:id', userController.importUser);

router.get('/saved', userController.getSavedUsers);

router.get('/saved/:id', userController.getSavedUserById);

export default router;
