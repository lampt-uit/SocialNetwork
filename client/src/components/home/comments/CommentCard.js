import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import Avatar from '../../Avatar';
import LikeButton from '../../LikeButton';
import CommentMenu from './CommentMenu';
import InputComment from '../InputComment';
import {
	updateComment,
	likeComment,
	unLikeComment
} from '../../../redux/actions/comment.action';

const CommentCard = ({ children, comment, post, commentId }) => {
	const { auth } = useSelector((state) => state);
	const [content, setContent] = useState('');
	const [readMore, setReadMore] = useState(false);
	const [isLike, setIsLike] = useState(false);
	const [onEdit, setOnEdit] = useState(false);
	const [onReply, setOnReply] = useState(false);

	//Use to avoid spammer
	const [loadLike, setLoadLike] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		setContent(comment.content);
		setIsLike(false);
		setOnReply(false);

		//Check like comment of auth
		if (comment.likes.find((like) => like._id === auth.user._id))
			setIsLike(true);
	}, [comment, auth.user._id]);

	const handleLike = async () => {
		if (loadLike) return;
		setIsLike(true);

		setLoadLike(true);
		await dispatch(likeComment({ comment, post, auth }));
		setLoadLike(false);
	};

	const handleUnLike = async () => {
		if (loadLike) return;
		setIsLike(false);

		setLoadLike(true);
		await dispatch(unLikeComment({ comment, post, auth }));
		setLoadLike(false);
	};

	const handleUpdate = () => {
		if (comment.content !== content) {
			dispatch(updateComment({ comment, post, content, auth }));
			setOnEdit(false);
		} else {
			setOnEdit(false);
		}
	};

	const handleReply = () => {
		if (onReply) return setOnReply(false);
		setOnReply({ ...comment, commentId });
	};

	const styleCard = {
		opacity: comment._id ? 1 : 0.5,
		pointerEvents: comment._id ? 'inherit' : 'none'
	};
	return (
		<div className='comment_card mt-2' style={styleCard}>
			<Link to={`/profile/${comment.user._id}`} className='d-flex text-dark'>
				<Avatar src={comment.user.avatar} size='small-avatar' />
				<h6 className='mx-1'>{comment.user.username}</h6>
			</Link>

			<div className='comment_content'>
				<div className='flex-fill'>
					{onEdit ? (
						<textarea
							rows='5'
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
					) : (
						<div>
							{comment.tag && comment.tag._id !== comment.user._id && (
								<Link to={`/profile/${comment.tag._id}`} className='ml-1'>
									@{comment.tag.username}
								</Link>
							)}
							<span>
								{content.length < 100
									? content
									: readMore
									? content + ' '
									: content.slice(0, 100) + '...'}
							</span>
							{content.length > 100 && (
								<span
									className='readMore'
									onClick={() => setReadMore(!readMore)}
								>
									{readMore ? 'Hide content' : 'Read more'}
								</span>
							)}
						</div>
					)}
					<div style={{ cursor: 'pointer' }}>
						<small className='text-muted mr-3'>
							{moment(comment.createdAt).fromNow()}
						</small>
						<small className='font-weight-bold mr-3'>
							{comment.likes.length} likes
						</small>
						{onEdit ? (
							<>
								<small className='font-weight-bold mr-3' onClick={handleUpdate}>
									Update
								</small>
								<small
									className='font-weight-bold mr-3'
									onClick={() => setOnEdit(false)}
								>
									Cancel
								</small>
							</>
						) : (
							<small className='font-weight-bold mr-3' onClick={handleReply}>
								{onReply ? 'Cancel' : 'Reply'}
							</small>
						)}
					</div>
				</div>
				<div
					className='d-flex align-items-center mx-2'
					style={{ cursor: 'pointer' }}
				>
					<CommentMenu comment={comment} post={post} setOnEdit={setOnEdit} />
					<LikeButton
						isLike={isLike}
						handleLike={handleLike}
						handleUnLike={handleUnLike}
					/>
				</div>
			</div>

			{onReply && (
				<InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
					<Link to={`/profile/${onReply.user._id}`} className='mr-1'>
						@{onReply.user.username}:
					</Link>
				</InputComment>
			)}
			{children}
		</div>
	);
};

export default CommentCard;
