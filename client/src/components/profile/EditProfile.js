import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { GLOBALTYPES } from '../../redux/actions/global.type';
import { checkImage } from '../../utils/imageUpload';
import { updateProfileUser } from '../../redux/actions/profile.action';

const EditProfile = ({ setOnEdit }) => {
	const dispatch = useDispatch();

	const { auth, theme } = useSelector((state) => state);
	const initialState = {
		fullname: '',
		mobile: '',
		address: '',
		website: '',
		story: '',
		gender: ''
	};
	const [userData, setUserData] = useState(initialState);
	const { fullname, mobile, address, website, story, gender } = userData;
	const [avatar, setAvatar] = useState('');

	useEffect(() => {
		setUserData(auth.user);
	}, [auth.user]);

	const changeAvatar = (e) => {
		// console.log(e.target.files);
		const file = e.target.files[0];
		const error = checkImage(file);
		if (error)
			return dispatch({ type: GLOBALTYPES.ALERT, payload: { errors: error } });
		setAvatar(file);
	};
	const handleInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(updateProfileUser({ userData, avatar, auth }));
	};
	return (
		<div className='edit_profile'>
			<button
				className='btn btn-danger btn_close'
				onClick={() => setOnEdit(false)}
			>
				Close
			</button>
			<form onSubmit={handleSubmit}>
				<div className='info_avatar'>
					<img
						src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
						alt='avatar'
						style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
					/>
					<span>
						<i className='fas fa-camera'></i>
						<p>Change</p>
						<input
							type='file'
							name='file'
							id='file_up'
							accept='image/*'
							onChange={changeAvatar}
						/>
					</span>
				</div>
				<div className='form-group'>
					<label htmlFor='fullname'>Full Name</label>
					<div className='position-relative'>
						<input
							type='text'
							className='form-control'
							id='fullname'
							name='fullname'
							value={fullname}
							onChange={handleInput}
						/>
						<small
							className='text-danger position-absolute'
							style={{
								top: '50%',
								right: '5px',
								transform: 'translateY(-50%)',
								opacity: 0.5
							}}
						>
							{fullname.length}/25
						</small>
					</div>
				</div>
				<div className='form-group'>
					<label htmlFor='mobile'>Mobile</label>
					<input
						type='text'
						name='mobile'
						value={mobile}
						className='form-control'
						onChange={handleInput}
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='address'>Address</label>
					<input
						type='text'
						name='address'
						value={address}
						className='form-control'
						onChange={handleInput}
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='website'>Website</label>
					<input
						type='text'
						name='website'
						value={website}
						className='form-control'
						onChange={handleInput}
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='story'>Story</label>
					<textarea
						cols='30'
						style={{ resize: 'none' }}
						rows='4'
						name='story'
						value={story}
						className='form-control'
						onChange={handleInput}
					/>
					<small className='text-danger d-block text-right'>
						{story.length}/200
					</small>
				</div>
				<label htmlFor='gender'>Gender</label>
				<div className='input-group-prepend px-0 mb-4'>
					<select
						name='gender'
						id='gender'
						value={gender}
						className='custom-select text-capitalize'
						onChange={handleInput}
					>
						<option value='male'>Male</option>
						<option value='female'>Female</option>
						<option value='other'>Other</option>
					</select>
				</div>
				<button type='submit' className='btn btn-info w-100'>
					Save
				</button>
			</form>
		</div>
	);
};

export default EditProfile;
