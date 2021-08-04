import { combineReducers } from 'redux';

import auth from './auth.reducer';
import alert from './alert.reducer';
import theme from './theme.reducer';
import profile from './profile.reducer';
import status from './status.reducer';
import homePosts from './post.reducer';

export default combineReducers({
	auth,
	alert,
	theme,
	profile,
	status,
	homePosts
});
