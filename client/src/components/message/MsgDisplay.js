import React from 'react';
import Avatar from '../Avatar';

const MsgDisplay = ({ user }) => {
	return (
		<>
			<div className='chat_title'>
				<Avatar src={user.avatar} size='small-avatar' />
				<span>{user.username}</span>
			</div>

			<div className='chat_text'>
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book Lorem Ipsum is simply dummy
				text of the printing and typesetting industry. Lorem Ipsum has been the
				industry's standard dummy text ever since the 1500s, when an unknown
				printer took a galley of type and scrambled it to make a type specimen
				book
			</div>

			<div className='chat_time'>August 2021</div>
		</>
	);
};

export default MsgDisplay;
