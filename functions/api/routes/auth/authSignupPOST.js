const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { userDB } = require('../../../db');
const encrypt = require('../../../lib/crypto');
const jwtHandlers = require('../../../lib/jwtHandlers');

module.exports = async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  }

  let client;

  try {
    client = await db.connect(req);

    // 해당 email을 가진 유저가 이미 있을 때
    const alreadyUser = await userDB.getUserById(client, id);
    if (alreadyUser.length) {
      return res.status(statusCode.CANNOT_JOIN).send(util.fail(statusCode.CANNOT_JOIN, responseMessage.ALREADY_ID));
    }

    const { salt, hashed } = await encrypt.encrypt(password);
    const user = await userDB.createUser(client, id, hashed, salt);
    const { accesstoken } = jwtHandlers.sign(user);

    return res.status(statusCode.OK).send(
      util.success(statusCode.OK, responseMessage.CREATED_USER, {
        userIdx: user.userIdx,
        accesstoken: accesstoken,
      }),
    );
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
