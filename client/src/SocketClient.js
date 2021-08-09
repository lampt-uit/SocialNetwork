import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { GLOBALTYPES } from './redux/actions/global.type';
import { POST_TYPES } from './redux/actions/post.action';
import { NOTIFY_TYPES } from './redux/actions/notify.action';
import audioBell from './audio/got-it-done-613.mp3';

const spawnNotification = (body, icon, url, title) => {
	let options = {
		body,
		icon
	};

	let n = new Notification(title, options);

	n.onclick = (e) => {
		e.preventDefault();
		window.open(url, '_blank');
	};
};

const SocketClient = () => {
	const { auth, socket, notify } = useSelector((state) => state);
	const dispatch = useDispatch();
	const audioRef = useRef();

	//Join
	useEffect(() => {
		socket.emit('joinUser', auth.user._id);
	}, [socket, auth.user._id]);

	//Like
	useEffect(() => {
		socket.on('likeToClient', (newPost) => {
			// console.log(newPost);
			dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
		});

		return () => socket.off('likeToClient');
	}, [socket, dispatch]);

	//unLike
	useEffect(() => {
		socket.on('unLikePostToClient', (newPost) => {
			// console.log(newPost);
			dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
		});

		return () => socket.off('unLikePostToClient');
	}, [socket, dispatch]);

	//deleteComment
	useEffect(() => {
		socket.on('deleteCommentToClient', (newPost) => {
			// console.log(newPost);
			dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
		});

		return () => socket.off('deleteCommentToClient');
	}, [socket, dispatch]);

	//createComment
	useEffect(() => {
		socket.on('createCommentToClient', (newPost) => {
			// console.log(newPost);
			dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
		});

		return () => socket.off('createCommentToClient');
	}, [socket, dispatch]);

	//Follow
	useEffect(() => {
		socket.on('followToClient', (newUser) => {
			// console.log(newPost);
			dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
		});

		return () => socket.off('followToClient');
	}, [socket, dispatch, auth]);

	//unFollow
	useEffect(() => {
		socket.on('unFollowToClient', (newUser) => {
			// console.log(newPost);
			dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
		});

		return () => socket.off('unFollowToClient');
	}, [socket, dispatch, auth]);

	//Create Notify
	useEffect(() => {
		socket.on('createNotifyToClient', (msg) => {
			dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg });

			//Auto Play Audio when have notification come
			if (notify.sound) audioRef.current.play();

			//Notification on Device
			spawnNotification(
				msg.user.username + ' ' + msg.text,
				msg.user.avatar,
				msg.url,
				'Social Network'
			);
		});

		return () => socket.off('createNotifyToClient');
	}, [socket, dispatch, notify.sound]);

	//Remove Notify
	useEffect(() => {
		socket.on('removeNotifyToClient', (msg) => {
			dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg });
		});

		return () => socket.off('removeNotifyToClient');
	}, [socket, dispatch]);
	return (
		<>
			<audio controls ref={audioRef} style={{ display: 'none' }}>
				<source src={audioBell} type='audio/mp3' />
			</audio>
		</>
	);
};

export default SocketClient;
