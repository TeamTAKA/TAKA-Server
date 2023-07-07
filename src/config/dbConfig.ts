import * as dotenv from 'dotenv';
dotenv.config();

const mysql = require('promise-mysql');
const dbConfig = {
  host: process.env.DB_HOST as string,
  port: process.env.DB_PORT as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DB as string,
};

export default mysql.createPool(dbConfig);
