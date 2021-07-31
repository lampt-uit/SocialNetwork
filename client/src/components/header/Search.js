import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/global.type';
import UserCard from '../UserCard';

const Search = () => {
	const [search, setSearch] = useState('');
	const [users, setUsers] = useState([]);

	const { auth } = useSelector((state) => state);
	const dispatch = useDispatch();

	const handleClose = () => {
		setSearch('');
		setUsers([]);
	};

	useEffect(() => {
		if (search) {
			getDataAPI(`search?username=${search}`, auth.token)
				.then((res) => setUsers(res.data.users))
				.catch((error) => {
					dispatch({
						type: GLOBALTYPES.ALERT,
						payload: { errors: error.response.data.msg }
					});
				});
		} else {
			setUsers([]);
		}
	}, [search, auth.token, dispatch]);

	return (
		<form className='search_form'>
			<input
				type='text'
				name='search'
				value={search}
				onChange={(e) =>
					setSearch(e.target.value.toLowerCase().replace(/ /g, ''))
				}
				id='search'
			/>
			<div className='search_icon' style={{ opacity: search ? 0 : 0.3 }}>
				<span className='material-icons'>search</span>
				<span>Search</span>
			</div>
			<div
				className='close_search'
				style={{ opacity: users.length === 0 ? 0 : 1 }}
				onClick={handleClose}
			>
				&times;
			</div>

			<div className='users'>
				{search &&
					users.map((user) => (
						<Link
							key={user._id}
							to={`/profile/${user._id}`}
							onClick={handleClose}
						>
							<UserCard user={user} border='border' />
						</Link>
					))}
			</div>
		</form>
	);
};

export default Search;
