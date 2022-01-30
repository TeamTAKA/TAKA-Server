const express = require('express');
//const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();
const uploadImage = require('../../../middlewares/uploadImage');

router.post('/', uploadImage, require('./ticketPOST'));
router.get('/list/:userIdx', require('./ticketListGET'));
router.get('/:ticketIdx', require('./ticketGET'));
router.put('/:ticketIdx', require('./ticketPUT'));
router.delete('/:ticketIdx', require('./ticketDELETE'));

module.exports = router;
