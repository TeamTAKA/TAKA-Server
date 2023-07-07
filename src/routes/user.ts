import { Router } from 'express';
import userController from '../controllers/userController';
const router = Router();

router.get('/checkId/:id', userController.checkAlreadyID);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/social', userController.socialLogin);

export default router;
