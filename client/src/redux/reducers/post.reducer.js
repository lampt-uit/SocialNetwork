import { POST_TYPES } from '../actions/post.action';

const initialState = {
	posts: []
};

const postReducer = (state = initialState, action) => {
	switch (action.type) {
		case POST_TYPES.CREATE_POST:
			// console.log(action.payload);
			return {
				...state,
				posts: [...state.posts, action.payload]
			};
		default:
			return state;
	}
};

export default postReducer;
