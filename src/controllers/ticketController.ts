import { Request, Response } from 'express';
import util from '../modules/util';
import statusCode from '../modules/statusCode';
import resMessage from '../modules/responseMessage';
import ticketService from '../service/ticket';

/*
 * 티켓 추가
 */
const addNewTicket = async (req: Request, res: Response) => {
	const user = req.decoded as userInfo;
	if (!user) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
	const userIDX = user.idx;

  const {
		titleKor,
		titleEng,
		date,
		time,
		hall,
		seat,
		cast,
		seller,
		review
  }: {
		titleKor: String;
		titleEng: String;
		date: String;
		time: String;
		hall: String;
		seat: String;
		cast: String;
		seller: String;
		review: String;
  } = req.body;

	if (!req.file || !titleKor || !date) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
  }

	const coverImage = (req.file as Express.MulterS3.File).location;

	try {
		const ticketIdx = await ticketService.addNewTicket(userIDX, coverImage, titleKor, titleEng, date, time, hall, seat, cast, seller, review);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_TICKET_SUCCESS, ticketIdx));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};


/*
 * 티켓 모아 보기
 */

declare global {
  namespace Express {
    interface Request {
      decoded?: Object;
    }
  }
}

type userInfo = {
	idx : number,
	id : string,
	iat: number,
	exp: number,
	iss: string
}

const showTicketList = async (req: Request, res: Response) => {
	const user = req.decoded as userInfo;
	if (!user) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
	const userIDX = user.idx;

	try {
		const ticketListInfo = await ticketService.showTicketList(userIDX);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_TICKET_LIST_SUCCESS, ticketListInfo as Object));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};


/*
 * 티켓 모아 보기(그룹핑)
 */
const showTicketListbyGroup = async (req: Request, res: Response) => {
	
	const user = req.decoded as userInfo;
	if (!user) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
	const userIDX = user.idx;

	try {
		const ticketListInfo = await ticketService.showTicketListbyGroup(userIDX);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_TICKET_LIST_BY_GROUP_SUCCESS, ticketListInfo as Object));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};


/*
 * 티켓 상세 보기
 */
const showTicketInfo = async (req: Request, res: Response) => {
	
	const user = req.decoded as userInfo;
	if (!user) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
	const userIDX = user.idx;

	const { ticketIDX }: { ticketIDX?: Number } = req.params;
	if (!ticketIDX) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));

	try {
		const detailInfo = await ticketService.showTicketInfo(userIDX, ticketIDX);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_TICKET_SUCCESS, detailInfo as Object));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};


/*
 * 티켓 수정하기
 */
const editTicketInfo = async (req: Request, res: Response) => {

	const user = req.decoded as userInfo;
	if (!user) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
	const userIDX = user.idx;

	const { ticketIDX }: { ticketIDX?: Number } = req.params;
	if (!ticketIDX) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));

  const {
		titleKor,
		titleEng,
		date,
		time,
		hall,
		seat,
		cast,
		seller,
		review
  }: {
		titleKor: String;
		titleEng: String;
		date: String;
		time: String;
		hall: String;
		seat: String;
		cast: String;
		seller: String;
		review: String;
  } = req.body;

	if (!req.file) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
  }

	const coverImage = (req.file as Express.MulterS3.File).location;

	try {
		const updatedTicket = await ticketService.editTicketInfo(userIDX, ticketIDX, coverImage, titleKor, titleEng, date, time, hall, seat, cast, seller, review);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_TICKET_SUCCESS));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};


/*
 * 티켓 삭제하기
 */
const deleteTicket = async (req: Request, res: Response) => {
	
	const user = req.decoded as userInfo;
	if (!user) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
	const userIDX = user.idx;

	const { ticketIDX }: { ticketIDX?: Number } = req.params;
	if (!ticketIDX) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));

	try {
		const deletedTicket = await ticketService.deleteTicket(userIDX, ticketIDX);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_TICKET_SUCCESS));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};


/*
 * 키워드 검색 - 일단 한글 이름으로 해둠
 */
const searchbyKeyword = async (req: Request, res: Response) => {

	const user = req.decoded as userInfo;
	if (!user) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
	const userIDX = user.idx;

	const { keyword }: { keyword: String; } = req.body;
	if (!keyword) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));

	try {
		const searchedData = await ticketService.searchbyKeyword(userIDX, keyword);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEARCH_TICKET_SUCCESS, searchedData as Object));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.NULL_ERROR));
  }
};

export default {
	addNewTicket,
	showTicketInfo,
	showTicketList,
	showTicketListbyGroup,
	editTicketInfo,
	deleteTicket,
	searchbyKeyword
};
