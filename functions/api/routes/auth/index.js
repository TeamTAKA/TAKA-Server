const express = require('express');
const router = express.Router();

router.get('/checkId/:id', require('./authCheckIdGET'));
router.post('/signup', require('./authSignupPOST'));
router.post('/login', require('./authLoginPOST'));

module.exports = router;
