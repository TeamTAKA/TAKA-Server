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
    SELECT play_title_kor, play_title_eng, play_date, play_time, play_hall, play_seat, play_cast, play_seller, play_review, play_image FROM ticket
    WHERE ticket_idx = $1
      AND is_deleted = FALSE
    `,
    [ticketIdx],
  );

  if (rows.length === 0) return false;
  const nameOfPlay = rows[0].play_title_kor;

  const { rows: count } = await client.query(
    `
    SELECT * FROM ticket
    WHERE play_title_kor = $1
      AND is_deleted = FALSE
    `,
    [nameOfPlay],
  );

  let result = rows[0];
  result.playCount = count.length;

  return convertSnakeToCamel.keysToCamel(result);
};

const updateTicket = async (client, ticketIdx, titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM ticket
    WHERE ticket_idx = $1
       AND is_deleted = FALSE
    `,
    [ticketIdx],
  );

  if (existingRows.length === 0) return false;

  const data = _.merge({}, convertSnakeToCamel.keysToCamel(existingRows[0]), { titleKor, titleEng, date, time, hall, seat, cast, seller, review, imageUrls });

  const { rows } = await client.query(
    `
    UPDATE ticket
    SET play_title_kor = $1, play_title_eng = $2, play_date = $3, play_time = $4, play_hall = $5, play_seat = $6, play_cast = $7, play_seller = $8, play_review = $9, play_image = $10, updated_at = now()
    WHERE ticket_idx = $11
    RETURNING play_title_kor, play_title_eng, play_date, play_time, play_hall, play_seat, play_cast, play_seller, play_review, play_image
    `,
    [data.titleKor, data.titleEng, data.date, data.time, data.hall, data.seat, data.cast, data.seller, data.review, data.imageUrls, ticketIdx],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const deleteTicket = async (client, ticketIdx) => {
  const { rows } = await client.query(
    `
    UPDATE ticket
    SET is_deleted = TRUE, updated_at = now()
    WHERE ticket_idx = $1
    RETURNING *
    `,
    [ticketIdx],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getAllTicketsByuserIdx = async (client, userIdx) => {
  const { rows } = await client.query(
    `
    SELECT play_image, play_title_eng, play_title_kor, play_date FROM ticket
    WHERE user_idx = $1
      AND is_deleted = FALSE
      ORDER BY ticket_idx
    `,
    [userIdx],
  );

  if (rows.length < 1) return [];

  return convertSnakeToCamel.keysToCamel(rows);
};

const getAllTicketGroupsByuserIdx = async (client, userIdx) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT ticket_idx, play_image, play_title_kor, play_date FROM ticket
    WHERE user_idx = $1
      AND is_deleted = FALSE
    ORDER BY play_title_kor
    `,
    [userIdx],
  );

  if (existingRows.length < 1) return [];

  let resultArray = [];
  let checkNameOfPlay = [];
  existingRows.forEach((item) => {
    if (!checkNameOfPlay.includes(item.play_title_kor)) {
      checkNameOfPlay.push(item.play_title_kor);

      let array = [];
      let ticketData = {};
      ticketData.ticketIdx = item.ticket_idx;
      ticketData.playDate = item.play_date;
      ticketData.playImage = item.play_image;
      array.push(ticketData);

      let playData = {};
      playData.playTitleKor = item.play_title_kor;
      playData.ticketList = array;

      resultArray.push(playData);
    } else {
      const idx = checkNameOfPlay.indexOf(item.play_title_kor);

      let ticketData = {};
      ticketData.ticketIdx = item.ticket_idx;
      ticketData.playDate = item.play_date;
      ticketData.playImage = item.play_image;

      resultArray[idx].ticketList.push(ticketData);
    }
  });

  if (!checkNameOfPlay.includes()) return convertSnakeToCamel.keysToCamel(resultArray);
};

const searchTicketByKeyword = async (client, keyword) => {
  const { rows } = await client.query(
    `
    SELECT ticket_idx, play_date, play_image FROM ticket
    WHERE play_title_kor = $1 OR play_cast LIKE $2
      AND is_deleted = FALSE
    `,
    [keyword, '%' + keyword + '%'],
  );

  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = {
  getAllTicketsByuserIdx,
  getAllTicketGroupsByuserIdx,
  getTicketById,
  addTicket,
  updateTicket,
  deleteTicket,
  searchTicketByKeyword,
};
