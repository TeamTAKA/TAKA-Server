const util = require('../../lib/util');
const responseMessage = require('../../constants/responseMessage');
const statusCode = require('../../constants/statusCode');
const db = require('../../../db/db');
const { userDB } = require('../../db');
//const jwtHandlers = require('../../lib/jwtHandlers');

module.exports = async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  }

  if (password !== passwordConfirm) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.DIFFRERENT_PASSWORD));
  }

  let client;

  try {
    client = await db.connect(req);

    const user = await userDB.createUser(id, password);
    const { accesstoken } = jwtHandlers.sign(user[0]);

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.CREATED_USER, accesstoken));
  } catch (error) {
    console.log(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
