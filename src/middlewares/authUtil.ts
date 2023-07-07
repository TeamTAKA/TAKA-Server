import { Request, Response } from 'express';
import jwt from '../modules/jwtHandlers';
import util from '../modules/util';
import statusCode from '../modules/statusCode';
import resMessage from '../modules/responseMessage';
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
  checkToken: async (req: any, res: any, next:any) => {
    let token = req.headers.jwt;
    if (!token) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
    }
    const user = await jwt.verify(token) as any;
    if (user === TOKEN_EXPIRED) {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
    }
    if (user === TOKEN_INVALID) {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }
    if (user.id === undefined) {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }
    req.decoded = user;
    next();
  }
}

export default authUtil;