import { combineReducers } from 'redux';

import auth from './auth.reducer';
import notify from './notify.reducer';

export default combineReducers({ auth, notify });
