import pool from '../modules/pool';
import encrypt from '../modules/crypto';

const getUserByID = async (id: String) => {
  const query = `SELECT hashed, salt FROM User WHERE user_id = '${id}'`;

  try {
    const result = await pool.queryParam(query) as Object[];
    let resultInfo;
    if(!result){
      resultInfo = 0;
    }else{
      resultInfo = result[0];
    }
    return resultInfo;
  } catch (err) {
    console.log('getUserByID ERROR : ', err);
    throw err;
  }
};

const getUserBysnsId = async (snsId: String) => {
  const query = `SELECT snsId FROM User WHERE snsId = '${snsId}'`;

  try {
    const result = await pool.queryParam(query) as Object[];
    let resultInfo;
    if(!result){
      resultInfo = 0;
    }else{
      resultInfo = result[0];
    }
    return resultInfo;
  } catch (err) {
    console.log('getUserBysnsId ERROR : ', err);
    throw err;
  }
};

type hashedInfo = {
  salt: string;
  hashed: string;
}

const signUp = async (id: string, password: string) => {
  const crypted = await encrypt.encrypt(password);
  const hashedData = crypted as hashedInfo;

  const fields = 'user_id, salt, hashed';
  const questions = `?, ?, ?`;
  const values = [id, hashedData.salt, hashedData.hashed];
  const query = `INSERT INTO User (${fields}) VALUES (${questions})`;

  try {
    const result: any = await pool.queryParamArr(query, values);
    const insertId = result.insertId;
    const getQuery = `SELECT user_idx AS idx, user_id AS id FROM User WHERE user_idx = ${insertId}`;
    const userData = await pool.queryParam(getQuery) as Object[];
    return userData[0];
  } catch (err) {
    console.log('signUp ERROR : ', err);
    throw err;
  }
};

const signUpBysnsId = async (snsId: String) => {
  const fields = 'snsId';
  const questions = `?`;
  const values = [snsId];
  const query = `INSERT INTO User (${fields}) VALUES (${questions})`;

  try {
    const result: any = await pool.queryParamArr(query, values);
    const insertId = result.insertId;
    const getQuery = `SELECT user_idx AS idx, snsId AS id FROM User WHERE user_idx = ${insertId}`;
    const userData = await pool.queryParam(getQuery) as Object[];
    return userData[0];
  } catch (err) {
    console.log('signUpBysnsId ERROR : ', err);
    throw err;
  }
};


const login = async (id: string, password: string, salt: string) => {
  const inputPassword = await encrypt.encryptWithSalt(password, salt);
  const query = `SELECT user_idx AS idx, user_id AS id FROM User WHERE user_id = '${id}' AND hashed = '${inputPassword}'`;

  try {
    const result = await pool.queryParam(query) as Object[];
    return result[0];
  } catch (err) {
    console.log('getUserByID ERROR : ', err);
    throw err;
  }
};

const loginBysnsId = async (snsId: String) => {
  const query = `SELECT user_idx AS idx, snsId AS id FROM User WHERE snsId = '${snsId}'`;

  try {
    const result = await pool.queryParam(query) as Object[];
    return result[0];
  } catch (err) {
    console.log('loginBysnsId ERROR : ', err);
    throw err;
  }
};

type userInfo = {
  idx: Number;
  id: String;
}

const updateRefreshToken = async (user:Object, refreshToken:String) => {
  const userData = <userInfo>user;
  const query = `UPDATE User SET refresh_token = '${refreshToken}' WHERE user_idx = ${userData.idx}`;

  try {
    const result = await pool.queryParam(query);
    return result;
  } catch (err) {
    console.log('updateRefreshToken ERROR : ', err);
    throw err;
  }
};

const checkRefreshtoeknByIdx = async (idx: Number) => {
  const query = `SELECT refresh_token AS refreshToken FROM User WHERE user_idx = '${idx}'`;

  try {
    const result = await pool.queryParam(query) as Object[];
    return result[0];
  } catch (err) {
    console.log('checkRefreshtoeknByIdx ERROR : ', err);
    throw err;
  }
};

export default {
  getUserByID,
  getUserBysnsId,
  signUp,
  signUpBysnsId,
  login,
  loginBysnsId,
  updateRefreshToken,
  checkRefreshtoeknByIdx
};
