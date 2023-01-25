const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
app.use(cors())
const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: ["https://chess-rooms.onrender.com", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
})


io.on("connection", (socket)=>{
    //socket.join("test");
    console.log(`User Connected: ${socket.id}`)
    io.to(socket.id).emit("check_reconnect")
    //check to make sure size is not greater than 2
    socket.on("join_room", (roomName)=>{
        socket.join(roomName)
        if(io.sockets.adapter.rooms.get(roomName) && io.sockets.adapter.rooms.get(roomName).size == 2){
            console.log("Starting game...")
            const clientsArray = Array.from(io.sockets.adapter.rooms.get(roomName)); //Array of socket ids in this room
            /*
            for (let clientID of clients ) {
                console.log(clientID)
                io.to(clientID).emit("recieve_color", `${clientID}`)
            }*/
            //11 26 97
            //CHange this later to be desired color
            io.to(clientsArray[0]).emit("receive_color", "white")
            let nick = io.sockets.sockets.get(clientsArray[1]).nickmame;
            io.to(clientsArray[0]).emit("get_opponent", nick)
            

            io.to(clientsArray[1]).emit("receive_color", "black")
            nick = io.sockets.sockets.get(clientsArray[0]).nickmame;
            io.to(clientsArray[1]).emit("get_opponent", nick)
        }
    })
    
    socket.on("send_move", (data)=>{//change this to specify room later
        //console.log(data)
        socket.broadcast.emit("receive_move", data)
    })
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);    
    });
    socket.on("set_nickname", (myName) =>{
        socket.nickmame = myName
    })
    socket.on("send_chat", (data)=>{
        //console.log(data)
        socket.to(data.room).emit("receive_chat", data.message)
    })
    socket.on("send_time", (data)=>{
        socket.to(data.room).emit("receive_time", data.time)
    })
    socket.on("no_time", (data)=>{
        socket.to(data.room).emit("win_game", data.col)
    })
    socket.on("sfx_move", (room)=>{
        socket.to(room).emit("sfx_move")
    })
    socket.on("sfx_capture", (room)=>{
        socket.to(room).emit("sfx_capture")
    })
    socket.on("reconnect_room", (room)=>{
        console.log(`Reconnecting to room : ${room}`)
        socket.join(room)
    })
})




server.listen(3001, () =>{
    console.log("Server is running")
})