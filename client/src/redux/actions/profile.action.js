import { GLOBALTYPES, DeleteData } from './global.type';
import { getDataAPI, patchDataAPI } from '../../utils/fetchData';
import { imageUpload } from '../../utils/imageUpload';

export const PROFILE_TYPES = {
	LOADING: 'LOADING_PROFILE',
	GET_USER: 'GET_PROFILE_USER',
	FOLLOW: 'FOLLOW',
	UNFOLLOW: 'UNFOLLOW',
	GET_ID: 'GET_PROFILE_ID',
	GET_POSTS: 'GET_PROFILE_POSTS',
	UPDATE_POST: 'UPDATE_PROFILE_POST'
};

export const getProfileUsers =
	({ id, auth }) =>
	async (dispatch) => {
		dispatch({ type: PROFILE_TYPES.GET_ID, payload: id });
		try {
			dispatch({ type: PROFILE_TYPES.LOADING, payload: true });

			const res = getDataAPI(`user/${id}`, auth.token);
			const res1 = getDataAPI(`user_posts/${id}`, auth.token);

			const users = await res;
			const posts = await res1;

			dispatch({ type: PROFILE_TYPES.GET_USER, payload: users.data });
			dispatch({
				type: PROFILE_TYPES.GET_POSTS,
				payload: { ...posts.data, _id: id, page: 2 }
			});
			dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
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
	async (dispatch) => {
		//Follow present = Before Follow + Follow of auth
		// let newUser = { ...user, followers: [...user.followers, auth.user] };

		let newUser;
		if (users.every((item) => item._id !== user._id)) {
			newUser = { ...user, followers: [...user.followers, auth.user] };
		} else {
			users.forEach((item) => {
				if (item._id === user._id) {
					newUser = { ...item, followers: [...item.followers, auth.user] };
				}
			});
		}
		dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser });
		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: {
				...auth,
				user: { ...auth.user, following: [...auth.user.following, newUser] }
			}
		});
		try {
			await patchDataAPI(`user/${user._id}/follow`, null, auth.token);
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const unfollow =
	({ users, user, auth }) =>
	async (dispatch) => {
		// let newUser = {
		// 	...user,
		// 	followers: DeleteData(user.followers, auth.user._id)
		// };

		let newUser;
		if (users.every((item) => item._id !== user._id)) {
			newUser = {
				...user,
				followers: DeleteData(user.followers, auth.user._id)
			};
		} else {
			users.forEach((item) => {
				if (item._id === user._id) {
					newUser = {
						...item,
						followers: DeleteData(item.followers, auth.user._id)
					};
				}
			});
		}
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

		try {
			await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token);
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};
