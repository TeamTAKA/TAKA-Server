const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

//정렬 방식 고려해 수정 필요
const getAllTicketsByticketIdx = async (client, ticketIdx) => {
  if (ticketIdx.length < 1) return [];
  const { rows } = await client.query(
    `
    SELECT * FROM ticket t
    WHERE id = $1
      AND is_deleted = FALSE
    `,
    [ticketIdx],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getTicketById = async (client, ticketIdx) => {
  const { rows } = await client.query(
    `
    SELECT * FROM ticket t
    WHERE id = $1
      AND is_deleted = FALSE
    `,
    [ticketIdx],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const addTicket = async (client, ticketIdx, titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls) => {
  const { rows } = await client.query(
    `
    INSERT INTO ticket
    (user_id, play_title_kor, play_title_eng, play_date, play_time, play_hall, play_seat, play_cast, play_seller, play_review, play_image)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
    `,
    [ticketIdx, titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const updateTicket = async (client, ticketIdx, titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM ticket t
    WHERE id = $1
       AND is_deleted = FALSE
    `,
    [ticketIdx],
  );

  if (existingRows.length === 0) return false;

  const data = _.merge({}, convertSnakeToCamel.keysToCamel(existingRows[0]), { titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls });

  const { rows } = await client.query(
    `
    UPDATE ticket t
    SET titleKor = $1, titleEng = $2, date = $3, time = $4, hall = $5, seat = $6, cast = $7, seller = $8, review = $9, imageUrls = $10, updated_at = now()
    WHERE id = $11
    RETURNING * 
    `,
    [data.titleKor, data.titleEng, data.date, data.time, data.hall, data.seat, data.cast, data.seller, data.review, data.imageUrls, ticketIdx],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const deleteTicket = async (client, ticketIdx) => {
  const { rows } = await client.query(
    `
    UPDATE ticket t
    SET is_deleted = TRUE, updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [ticketIdx],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = {
  getAllTicketsByticketIdx,
  getTicketById,
  addTicket,
  updateTicket,
  deleteTicket,
};
