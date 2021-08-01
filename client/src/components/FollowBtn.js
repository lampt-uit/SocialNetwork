import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { follow } from '../redux/actions/profile.action';

const FollowBtn = ({ user }) => {
	const [followed, setFollowed] = useState(false);
	const { auth, profile } = useSelector((state) => state);
	const dispatch = useDispatch();

	const handleFollow = () => {
		setFollowed(true);
	};

	const handleUnFollow = () => {
		setFollowed(false);
		dispatch(follow({ users: profile.users, user, auth }));
	};

	return (
		<>
			{followed ? (
				<button className='btn btn-outline-danger' onClick={handleUnFollow}>
					UnFollow
				</button>
			) : (
				<button className='btn btn-outline-info' onClick={handleFollow}>
					Follow
				</button>
			)}
		</>
	);
};

export default FollowBtn;
