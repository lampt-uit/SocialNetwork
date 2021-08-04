import React from 'react';
import { useSelector } from 'react-redux';

const LikeButton = ({ isLike, handleLike, handleUnLike }) => {
	const { theme } = useSelector((state) => state);
	return (
		<>
			{isLike ? (
				<i
					className='fas fa-heart text-danger'
					style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
					onClick={handleUnLike}
				/>
			) : (
				<i className='far fa-heart' onClick={handleLike} />
			)}
		</>
	);
};

export default LikeButton;
