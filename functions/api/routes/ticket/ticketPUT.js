const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { ticketDB } = require('../../../db');

module.exports = async (req, res) => {
  const { ticketId } = req.params;
  const { titleKor, titleEng, date, time, hall, seat, cast, seller, review } = req.body;
  const imageUrls = req.imageUrls;

  if (!ticketId) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);
    const updateTicket = await ticketDB.updatePost(client, ticketId, titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls);
    if (!updateTicket) return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_TICKET));

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UPDATE_ONE_TICKET_SUCCESS, updateTicket));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
