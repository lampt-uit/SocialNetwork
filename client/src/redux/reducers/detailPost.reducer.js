import { POST_TYPES } from '../actions/post.action';
import { EditData } from '../actions/global.type';

const detailPostReducer = (state = [], action) => {
	switch (action.type) {
		case POST_TYPES.GET_POST:
			return [...state, action.payload];
		case POST_TYPES.UPDATE_POST:
			return EditData(state, action.payload._id, action.payload);
		default:
			return state;
	}
};

export default detailPostReducer;
