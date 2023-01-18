

const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
app.use(cors())
const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})


io.on("connection", (socket)=>{
    //socket.join("test");
    //console.log(socket.id)
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
            
            //CHange this later to be desired color
            io.to(clientsArray[0]).emit("recieve_color", "white")
            let nick = io.sockets.sockets.get(clientsArray[1]).nickmame;
            io.to(clientsArray[0]).emit("get_opponent", nick)
            

            io.to(clientsArray[1]).emit("recieve_color", "black")
            nick = io.sockets.sockets.get(clientsArray[0]).nickmame;
            io.to(clientsArray[1]).emit("get_opponent", nick)
        }
    })
    
    socket.on("send_move", (data)=>{//change this to specify room later
        //console.log(data)
        socket.broadcast.emit("recieve_move", data)
    })
    socket.on("disconnect", () => {
        //console.log(socket.id);    
    });
    socket.on("set_nickname", (myName) =>{
        socket.nickmame = myName
    })
    socket.on("send_chat", (data)=>{
        console.log(data)
        socket.to(data.room).emit("recieve_chat", data.message)
    })
})




server.listen(3001, () =>{
    console.log("Server is running")
})