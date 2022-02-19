const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { userDB } = require('../../../db');

module.exports = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  }

  let client;

  try {
    client = await db.connect(req);

    const alreadyUser = await userDB.getUserById(client, id);
    // 해당 email을 가진 유저가 이미 있을 때
    if (alreadyUser.length) {
      return res.status(statusCode.CANNOT_JOIN).send(util.fail(statusCode.CANNOT_JOIN, responseMessage.ALREADY_ID));
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ALLOWED_ID));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
