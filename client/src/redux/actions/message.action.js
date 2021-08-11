import { GLOBALTYPES, DeleteData } from './global.type';
import { postDataAPI, getDataAPI, deleteDataAPI } from '../../utils/fetchData';

export const MESS_TYPES = {
	ADD_USER: 'ADD_USER',
	ADD_MESSAGE: 'ADD_MESSAGE',
	GET_CONVERSATIONS: 'GET_CONVERSATIONS',
	GET_MESSAGES: 'GET_MESSAGES',
	UPDATE_MESSAGES: 'UPDATE_MESSAGES',
	DELETE_MESSAGES: 'DELETE_MESSAGES'
};

export const addUser =
	({ user, message }) =>
	(dispatch) => {
		if (message.users.every((item) => item._id !== user._id)) {
			dispatch({
				type: MESS_TYPES.ADD_USER,
				payload: { ...user, text: '', media: [] }
			});
		}
	};

export const addMessage =
	({ msg, auth, socket }) =>
	async (dispatch) => {
		// console.log(msg);
		dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg });
		socket.emit('addMessage', msg);

		try {
			await postDataAPI('message', msg, auth.token);
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const getConversations =
	({ auth, page = 1 }) =>
	async (dispatch) => {
		try {
			const res = await getDataAPI(
				`conversations?limit=${page * 9}`,
				auth.token
			);
			let newArray = [];
			// console.log(res);
			res.data.conversations.forEach((item) => {
				item.recipients.forEach((cv) => {
					if (cv._id !== auth.user._id) {
						newArray.push({ ...cv, text: item.text, media: item.media });
					}
				});
			});

			// console.log(newArray);
			dispatch({
				type: MESS_TYPES.GET_CONVERSATIONS,
				payload: { newArray, result: res.data.result }
			});
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const getMessages =
	({ auth, id, page = 1 }) =>
	async (dispatch) => {
		try {
			const res = await getDataAPI(
				`message/${id}?limit=${page * 9}`,
				auth.token
			);
			// console.log(res);

			// Reverse() => display newest messages
			const newData = { ...res.data, messages: res.data.messages.reverse() };

			dispatch({
				type: MESS_TYPES.GET_MESSAGES,
				payload: { ...newData, _id: id, page }
			});
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const loadMoreMessages =
	({ auth, id, page = 1 }) =>
	async (dispatch) => {
		try {
			const res = await getDataAPI(
				`message/${id}?limit=${page * 9}`,
				auth.token
			);
			// console.log(res);

			// Reverse() => display newest messages
			const newData = { ...res.data, messages: res.data.messages.reverse() };

			dispatch({
				type: MESS_TYPES.UPDATE_MESSAGES,
				payload: { ...newData, _id: id, page }
			});
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const deleteMessages =
	({ msg, data, auth }) =>
	async (dispatch) => {
		const newData = DeleteData(data, msg._id);
		dispatch({
			type: MESS_TYPES.DELETE_MESSAGES,
			payload: { newData, _id: msg.recipient }
		});

		try {
			await deleteDataAPI(`message/${msg._id}`, auth.token);
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};
