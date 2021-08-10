import { GLOBALTYPES } from './global.type';
import { postDataAPI, getDataAPI } from '../../utils/fetchData';

export const MESS_TYPES = {
	ADD_USER: 'ADD_USER',
	ADD_MESSAGE: 'ADD_MESSAGE',
	GET_CONVERSATIONS: 'GET_CONVERSATIONS',
	GET_MESSAGES: 'GET_MESSAGES'
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
	({ auth }) =>
	async (dispatch) => {
		try {
			const res = await getDataAPI('conversations', auth.token);
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
	({ auth, id }) =>
	async (dispatch) => {
		try {
			const res = await getDataAPI(`message/${id}`, auth.token);
			// console.log(res);
			dispatch({ type: MESS_TYPES.GET_MESSAGES, payload: res.data });
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};
