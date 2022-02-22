const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getUserById = async (client, id) => {
  const { rows } = await client.query(
    `
        SELECT *
        FROM users u
        WHERE u.id = $1
            AND u.is_deleted = FALSE
    `,
    [id],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const createUser = async (client, id, hashed, salt) => {
  const { rows } = await client.query(
    `
      INSERT INTO users
      (id, hashed, salt)
      VALUES
      ($1, $2, $3)
      RETURNING id, hashed, user_idx
    `,
    [id, hashed, salt],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const logIn = async (client, id, hashed, salt) => {
  const { rows } = await client.query(
    `
    SELECT id, hashed, user_idx
    FROM users u
    WHERE u.id = $1
      AND u.hashed = $2
      AND u.salt = $3
      AND u.is_deleted = FALSE
    `,
    [id, hashed, salt],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { createUser, getUserById, logIn };
