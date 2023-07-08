import { Router } from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';
import authUtil from '../middlewares/authUtil';
const router = Router();

router.get('/checkId/:id', userController.checkAlreadyID);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/social', userController.socialLogin);
router.get('/refresh', authController.reIssue);

export default router;
