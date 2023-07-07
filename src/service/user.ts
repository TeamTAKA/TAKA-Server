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

export default {
  getUserByID,
  signUp,
  login
};
