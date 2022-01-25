var express = require('express');
var router = express.Router();

router.use('/user', require('./user'));
router.use('/card', require('./card'));

module.exports = router;
