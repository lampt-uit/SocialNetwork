import { GLOBALTYPES } from './global.type';
import { imageUpload } from '../../utils/imageUpload';
import { postDataAPI } from '../../utils/fetchData';

export const POST_TYPES = {
	CREATE_POST: 'CREATE_POST'
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

			dispatch({ type: POST_TYPES.CREATE_POST, payload: res.data.newPost });

			dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};
