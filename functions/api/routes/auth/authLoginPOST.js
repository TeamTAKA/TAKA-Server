const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const { userDB } = require('../../../db');
//const jwtHandlers = require('../../lib/jwtHandlers');

module.exports = async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  }

  let client;

  try {
    client = await db.connect(req);
    const user = await userDB.getUserById(client, id);

    if (user.length !== 0) {
      const { id, password } = user[0];
      //const { accesstoken } = jwtHandlers.sign({ id, password });
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, accesstoken));
    } else {
      return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_USER));
    }
  } catch (error) {
    console.log(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);

    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
