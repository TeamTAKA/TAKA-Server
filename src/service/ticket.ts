import pool from '../modules/pool';

const addNewTicket = async (user:Number, coverImage: String, titleKor: String, titleEng: String, date: String, time: String, hall: String, seat: String, cast: String, seller: String, review: String) => {
  const fields = 'user_idx, cover_img, title_kor, title_eng, date, time, hall, seat, cast, seller, review';
  const questions = `?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?`;
  const values = [user, coverImage, titleKor, titleEng, date, time, hall, seat, cast, seller, review];
  const query = `INSERT INTO Ticket (${fields}) VALUES (${questions})`;

  try {
    const result: any = await pool.queryParamArr(query, values);
    const insertId = result.insertId;
    return insertId;
  } catch (err) {
    console.log('addNewTicket ERROR : ', err);
    throw err;
  }
};


// type, interface 등 개념 살펴보고 분리할 수 있는 방법 찾아보기
type ticketInfo = {
  ticketIdx: Number;
  titleKor: String;
  titleEng: String;
  date: String;
  time: String;
  hall: String;
  seat: String;
  cast: String;
  seller: String;
  review: String;
  coverImage: String;
  count: Number;
}

type ticketIdxInfo = {
  ticketIdx: Number;
}

const showTicketInfo = async (userIDX: Number, ticketIDX: Number) => {
  const query = `SELECT ticket_idx AS ticketIdx, title_kor AS titleKor, title_eng AS titleEng, date, time, hall, seat, cast, seller, review, cover_img AS coverImage FROM Ticket WHERE ticket_idx = ${ticketIDX} AND user_idx = ${userIDX}`;

  try {
    //해당 티켓의 정보
    let result = <ticketInfo[]>await pool.queryParam(query);
    
    //관극 횟수 count
    const queryForCount = `SELECT ticket_idx AS ticketIdx FROM Ticket WHERE title_kor = '${result[0].titleKor}'`;
    const example = <ticketIdxInfo[]>await pool.queryParam(queryForCount);
    let array : any = [];
    example.forEach((item) => {
      array.push(item['ticketIdx']);
    })
    result[0].count = array.indexOf(result[0]['ticketIdx'])+1;

    return result[0];
  } catch (err) {
    console.log('showTicketInfo ERROR : ', err);
    throw err;
  }
};

const editTicketInfo = async (userIDX:Number, ticketIDX: Number, coverImage: String, titleKor: String, titleEng: String, date: String, time: String, hall: String, seat: String, cast: String, seller: String, review: String) => {
  const query = `UPDATE Ticket SET cover_img = "${coverImage}", title_kor = "${titleKor}", title_eng = "${titleEng}", date = "${date}", time = "${time}", hall = "${hall}", seat = "${seat}", cast = "${cast}", seller = "${seller}", review = "${review}" WHERE ticket_idx = ${ticketIDX} AND user_idx = ${userIDX}`;

  try{
    const result = await pool.queryParam(query);
    return result;
  }catch(err){
    console.log('editTicketInfo ERROR : ', err);
    throw err;
  }
};

const deleteTicket = async (userIDX: Number, ticketIDX: Number) => {
  const query = `DELETE FROM Ticket WHERE ticket_idx = ${ticketIDX} AND user_idx = ${userIDX}`;

  try{
    const result = await pool.queryParam(query);
    return result;
  }catch(err){
    console.log('deleteTicket ERROR : ', err);
    throw err;
  }
};

const showTicketList = async (userIDX?: Number) => {
  const query = `SELECT ticket_idx AS ticketIdx, cover_img AS coverImage, title_eng AS titleEng, title_kor AS titleKor, date FROM Ticket WHERE user_idx = ${userIDX} ORDER BY date DESC, time DESC`;

  try {
    const result = await pool.queryParam(query);
    return result;
  } catch (err) {
    console.log('showTicketList ERROR : ', err);
    throw err;
  }
};


type ticketListOrderByTitleKor = {
  ticketIdx: Number;
  titleKor: String;
  date: String;
  coverImage: String;
}

type ticketListExceptTitleKor = {
  ticketIdx?: Number;
  date?: String;
  coverImage?: String;
}

type resultList = {
  titleKor: String;
  ticketList: ticketListExceptTitleKor[];
}

const showTicketListbyGroup = async (userIDX?: Number) => {
  const query = `SELECT ticket_idx AS ticketIdx, cover_img AS coverImage, title_kor AS titleKor, date FROM Ticket WHERE user_idx = ${userIDX} ORDER BY title_kor, date DESC, time DESC`;

  try {
    const existingRows = await pool.queryParam(query) as ticketListOrderByTitleKor[];
    if (existingRows.length < 1) return [];

    let resultArray = <resultList[]>[];
    let checkNameOfPlay = <String[]>[];

    existingRows.forEach((item) => {
      if (!checkNameOfPlay.includes(item.titleKor)) {
        checkNameOfPlay.push(item.titleKor);
  
        let array = [];
        let ticketData = <ticketListExceptTitleKor>{};
        ticketData.ticketIdx = item.ticketIdx;
        ticketData.date = item.date;
        ticketData.coverImage = item.coverImage;
        array.push(ticketData);
  
        let playData = <resultList>{};
        playData.titleKor = item.titleKor;
        playData.ticketList = array;
  
        resultArray.push(playData);
      } else {
        const idx = checkNameOfPlay.indexOf(item.titleKor);

        let ticketData = <ticketListExceptTitleKor>{};
        ticketData.ticketIdx = item.ticketIdx;
        ticketData.date = item.date;
        ticketData.coverImage = item.coverImage;

        resultArray[idx].ticketList.push(ticketData);
      }
    });

    return resultArray;
  } catch (err) {
    console.log('showTicketListbyGroup ERROR : ', err);
    throw err;
  }
};

const searchbyKeyword = async (userIDX?: Number, keyword?:String) => {
  const query = `SELECT
                  ticket_idx AS ticketIdx,
                  title_kor AS titleKor,
                  cover_img AS coverImage,
                  date FROM Ticket
                WHERE user_idx = ${userIDX} AND title_kor LIKE '%${keyword}%'
                ORDER BY
                  CASE
                    WHEN title_kor = '${keyword}' THEN 0
                    WHEN title_kor = '${keyword}%' THEN 1
                    WHEN title_kor = '%${keyword}%' THEN 2
                    WHEN title_kor = '%${keyword}' THEN 3
                    ELSE 4 END,
                  date ASC, time ASC`;

  try {
    const existingRows = await pool.queryParam(query) as ticketListOrderByTitleKor[];
    if (existingRows.length < 1) return [];

    let resultArray = <resultList[]>[];4
    let checkNameOfPlay = <String[]>[];

    existingRows.forEach((item) => {
      if (!checkNameOfPlay.includes(item.titleKor)) {
        checkNameOfPlay.push(item.titleKor);
  
        let array = [];
        let ticketData = <ticketListExceptTitleKor>{};
        ticketData.ticketIdx = item.ticketIdx;
        ticketData.date = item.date;
        ticketData.coverImage = item.coverImage;
        array.push(ticketData);
  
        let playData = <resultList>{};
        playData.titleKor = item.titleKor;
        playData.ticketList = array;
  
        resultArray.push(playData);
      } else {
        const idx = checkNameOfPlay.indexOf(item.titleKor);

        let ticketData = <ticketListExceptTitleKor>{};
        ticketData.ticketIdx = item.ticketIdx;
        ticketData.date = item.date;
        ticketData.coverImage = item.coverImage;

        resultArray[idx].ticketList.push(ticketData);
      }
    });

    return resultArray;
  } catch (err) {
    console.log('searchbyKeyword ERROR : ', err);
    throw err;
  }
};

export default {
	addNewTicket,
	showTicketList,
	showTicketListbyGroup,
  showTicketInfo,
	editTicketInfo,
	deleteTicket,
	searchbyKeyword
};