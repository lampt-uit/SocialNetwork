import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Info from '../../components/profile/Info';
import Posts from '../../components/profile/Posts';
import LoadIcon from '../../images/loading.gif';
import { getProfileUsers } from '../../redux/actions/profile.action';
import Saved from '../../components/profile/Saved';

const Profile = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const { profile, auth } = useSelector((state) => state);
	const [saveTab, setSaveTab] = useState(false);

	useEffect(() => {
		//If have on Users =>  don't call API => catch from users
		if (profile.ids.every((item) => item !== id)) {
			dispatch(getProfileUsers({ id, auth }));
		}
	}, [id, auth, dispatch, profile.ids]);
	return (
		<div className='profile'>
			<Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

			{auth.user._id === id && (
				<div className='profile_tab'>
					<button
						className={saveTab ? '' : 'active'}
						onClick={() => setSaveTab(false)}
					>
						Posts
					</button>
					<button
						className={saveTab ? 'active' : ''}
						onClick={() => setSaveTab(true)}
					>
						Saved
					</button>
				</div>
			)}

			{profile.loading ? (
				<img src={LoadIcon} className='d-block mx-auto my-4' alt='loading' />
			) : (
				<>
					{saveTab ? (
						<Saved auth={auth} dispatch={dispatch} />
					) : (
						<Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
					)}
				</>
			)}
		</div>
	);
};

export default Profile;
