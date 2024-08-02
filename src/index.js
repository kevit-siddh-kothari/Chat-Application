const express = require('express');
const http = require('http');
const path = require('path');
const scoketio = require('socket.io');
const {generateMessages, generateLocation} = require('./utils/messages');
const {removeUser,getUser,getUsersInRoom,addUser} = require('./utils/user');
const {router} = require('./routers/view-router');
const filter = require('bad-words');
const { create } = require('domain');

const app = express();

const server = http.createServer(app);
const io = scoketio(server);

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));


io.on('connection',(socket)=>{
    console.log(`New WebSocket connection`);

    // to notify whenever a new user is connected in our live application
    // socket.broadcast.emit('message', generateMessages('A new User connected!'));

    // socket.emit('message',generateMessages('Welcome!'));

    socket.on('message',(message,callback)=>{  
        const user = getUser(socket.id);
        const check = new filter();
        if(check.isProfane(message)){
            return callback('Profanity is not allowed!');
        }
        io.to(user.room).emit('message',generateMessages(message));
        callback(`Delivered!`);
    });

    //location
    socket.on('location', (a,b)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocation(`https://google.com/maps?q=${a},${b}`));
    });

    //built in event
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('message', generateMessages(`${user.username} got disconnected from ${user.room}`));
        }
    });

    //joinning room
    socket.on('join', ({username, room},callback)=>{

        const{error,user} = addUser({id:socket.id, username, room});
        // console.log(user.room);
        if(error) {
          return callback(error);
        }
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('message', generateMessages(`${user.username} has joined`));
        socket.emit('message',generateMessages('Welcome!'));
        callback();
    })
   
});
const viewPath = path.join(__dirname,'views');
app.set('view engine', 'ejs');
app.set('views', viewPath);

app.use('/api/',router);

const port = 3000;
server.listen(port,()=>console.log(`App listening on port ${port}`));



