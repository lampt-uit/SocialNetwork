let users = [];

const SocketServer = (socket) => {
	//Connect - Disconnect
	socket.on('joinUser', (user) => {
		users.push({
			id: user._id,
			socketId: socket.id,
			followers: user.followers
		});
		// console.log(users);
	});
	socket.on('disconnect', () => {
		const data = users.find((user) => user.socketId === socket.id);

		if (data) {
			const clients = users.filter((user) =>
				data.followers.find((item) => item._id === user.id)
			);
			if (clients.length > 0) {
				clients.forEach((client) => {
					socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id);
				});
			}
		}
		users = users.filter((user) => user.socketId !== socket.id);
	});

	//Like Post
	socket.on('likePost', (newPost) => {
		// console.log(newPost);
		//Check user followers is listening +  listen activity of user =>  send to post yourself
		const ids = [...newPost.user.followers, newPost.user._id];
		const clients = users.filter((user) => ids.includes(user.id));
		// console.log(clients);
		if (clients.length > 0) {
			clients.forEach((client) => {
				socket.to(`${client.socketId}`).emit('likeToClient', newPost);
			});
		}
	});

	//UnLike Post
	socket.on('unLikePost', (newPost) => {
		// console.log(newPost);
		//Check user followers is listening +  listen activity of user =>  send to post yourself
		const ids = [...newPost.user.followers, newPost.user._id];
		const clients = users.filter((user) => ids.includes(user.id));
		// console.log(clients);
		if (clients.length > 0) {
			clients.forEach((client) => {
				socket.to(`${client.socketId}`).emit('unLikePostToClient', newPost);
			});
		}
	});

	//Create Comment
	socket.on('createComment', (newPost) => {
		// console.log(newPost);
		//Check user followers is listening +  listen activity of user =>  send to post yourself
		const ids = [...newPost.user.followers, newPost.user._id];
		const clients = users.filter((user) => ids.includes(user.id));
		// console.log(clients);
		if (clients.length > 0) {
			clients.forEach((client) => {
				socket.to(`${client.socketId}`).emit('createCommentToClient', newPost);
			});
		}
	});

	//Delete Comment
	socket.on('deleteComment', (newPost) => {
		// console.log(newPost);
		//Check user followers is listening +  listen activity of user =>  send to post yourself
		const ids = [...newPost.user.followers, newPost.user._id];
		const clients = users.filter((user) => ids.includes(user.id));
		// console.log(clients);
		if (clients.length > 0) {
			clients.forEach((client) => {
				socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost);
			});
		}
	});

	//Follow
	socket.on('follow', (newUser) => {
		// console.log(newUser);
		const user = users.find((user) => user.id === newUser._id);
		user && socket.to(`${user.socketId}`).emit('followToClient', newUser);
	});

	//unFollow
	socket.on('unFollow', (newUser) => {
		// console.log(newUser);
		const user = users.find((user) => user.id === newUser._id);
		user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser);
	});

	//Create Notify
	socket.on('createNotify', (msg) => {
		// console.log(msg);
		const clients = users.filter((user) => msg.recipients.includes(user.id));

		if (clients.length > 0) {
			clients.forEach((client) => {
				socket.to(`${client.socketId}`).emit('createNotifyToClient', msg);
			});
		}
	});

	//Remove Notify
	socket.on('removeNotify', (msg) => {
		const clients = users.filter((user) => msg.recipients.includes(user.id));
		if (clients.length > 0) {
			clients.forEach((client) => {
				socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg);
			});
		}
	});

	//Add Message
	socket.on('addMessage', (msg) => {
		// console.log(msg);
		// Check recipient online for realtime
		const user = users.find((user) => user.id === msg.recipient);
		user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg);
	});

	//Check online / offline
	socket.on('checkUserOnline', (data) => {
		//Check user following online => have [users]
		const following = users.filter((user) =>
			data.following.find((item) => item._id === user.id)
		);
		// console.log(following);
		socket.emit('checkUserOnlineToMe', following);

		const clients = users.filter((user) =>
			data.followers.find((item) => item._id === user.id)
		);

		if (clients.length > 0) {
			clients.forEach((client) => {
				socket
					.to(`${client.socketId}`)
					.emit('checkUserOnlineToClient', data._id);
			});
		}
	});
};

module.exports = SocketServer;
