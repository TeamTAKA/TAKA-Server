const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const addTicket = async (client, userIdx, titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls) => {
  const { rows } = await client.query(
    `
    INSERT INTO ticket
    (user_idx, play_title_kor, play_title_eng, play_date, play_time, play_hall, play_seat, play_cast, play_seller, play_review, play_image)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
    `,
    [userIdx, titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getTicketById = async (client, ticketIdx) => {
  const { rows } = await client.query(
    `
    SELECT * FROM ticket t
    WHERE ticket_idx = $1
      AND is_deleted = FALSE
    `,
    [ticketIdx],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const updateTicket = async (client, ticketIdx, titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM ticket t
    WHERE ticket_idx = $1
       AND is_deleted = FALSE
    `,
    [ticketIdx],
  );

  if (existingRows.length === 0) return false;

  const data = _.merge({}, convertSnakeToCamel.keysToCamel(existingRows[0]), { titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls });

  const { rows } = await client.query(
    `
    UPDATE ticket t
    SET play_title_kor = $1, play_title_eng = $2, play_date = $3, play_time = $4, play_hall = $5, play_seat = $6, play_cast = $7, play_seller = $8, play_review = $9, play_image = $10, updated_at = now()
    WHERE ticket_idx = $11
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
    WHERE ticket_idx = $1
    RETURNING *
    `,
    [ticketIdx],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getAllTicketsByuserIdx = async (client, userIdx) => {
  if (userIdx.length < 1) return [];
  const { rows } = await client.query(
    `
    SELECT * FROM ticket t
    WHERE user_idx = $1
      AND is_deleted = FALSE
    `,
    [userIdx],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getAllTicketGroupsByuserIdx = async (client, userIdx) => {
  if (userIdx.length < 1) return [];
  const { rows } = await client.query(
    `
    SELECT * FROM ticket t
    WHERE user_idx = $1
      AND is_deleted = FALSE
    `,
    [userIdx],
  );

  //rows를 극별로 그룹핑하는 과정 필요

  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = {
  getAllTicketsByuserIdx,
  getAllTicketGroupsByuserIdx,
  getTicketById,
  addTicket,
  updateTicket,
  deleteTicket,
};
