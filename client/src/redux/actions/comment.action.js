import { postDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './global.type';
import { POST_TYPES } from './post.action';

export const createComment = (post, newComment, auth) => async (dispatch) => {
	const newPost = { ...post, comments: [...post.comments, newComment] };
	// console.log({ post, newPost });

	dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

	try {
		// const data = { ...newComment, postId: post._id };
		// const res = await postDataAPI('comment', data, auth.token);
		// console.log(res);
	} catch (error) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: { errors: error.response.data.msg }
		});
	}
};
