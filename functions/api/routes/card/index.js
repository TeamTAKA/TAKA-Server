const express = require('express');
//const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();
const uploadImage = require('../../../middlewares/uploadImage');

router.post('/', uploadImage, require('./cardPOST'));
// router.get('/list', require('./cardListGET'));
// router.get('/:cardId', checkUser, require('./cardGET'));
// router.put('/:cardId', require('./cardPUT'));
// router.delete('/:cardId', require('./cardDELETE'));

module.exports = router;
