import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Avatar from '../Avatar';
import { GLOBALTYPES } from '../../redux/actions/global.type';

const Status = () => {
	const { auth } = useSelector((state) => state);
	const dispatch = useDispatch();

	return (
		<div className='status my-3 d-flex'>
			<Avatar src={auth.user.avatar} size='big-avatar' />
			<button
				className='status-btn flex-fill'
				onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}
			>
				{auth.user.username}, what are you thinking?
			</button>
		</div>
	);
};

export default Status;
