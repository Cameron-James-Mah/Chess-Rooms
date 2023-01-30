const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
app.use(cors())
//const server = http.createServer(app)

const mongoose = require("mongoose")
const UserModel = require("./models/Users")

app.use(express.json())

const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGODB_CHESSROOMS_URI)

const server = app.listen(3001, () =>{
    console.log("Server is running")
})

//Test request
app.get("/getUsers", (req, res) =>{
    UserModel.find({}, (err, result) =>{
        if(err){
            res.json(err)
        }
        else{
            res.json(result)
        }
    })
})

app.post("/getUserGames", async (req, res)=>{
    const temp = await UserModel.findOne({ Username: req.body.Username });
    if(temp){
        res.json(temp.Games)
    }
    else{
        res.json(null)
    }
})

//Validate login
app.post("/loginUser", async (req, res)=>{
    const temp = await UserModel.findOne({ Username: req.body.Username });
    if(temp && temp.Password == req.body.Password){
        res.json(temp)
    }
    else{
        res.json(temp)
    }

})

//Create a new user account
app.post("/createUser", async (req, res)=>{
    const temp = await UserModel.findOne({ Username: req.body.Username });
    if(!temp){
        const user = req.body
        const newUser = new UserModel(user)
        await newUser.save()
        res.json(user)
    }
    else{
        res.json(null)
    } 
})

//Add completed game to database
app.post("/saveGame", async (req, res)=>{
    const temp = await UserModel.findOne({ Username: req.body.Username });//Get my database entry by username
    if(temp){
        console.log("Adding game: " + req.body.PGN)
        temp.Games.push(req.body.PGN)
        await temp.save()
    }
    else{
        console.log("Could not find user to add game to")
    }
})




const io = new Server(server, {
    cors:{
        origin: ["https://chess-rooms.onrender.com", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
})




//Socket io, handles communication between boards
io.on("connection", (socket)=>{
    //socket.join("test");
    console.log(`User Connected: ${socket.id}`)
    io.to(socket.id).emit("check_reconnect") //If someone disconnects from socket and reconnects while in room
    //check to make sure size is not greater than 2
    socket.on("join_room", (roomName)=>{
        socket.join(roomName)
        console.log(`User Connected: ${socket.id} connected to room: ${roomName}`)
        if(io.sockets.adapter.rooms.get(roomName) && io.sockets.adapter.rooms.get(roomName).size == 2){
            console.log(`Starting game in room: ${roomName}`)
            const clientsArray = Array.from(io.sockets.adapter.rooms.get(roomName)); //Array of socket ids in this room
            /*
            for (let clientID of clients ) {
                console.log(clientID)
                io.to(clientID).emit("recieve_color", `${clientID}`)
            }*/
            //112697
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




