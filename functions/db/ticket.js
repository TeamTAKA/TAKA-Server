const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const addticket = async (client, userId, title_kor, title_eng, date, time, hall, seat, cast, seller, review, imageUrls) => {
  const { rows } = await client.query(
    `
    INSERT INTO ticket
    (user_id, play_title_kor, play_title_eng, play_date, play_time, play_hall, play_seat, play_cast, play_seller, play_review, play_image)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
    `,
    [userId, title_kor, title_eng, date, time, hall, seat, cast, seller, review, imageUrls],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { addticket };
