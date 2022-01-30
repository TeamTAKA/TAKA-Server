const express = require('express');
//const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();
const uploadImage = require('../../../middlewares/uploadImage');

router.post('/', uploadImage, require('./ticketPOST'));
// router.get('/list', require('./ticketListGET'));
// router.get('/:ticketId', checkUser, require('./ticketGET'));
router.put('/:ticketId', require('./ticketPUT'));
router.delete('/:ticketId', require('./ticketDELETE'));

module.exports = router;
