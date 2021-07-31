import React from 'react';
import { useSelector } from 'react-redux';

import Info from '../../components/profile/Info';
import Posts from '../../components/profile/Posts';
import LoadIcon from '../../images/loading.gif';

const Profile = () => {
	const { profile } = useSelector((state) => state);
	return (
		<div className='profile'>
			{profile.loading ? <img src={LoadIcon} alt='loading' /> : <Info />}
			<Posts />
		</div>
	);
};

export default Profile;
