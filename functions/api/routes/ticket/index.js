const express = require('express');
const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();
const uploadImage = require('../../../middlewares/uploadImage');

router.post('/', checkUser, uploadImage, require('./ticketPOST'));
router.get('/list', checkUser, require('./ticketListGET'));
router.get('/listGroup', checkUser, require('./ticketListGroupGET'));
router.get('/:ticketIdx', checkUser, require('./ticketGET'));
router.put('/:ticketIdx', checkUser, uploadImage, require('./ticketPUT'));
router.delete('/:ticketIdx', checkUser, require('./ticketDELETE'));
router.post('/search', require('./searchTicketGET'));

module.exports = router;
