import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

import PageRender from './customRouter/PageRender';
import PrivateRouter from './customRouter/PrivateRouter';

import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Alert from './components/alert/Alert';
import Header from './components/header/Header';
import StatusModal from './components/StatusModal';
import CallModal from './components/message/CallModal';

import { refreshToken } from './redux/actions/auth.action';
import { getPosts } from './redux/actions/post.action';
import { getSuggestions } from './redux/actions/suggestion.action';
import { GLOBALTYPES } from './redux/actions/global.type';
import SocketClient from './SocketClient';
import { getNotifies } from './redux/actions/notify.action';

function App() {
	const { auth, status, modal, call } = useSelector((state) => state);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(refreshToken());
		//Create socket
		const socket = io();
		dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });

		// clean useEffect
		return () => socket.close();
	}, [dispatch]);

	useEffect(() => {
		if (auth.token) {
			dispatch(getPosts(auth.token));
			dispatch(getSuggestions(auth.token));
			dispatch(getNotifies(auth.token));
		}
	}, [dispatch, auth.token]);

	useEffect(() => {
		// Let's check if the browser supports notifications
		if (!('Notification' in window)) {
			alert('This browser does not support desktop notification');
		}
		// Let's check whether notification permissions have already been granted
		else if (Notification.permission === 'granted') {
			// If it's okay let's create a notification
		}
		// Otherwise, we need to ask the user for permission
		else if (Notification.permission !== 'denied') {
			Notification.requestPermission().then(function (permission) {
				// If the user accepts, let's create a notification
				if (permission === 'granted') {
				}
			});
		}
		// At last, if the user has denied notifications, and you
		// want to be respectful there is no need to bother them any more.
	}, []);

	useEffect(() => {
		const newPeer = new Peer(undefined, {
			path: '/',
			secure: true
		});
		dispatch({ type: GLOBALTYPES.PEER, payload: newPeer });
	}, [dispatch]);

	return (
		<Router>
			<Alert />
			<input type='checkbox' id='theme' />

			<div className={`App ${(status || modal) && 'mode'}`}>
				<div className='main'>
					{auth.token && <Header />}
					{status && <StatusModal />}
					{auth.token && <SocketClient />}
					{call && <CallModal />}

					<Route exact path='/' component={auth.token ? Home : Login} />
					<Route exact path='/register' component={Register} />

					<PrivateRouter exact path='/:page' component={PageRender} />
					<PrivateRouter exact path='/:page/:id' component={PageRender} />
				</div>
			</div>
		</Router>
	);
}

export default App;
