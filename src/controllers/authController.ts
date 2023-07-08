import { Request, Response } from 'express';
import util from '../modules/util';
import statusCode from '../modules/statusCode';
import resMessage from '../modules/responseMessage';
import jwt from '../modules/jwtHandlers';

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const reIssue = async (req: Request, res: Response) => {
  try {
    const accesstoken = req.headers.accesstoken;
    const refreshToken = req.headers.refreshtoken;
    if (!refreshToken) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
    }

    //accesstoken으로 idx 가져옴
    //해당 idx의 refreshtoken이 받은 값과 일치하는지 확인

    const newToken = await jwt.refresh(refreshToken);
    if (newToken == TOKEN_EXPIRED) {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
    }
    if (newToken == TOKEN_INVALID) {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ISSUE_SUCCESS, {
      accessToken: newToken
    }));
  } catch (err) {
    console.log(err);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
}

export default {
  reIssue
};