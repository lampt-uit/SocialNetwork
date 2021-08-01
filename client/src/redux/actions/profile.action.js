import { GLOBALTYPES, DeleteData } from './global.type';
import { getDataAPI, patchDataAPI } from '../../utils/fetchData';
import { imageUpload } from '../../utils/imageUpload';

export const PROFILE_TYPES = {
	LOADING: 'LOADING',
	GET_USER: 'GET_USER',
	FOLLOW: 'FOLLOW',
	UNFOLLOW: 'UNFOLLOW'
};

export const getProfileUsers =
	({ users, id, auth }) =>
	async (dispatch) => {
		if (users.every((user) => user._id !== id)) {
			try {
				dispatch({ type: PROFILE_TYPES.LOADING, payload: true });
				const res = await getDataAPI(`user/${id}`, auth.token);
				dispatch({ type: PROFILE_TYPES.GET_USER, payload: res.data });
				dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
			} catch (error) {
				dispatch({
					type: GLOBALTYPES.ALERT,
					payload: { errors: error.response.data.msg }
				});
			}
		}
	};

export const updateProfileUser =
	({ userData, avatar, auth }) =>
	async (dispatch) => {
		console.log(userData);
		if (!userData.fullname)
			return dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: 'Please add your full name.' }
			});
		if (userData.fullname.length > 25)
			return dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: 'Your full name too long.' }
			});
		if (userData.story.length > 200)
			return dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: 'Your story too long.' }
			});
		try {
			let media;
			dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
			if (avatar) media = await imageUpload([avatar]);
			// console.log(media);

			const res = await patchDataAPI(
				'user',
				{
					...userData,
					avatar: avatar ? media[0].url : auth.user.avatar
				},
				auth.token
			);

			dispatch({
				type: GLOBALTYPES.AUTH,
				payload: {
					...auth,
					user: {
						...auth.user,
						...userData,
						avatar: avatar ? media[0].url : auth.user.avatar
					}
				}
			});

			dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const follow =
	({ users, user, auth }) =>
	(dispatch) => {
		//Follow present = Before Follow + Follow of auth
		let newUser = { ...user, followers: [...user.followers, auth.user] };
		dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser });
		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: {
				...auth,
				user: { ...auth.user, following: [...auth.user.following, newUser] }
			}
		});
	};

export const unfollow =
	({ users, user, auth }) =>
	(dispatch) => {
		let newUser = {
			...user,
			followers: DeleteData(user.followers, auth.user._id)
		};
		dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser });
		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: {
				...auth,
				user: {
					...auth.user,
					following: DeleteData(auth.user.following, newUser._id)
				}
			}
		});
	};
