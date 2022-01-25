const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { ticketDB } = require('../../../db');

module.exports = async (req, res) => {
  const { userId, title_kor, title_eng, date, time, hall, seat, cast, seller, review } = req.body;
  const imageUrls = req.imageUrls;

  let client;

  try {
    client = await db.connect(req);
    const ticket = await ticketDB.addticket(client, userId, title_kor, title_eng, date, time, hall, seat, cast, seller, review, imageUrls);

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ADD_ONE_POST_SUCCESS, ticket.ticketId));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
