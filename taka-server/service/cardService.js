const { Card } = require("../domain");

module.exports = {
  createCardInfo: async (card_img, card_txt) => {
    try {
      const card = await Card.create({
        CardImg: card_img,
        CardText: card_txt,
      });
      return card;
    } catch (err) {
      throw err;
    }
  },
};
