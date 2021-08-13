require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const { ExpressPeerServer } = require('peer');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Socket IO
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
	SocketServer(socket);
});

// Create Peer Server
ExpressPeerServer(http, { path: '/' });

//Routes
app.use('/api', require('./routes/auth.router'));
app.use('/api', require('./routes/user.router'));
app.use('/api', require('./routes/post.router'));
app.use('/api', require('./routes/comment.router'));
app.use('/api', require('./routes/notify.router'));
app.use('/api', require('./routes/message.router'));

const URI = process.env.MONGODB_URL;
mongoose.connect(
	URI,
	{
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
		if (err) throw err;
		console.log('Connect to MongoDB successful');
	}
);

const port = process.env.PORT || 5000;
http.listen(port, () => {
	console.log(`Server is running on port : ${port}`);
});
