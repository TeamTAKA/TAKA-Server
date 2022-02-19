var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth'));
router.use('/ticket', require('./ticket'));

module.exports = router;
