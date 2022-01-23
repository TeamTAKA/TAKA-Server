var express = require("express");
var router = express.Router();
const cardController = require("../controller/cardController");
const upload = require("../modules/multer");
//const AuthMiddleware = require('../middlewares/auth');

router.post("/", upload.single("card_img"), cardController.createCard);

module.exports = router;
