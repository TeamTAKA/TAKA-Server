import { String } from 'aws-sdk/clients/cloudsearchdomain';
import crypto from 'crypto';
import pbkdf2 from 'pbkdf2';

const encrypt = async (password:string) => {
  return new Promise((resolve, reject) => {
    try {
      const salt = crypto.randomBytes(32).toString('hex');
      if (typeof password === 'string'){
        pbkdf2.pbkdf2(password, salt.toString(), 1, 32, 'sha512', (err?:Error, derivedKey?:any) => {
          if (err) throw err;
          const hashed = derivedKey.toString('hex');
          resolve({ salt , hashed });
        });
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const  encryptWithSalt = async (password:string, salt:string) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof password === 'string' && typeof salt === 'string'){
        pbkdf2.pbkdf2(password, salt, 1, 32, 'sha512', (err?:Error, derivedKey?:any) => {
          if (err) throw err;
          const hashed = derivedKey.toString('hex');
          resolve(hashed);
        });
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

export default {
  encrypt,
  encryptWithSalt
};
  