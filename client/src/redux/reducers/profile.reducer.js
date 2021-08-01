import { PROFILE_TYPES } from '../actions/profile.action';
import { EditData } from '../actions/global.type';

const initialState = {
	loading: false,
	users: [],
	posts: []
};

const profileReducer = (state = initialState, action) => {
	switch (action.type) {
		case PROFILE_TYPES.LOADING:
			return {
				...state,
				loading: action.payload
			};
		case PROFILE_TYPES.GET_USER:
			// console.log(action.payload);
			return {
				...state,
				users: [...state.users, action.payload.user]
			};
		case PROFILE_TYPES.FOLLOW:
			return {
				...state,
				//Find user on users ?
				//If have , replace = newUser ,or if haven't keep stable
				// users: state.users.map((user) =>
				// 	user._id === action.payload._id ? action.payload : user
				// )
				//Use EditData
				users: EditData(state.users, action.payload._id, action.payload)
			};
		case PROFILE_TYPES.UNFOLLOW:
			return {
				...state,
				// users: state.users.map((user) =>
				// 	user._id === action.payload._id ? action.payload : user
				// )
				users: EditData(state.users, action.payload._id, action.payload)
			};

		default:
			return state;
	}
};

export default profileReducer;
