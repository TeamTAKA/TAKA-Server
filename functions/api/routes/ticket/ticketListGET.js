const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { ticketDB } = require('../../../db');

module.exports = async (req, res) => {
  if (!req.user[0]) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));

  let client;

  try {
    client = await db.connect(req);

    const tickets = await ticketDB.getAllTicketsByuserIdx(client, req.user[0].userIdx);
    //if (!tickets) return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_TICKET)); 없을 수 있음.

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_ALL_TICKETS_SUCCESS, tickets));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
