import { Request, Response } from 'express';
import util from '../modules/util';
import statusCode from '../modules/statusCode';
import resMessage from '../modules/responseMessage';
import userService from '../service/user';
import jwt from '../modules/jwtHandlers';

/*
 * function name : checkAlreadyID
 * feature : 아이디 중복 확인
 * req : 아이디
 * res : res message(중복 여부)
 */

const checkAlreadyID = async (req: Request, res: Response) => {
  const { id }: { id?: String; } = req.params;
	if (!id) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));

	try {
		const isAlreadyUser = await userService.getUserByID(id);
    if(isAlreadyUser) {
      return res.status(statusCode.FORBIDDEN).send(util.fail(statusCode.FORBIDDEN, resMessage.ALREADY_ID));
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NEW_ID));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};


/*
 * function name : signUp
 * feature : 일반 회원가입
 * req : id, password
 * res : jwt token
 */

const signUp = async (req: Request, res: Response) => {
  const {
    id,
    password
  }: {
		id: string;
		password: string;
  } = req.body;

  if (!id || !password) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
  }

  try {
    const isAlreadyUser = await userService.getUserByID(id);
    if(isAlreadyUser) {
      return res.status(statusCode.FORBIDDEN).send(util.fail(statusCode.FORBIDDEN, resMessage.ALREADY_ID));
    }

		const user = await userService.signUp(id, password);
    const {accessToken, refreshToken} = await jwt.sign(user);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SIGNUP_SUCCESS, {
      accessToken,
      refreshToken
    }));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};


/*
 * function name : login
 * feature : 일반 로그인
 * req : id, password
 * res : jwt token
 */

type userInfo = {
  salt: string;
  hashed: string;
}

const login = async (req: Request, res: Response) => {
  const {
    id,
    password
  }: {
		id: string;
		password: string;
  } = req.body;

  if (!id || !password) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
  }

  try {
    const isAlreadyUser = await userService.getUserByID(id);
    if(!isAlreadyUser) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    }
    
    const {hashed, salt} = <userInfo>isAlreadyUser;
    const user = await userService.login(id, password, salt);
		if(!user){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
    }

    const {accessToken, refreshToken} = await jwt.sign(user);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
      accessToken,
      refreshToken
    }));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};

const socialLogin = async (req: Request, res: Response) => {
  //이미 id가 DB에 있으면 로그인
  //없으면 회원가입
};

export default {
  checkAlreadyID,
  signUp,
  login,
  socialLogin
};
