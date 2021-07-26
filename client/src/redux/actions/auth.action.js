import { postDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './global.type';

export const TYPES = {
	AUTH: 'AUTH'
};

export const login = (data) => async (dispatch) => {
	try {
		// console.log(data);
		dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
		const res = await postDataAPI('login', data);
		// console.log(res);

		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: {
				token: res.data.access_token,
				user: res.data.user
			}
		});

		localStorage.setItem('firstLogin', true);
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				success: res.data.msg
			}
		});
	} catch (error) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				errors: error.response.data.msg
			}
		});
	}
};

export const refreshToken = () => async (dispatch) => {
	const firstLogin = localStorage.getItem('firstLogin');
	if (firstLogin) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
		try {
			const res = await postDataAPI('refresh_token');
			dispatch({
				type: GLOBALTYPES.AUTH,
				payload: {
					token: res.data.access_token,
					user: res.data.user
				}
			});

			dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	}
};
