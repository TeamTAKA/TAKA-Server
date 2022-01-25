const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getAllCards = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "card" u
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getAllCards };
