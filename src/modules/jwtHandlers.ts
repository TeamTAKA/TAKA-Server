import jwt from 'jsonwebtoken';
import userService from '../service/user';
const { secretKey, options, refreshOptions } = require('../config/secretKey');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

//공부해서 any 파티 처리하기.. 오.. 애니파티.. 라임쩌는데..

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

const refresh = async (refreshToken: any) => {
  try {
      const result:any= await jwt.verify(refreshToken, secretKey);
      if (result.id === undefined) {
          return TOKEN_INVALID;
      }
      const user:any = await userService.getUserByID(result.id);
      if (refreshToken !== user.refreshToken) {
          console.log('invalid refresh token');
          return TOKEN_INVALID;
      }
      const payload = {
        idx: user.idx,
        id: user.id
      };
      const dto = {
          token: jwt.sign(payload, secretKey, options)
      };
      return dto;
  } catch (err: any) {
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
}

export default {
  sign,
  verify,
  refresh
}