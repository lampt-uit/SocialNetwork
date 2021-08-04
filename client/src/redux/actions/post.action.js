import { GLOBALTYPES } from './global.type';
import { imageUpload } from '../../utils/imageUpload';
import { getDataAPI, postDataAPI, patchDataAPI } from '../../utils/fetchData';

export const POST_TYPES = {
	CREATE_POST: 'CREATE_POST',
	LOADING_POST: 'LOADING_POST',
	GET_POSTS: 'GET_POSTS',
	UPDATE_POST: 'UPDATE_POST'
};

export const createPost =
	({ content, images, auth }) =>
	async (dispatch) => {
		let media = [];
		try {
			dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
			if (images) media = await imageUpload(images);
			// console.log(media);

			const res = await postDataAPI(
				'posts',
				{ content, images: media },
				auth.token
			);
			// console.log(res);

			// dispatch({ type: POST_TYPES.CREATE_POST, payload: res.data.newPost });
			//fix bug:user only contain _id
			dispatch({
				type: POST_TYPES.CREATE_POST,
				payload: { ...res.data.newPost, user: auth.user }
			});

			dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const getPosts = (token) => async (dispatch) => {
	try {
		dispatch({ type: POST_TYPES.LOADING_POST, payload: true });
		const res = await getDataAPI('posts', token);
		// console.log(res);
		dispatch({ type: POST_TYPES.GET_POSTS, payload: res.data });
		dispatch({ type: POST_TYPES.LOADING_POST, payload: false });
	} catch (error) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: { errors: error.response.data.msg }
		});
	}
};

export const updatePost =
	({ content, images, auth, status }) =>
	async (dispatch) => {
		let media = [];
		//Check images add new
		const imgNewUrl = images.filter((img) => !img.url);
		const imgOldUrl = images.filter((img) => img.url);
		// console.log({ imgNewUrl, imgOldUrl });

		if (
			status.content === content &&
			imgNewUrl.length === 0 &&
			imgOldUrl.length === status.images.length
		)
			return;

		try {
			dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
			if (imgNewUrl) media = await imageUpload(imgNewUrl);
			const res = await patchDataAPI(
				`post/${status._id}`,
				{ content, images: [...imgOldUrl, ...media] },
				auth.token
			);
			console.log(res);
			dispatch({ type: POST_TYPES.UPDATE_POST, payload: res.data.newPost });
			dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};
