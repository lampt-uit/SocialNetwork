import {
	postDataAPI,
	patchDataAPI,
	deleteDataAPI
} from '../../utils/fetchData';
import { GLOBALTYPES, EditData, DeleteData } from './global.type';
import { POST_TYPES } from './post.action';

export const createComment =
	({ post, newComment, auth, socket }) =>
	async (dispatch) => {
		const newPost = { ...post, comments: [...post.comments, newComment] };
		// console.log({ post, newPost });

		dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

		try {
			const data = {
				...newComment,
				postId: post._id,
				postUserId: post.user._id
			};
			const res = await postDataAPI('comment', data, auth.token);
			// console.log(res);

			const newData = { ...res.data.newComment, user: auth.user };
			const newPost = { ...post, comments: [...post.comments, newData] };
			dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

			//Socket
			socket.emit('createComment', newPost);
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const updateComment =
	({ comment, post, content, auth, socket }) =>
	async (dispatch) => {
		const newComment = EditData(post.comments, comment._id, {
			...comment,
			content
		});
		const newPost = { ...post, comments: newComment };
		dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
		try {
			await patchDataAPI(`comment/${comment._id}`, { content }, auth.token);
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const likeComment =
	({ comment, post, auth, socket }) =>
	async (dispatch) => {
		//In comment
		const newComment = { ...comment, likes: [...comment.likes, auth.user] };

		//In comment on post
		const newComments = EditData(post.comments, comment._id, newComment);

		const newPost = { ...post, comments: newComments };

		dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
		try {
			await patchDataAPI(`comment/${comment._id}/like`, null, auth.token);
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const unLikeComment =
	({ comment, post, auth, socket }) =>
	async (dispatch) => {
		//In comment
		const newComment = {
			...comment,
			likes: DeleteData(comment.likes, auth.user._id)
		};

		//In comment on post
		const newComments = EditData(post.comments, comment._id, newComment);

		const newPost = { ...post, comments: newComments };

		dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
		try {
			await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token);
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};

export const deleteComment =
	({ post, auth, comment, socket }) =>
	async (dispatch) => {
		//If Father comment is deleted => Children comment also deleted
		const deleteArray = [
			...post.comments.filter((cm) => cm.reply === comment._id),
			comment
		];
		// console.log(deleteArray);

		//Update Post => delete comment deleted
		const newPost = {
			...post,
			// Find comment => don't into deleteArray
			comments: post.comments.filter(
				(cm) => !deleteArray.find((da) => cm._id === da._id)
			)
		};

		dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
		socket.emit('deleteComment', newPost);

		try {
			deleteArray.forEach((item) => {
				deleteDataAPI(`comment/${item._id}`, auth.token);
			});
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: error.response.data.msg }
			});
		}
	};
