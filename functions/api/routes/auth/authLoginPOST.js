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
    const userForThisID = await userDB.getUserById(client, id);

    if (userForThisID.length) {
      const salt = userForThisID[0].salt;
      const hashed = await encrypt.encryptWithSalt(password, salt);
      const user = await userDB.logIn(client, id, hashed, salt);
      if (!user) {
        return res.status(statusCode.OK).send(util.fail(statusCode.FORBIDDEN, responseMessage.MISS_MATCH_PW));
      }

      const { accesstoken } = jwtHandlers.sign(user);
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, {
          userIdx: user.userIdx,
          accesstoken: accesstoken,
        }),
      );
    } else {
      return res.status(statusCode.OK).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_USER));
    }
  } catch (error) {
    console.log(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);

    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
