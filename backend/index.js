

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
    socket.join("test");
    if(io.sockets.adapter.rooms.get("test") && io.sockets.adapter.rooms.get("test").size == 2){
        const clientsArray = Array.from(io.sockets.adapter.rooms.get('test'));
        /*
        for (let clientID of clients ) {
            console.log(clientID)
            io.to(clientID).emit("recieve_color", `${clientID}`)
        }*/
        //CHange this later to be desired color
        io.to(clientsArray[0]).emit("recieve_color", "White")
        io.to(clientsArray[1]).emit("recieve_color", "Black")
    }
    socket.on("send_move", (data)=>{//change this to specify room later
        //console.log(data)
        socket.broadcast.emit("recieve_move", data)
    })
    socket.on("disconnect", () => {
        console.log(socket.id); // undefined    
    });

})




server.listen(3001, () =>{
    console.log("Server is running")
})