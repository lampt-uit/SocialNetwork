let users = [];

const SocketServer = (socket) => {
	//Connect - Disconnect
	socket.on('joinUser', (id) => {
		users.push({ id, socketId: socket.id });
		// console.log(users);
	});
	socket.on('disconnect', () => {
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
};

module.exports = SocketServer;
