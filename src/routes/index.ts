import { Router } from 'express';
import userRouter from './user';
import ticketRouter from './ticket';
const router: Router = Router();

router.use('/auth', userRouter);
router.use('/ticket', ticketRouter);

export default router;
