import jwt from 'jsonwebtoken';
const { secretKey, options, refreshOptions } = require('../config/secretKey');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const sign = async (user: any) => {
  const payload = {
    idx: user.idx,
    id: user.id
  };
  const result = {
    accessToken: jwt.sign(payload, secretKey, options),
    refreshToken: jwt.sign(payload, secretKey, refreshOptions),
  };
  return result;
};

const verify = async (token: any) => {
  let decoded;
  try {
    decoded = jwt.verify(token, secretKey);
  } catch (err:any) {
    if (err.message === 'jwt expired') {
      console.log('expired token');
      return TOKEN_EXPIRED;
    } else if (err.message === 'invalid token') {
      console.log('invalid token');
      console.log(TOKEN_INVALID);
      return TOKEN_INVALID;
    } else {
      console.log("invalid token");
      return TOKEN_INVALID;
    }
  }
  return decoded;
};

export default {
  sign,
  verify
}