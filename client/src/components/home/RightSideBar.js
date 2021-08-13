import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import UserCard from '../UserCard';
import FollowBtn from '../FollowBtn';
import LoadIcon from '../../images/loading.gif';
import { getSuggestions } from '../../redux/actions/suggestion.action';

const RightSideBar = () => {
	const { auth, suggestions } = useSelector((state) => state);
	const dispatch = useDispatch();

	return (
		<div className='mt-4'>
			<UserCard user={auth.user} />
			<div className='d-flex justify-content-between align-items-center my-2'>
				<h5 className='text-danger'>Suggestions for you</h5>
				{/* loading=false => display redo */}
				{!suggestions.loading && (
					<i
						className='fas fa-redo'
						style={{ cursor: 'pointer' }}
						onClick={() => dispatch(getSuggestions(auth.token))}
					/>
				)}
			</div>

			{suggestions.loading ? (
				<img src={LoadIcon} alt='loading' className='d-block mx-auto my-4' />
			) : (
				<div className='suggestions'>
					{suggestions.users.map((user) => (
						<UserCard key={user._id} user={user}>
							<FollowBtn user={user} />
						</UserCard>
					))}
				</div>
			)}

			<div style={{ opacity: 0.5 }}>
				<a
					href='https://www.facebook.com/tanlam.pham.92/'
					target='_blank'
					rel='noreferrer'
					style={{ wordBreak: 'break-all' }}
				>
					https://www.facebook.com/tanlam.pham.92/
				</a>
				<small className='d-block text-center'>
					Welcome to my profile on Facebook.
				</small>
				<small className='d-block text-center'>&copy; 2021</small>
			</div>
		</div>
	);
};

export default RightSideBar;
