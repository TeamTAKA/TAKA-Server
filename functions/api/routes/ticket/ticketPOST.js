const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { ticketDB } = require('../../../db');

module.exports = async (req, res) => {
  if (!req.user[0]) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));

  const { titleKor, titleEng, date, time, hall, seat, cast, seller, review } = req.body;
  const imageUrls = req.imageUrls;
  if (!titleKor && !titleEng) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);
    const ticket = await ticketDB.addTicket(client, req.user[0].userIdx, titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls);

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ADD_ONE_TICKET_SUCCESS, ticket.ticketIdx));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
