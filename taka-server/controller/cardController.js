const util = require("../modules/util");
const statusCode = require("../modules/statusCode");
const resMessage = require("../modules/responseMessage");
const cardService = require("../service/userService");

module.exports = {
  //카드 추가
  createCard: async (req, res) => {
    const { card_txt } = req.body;
    var card_img;

    // if (!card_txt) {
    //   card_img = req.file.location;
    // }

    if (!card_txt) {
      res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    const createCard = await cardService.createCardInfo(card_img, card_txt);

    if (createCard === -1) {
      return res
        .status(statusCode.DB_ERROR)
        .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }

    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, resMessage.CREATED_CARD, createCard));
  },

  //카드 수정
  updateCard: async (req, res) => {},

  //카드 삭제
  deleteCard: async (req, res) => {},
};
