import {Typography, TextField, Button, List, ListItem} from "@mui/material";
import { Link } from 'react-router-dom'
import { useState } from "react";


import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001")

const Home = () =>{
    const [room, setRoom] = useState("");
    const [username, setUserName] = useState("")
    function updateRoom(e){
        setRoom(e.target.value)
    }

    function updateName(e){
        setUserName(e.target.value)
    }
    
    
    return(
        <>
            <Typography variant = "h2" align = "center">Chess Rooms</Typography>
            <div>
            <List style={{marginTop: 120}}>
                <ListItem disablePadding style={{display: 'flex', justifyContent:'center'}}>
                <TextField id="outlined-basic" label="Enter display name" variant="outlined" onChange={updateName}/>
                </ListItem>
                <ListItem disablePadding style={{display: 'flex', justifyContent:'center', marginTop: 40}}>
                <TextField id="outlined-basic" label="Enter room name" variant="outlined" onChange={updateRoom}/>
                </ListItem>
            </List>
            </div>
            <div align = "center" style={{marginTop: 20}}>
                <Button component = {Link} to = "/Board" state = {{roomName: room, name: username}} variant="outlined">Enter</Button>
            </div>
        </>
    )
    
}

export default Home;