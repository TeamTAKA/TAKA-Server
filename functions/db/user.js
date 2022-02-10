const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getUserById = async (client, userId) => {
  const { rows } = await client.query(
    `
        SELECT *
        FROM "user" u
        WHERE u.id = $1
            AND u.is_deleted = FALSE
        `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const createUser = async (client, id, password) => {
  const { rows } = await client.query(
    `
      INSERT INTO "user"
      (id, password)
      VALUES
      ($1, $2)
      RETURNING id, password
          `,
    [id, password],
  );
  console.log(rows);
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { createUser, getUserById };
