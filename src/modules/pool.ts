import poolPromise from '../config/dbConfig';

const queryParam = async (query: String) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await poolPromise;
      const connection = await pool.getConnection();
      try {
        const result = await connection.query(query);
        connection.release();
        resolve(result);
      } catch (err) {
        connection.release();
        reject(err);
      }
    } catch (err) {
      reject(err);
    }
  });
};

const queryParamArr = async (query: String, value: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await poolPromise;
      const connection = await pool.getConnection();
      try {
        const result = await connection.query(query, value);
        connection.release();
        resolve(result);
      } catch (err) {
        connection.release();
        reject(err);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  queryParam,
  queryParamArr,
};

// Transaction: async (...args) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const pool = await poolPromise;
//             const connection = await pool.getConnection();
//             try {
//                 await connection.beginTransaction();
//                 args.forEach(async (it) => await it(connection));
//                 await connection.commit();
//                 pool.releaseConnection(connection);
//                 resolve(result);
//             } catch (err) {
//                 await connection.rollback()
//                 pool.releaseConnection(connection);
//                 reject(err);
//             }
//         } catch (err) {
//             reject(err);
//         }
//     });
// }
