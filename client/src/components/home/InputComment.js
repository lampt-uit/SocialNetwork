import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { createComment } from '../../redux/actions/comment.action';

const InputComment = ({ children, post, onReply, setOnReply }) => {
	const { auth } = useSelector((state) => state);
	const dispatch = useDispatch();

	const [content, setContent] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		//Does not exist  =>  don't something
		if (!content.trim()) {
			if (setOnReply) return setOnReply(false);
			return;
		}

		setContent('');

		const newComment = {
			content,
			likes: [],
			user: auth.user,
			createdAt: new Date().toISOString(),
			reply: onReply && onReply.commentId,
			tag: onReply && onReply.user
		};
		// console.log(newComment);

		dispatch(createComment({ post, newComment, auth }));

		if (setOnReply) return setOnReply(false);
	};
	return (
		<form className='card-footer comment_input' onSubmit={handleSubmit}>
			{children}
			<input
				type='text'
				name='content'
				placeholder='Add your comments...'
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<button type='submit' className='postBtn ml-2'>
				Post
			</button>
		</form>
	);
};

export default InputComment;
