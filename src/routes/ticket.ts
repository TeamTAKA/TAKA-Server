import { Router } from 'express';
import ticketController from '../controllers/ticketController';
import authUtil from '../middlewares/authUtil';
import multer from 'multer';
import upload from "../modules/multer";
const router = Router();

//checkUser middleware 추가해야 됨
router.post('/', authUtil.checkToken, upload.single('coverImage'), ticketController.addNewTicket);
router.get('/', authUtil.checkToken, ticketController.showTicketList);
router.get('/group', authUtil.checkToken, ticketController.showTicketListbyGroup);
router.get('/detail/:ticketIDX', authUtil.checkToken, ticketController.showTicketInfo);
router.put('/detail/:ticketIDX', authUtil.checkToken, upload.single('coverImage'), ticketController.editTicketInfo);
router.delete('/detail/:ticketIDX', authUtil.checkToken, ticketController.deleteTicket);
router.post('/search', authUtil.checkToken, ticketController.searchbyKeyword);

export default router;
