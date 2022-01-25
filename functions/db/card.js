const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const addCard = async (client, userId, title, content, imageUrls) => {
  const { rows } = await client.query(
    `
    INSERT INTO card
    (user_id, title, content, image_urls)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
    `,
    [userId, title, content, imageUrls],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { addCard };
