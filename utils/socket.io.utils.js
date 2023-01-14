import { io } from 'socket.io-client';
// const ENDPOINT = "https://api.w4coder.com";
const ENDPOINT = "http://localhost:8088";

let socket;
export const initiateSocketConnection = (token) => {
    socket = io(ENDPOINT, {
		auth: {
			token
		},
    transports: [ "websocket" ]
	});
	console.log(`Connecting socket...`);
}
export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if(socket) socket.disconnect();
}

export const subscribeToChat = (cb) => {
  console.log("Heloooooo")
	socket.emit('my message', 'Hello there from React.');
  if (!socket) return(true);
  socket.on('my broadcast', msg => {
    console.log('Websocket event received!');
    return cb(null, msg);
  });
}

// Handle message receive event
export const subscribeToMessages = (cb) => {
  if (!socket) return(true);
  socket.on('message', msg => {
    console.log('Room event received!');
    return cb(null, msg);
  });
}

export const joinRoom = (user,cb) => {
	socket.emit('join', user);
  socket.on('init', msg => {
    console.log('Room event received!');
    return cb(null, msg);
  });
}

export const onNewUsers = (cb) => {
  if (!socket) return(true);
  socket.on('new_user', msg => {
    return cb(null, msg);
  });
}

export const sendMessage = ({message, roomName}, cb) => {
  if (socket) socket.emit('message', { message, roomName }, cb);
}