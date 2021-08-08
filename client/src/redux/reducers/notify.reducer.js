import { NOTIFY_TYPES } from '../actions/notify.action';

const initialState = {
	loading: false,
	data: [],
	sound: false
};

const notifyReducer = (state = initialState, action) => {
	switch (action.type) {
		case NOTIFY_TYPES.GET_NOTIFIES:
			return {
				...state,
				data: action.payload
			};
		default:
			return state;
	}
};

export default notifyReducer;
