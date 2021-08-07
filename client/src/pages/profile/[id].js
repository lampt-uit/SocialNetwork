import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Info from '../../components/profile/Info';
import Posts from '../../components/profile/Posts';
import LoadIcon from '../../images/loading.gif';
import { getProfileUsers } from '../../redux/actions/profile.action';

const Profile = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const { profile, auth } = useSelector((state) => state);

	useEffect(() => {
		//If have on Users =>  don't call API => catch from users
		if (profile.ids.every((item) => item !== id)) {
			dispatch(getProfileUsers({ id, auth }));
		}
	}, [id, auth, dispatch, profile.ids]);
	return (
		<div className='profile'>
			<Info auth={auth} profile={profile} dispatch={dispatch} id={id} />
			{profile.loading ? (
				<img src={LoadIcon} className='d-block mx-auto my-4' alt='loading' />
			) : (
				<Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
			)}
		</div>
	);
};

export default Profile;
