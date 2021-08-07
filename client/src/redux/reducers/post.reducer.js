import { POST_TYPES } from '../actions/post.action';
import { EditData } from '../actions/global.type';

const initialState = {
	loading: false,
	posts: [],
	result: 0,
	page: 2
};

const postReducer = (state = initialState, action) => {
	switch (action.type) {
		case POST_TYPES.CREATE_POST:
			// console.log(action.payload);
			return {
				...state,
				posts: [action.payload, ...state.posts]
			};
		case POST_TYPES.LOADING_POST:
			return {
				...state,
				loading: action.payload
			};
		case POST_TYPES.GET_POSTS:
			// console.log(action.payload);
			return {
				...state,
				posts: action.payload.posts,
				result: action.payload.result,
				page: action.payload.page
			};
		case POST_TYPES.UPDATE_POST:
			return {
				...state,
				posts: EditData(state.posts, action.payload._id, action.payload)
			};
		default:
			return state;
	}
};

export default postReducer;
