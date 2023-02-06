import {Typography, TextField, Button, List, ListItem, Box } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from "react";





const Home = ({user, displayName, setInGame, socket}) =>{
    const [room, setRoom] = useState("");
    const [username, setUserName] = useState("")
    const [validRoom, setValidRoom] = useState(false)

    const navigate = useNavigate() //using this hook to navigate to other components going to be used for entering rooms
    
    
    function updateRoom(e){
        setRoom(e.target.value)
    }

    function updateName(e){
        setUserName(e.target.value)
    }
    
    function joinBtn(){
        socket.emit("check_room_size", room)
    }

    useEffect(()=>{
        setUserName(displayName)
    },[displayName])

    useEffect(()=>{
        setInGame(false)
    },[])

    useEffect(()=>{
        socket.on("valid_room", (valid)=>{
            setValidRoom(valid)
        })
    },[socket])

    useEffect(()=>{
        //navigate to room
        if(validRoom){
            navigate("/Board", {state: {roomName: room, name: username}})
        }   
    },[validRoom])

    
    
    if(user){
        return(
        <>
            <Typography variant = "h2" align = "center" marginTop={2}>Chess Rooms</Typography>
            <div>
            <List style={{marginTop: 120}}>
                <ListItem disablePadding style={{display: 'flex', justifyContent:'center'}}>
                <TextField id="outlined-basic" variant="outlined" disabled = {true} value = {user}/>
                </ListItem>
                <ListItem disablePadding style={{display: 'flex', justifyContent:'center', marginTop: 40}}>
                <TextField id="outlined-basic" label="Enter room name" variant="outlined" onChange={updateRoom}/>
                </ListItem>
            </List>
            </div>
            <div align = "center" style={{marginTop: 20}}>
                <Button variant="outlined" onClick={joinBtn}>Enter</Button>
            </div>
        </>
    )
    }
    else{
        return(
        <>
            <Typography variant = "h2" align = "center" marginTop={2}>Chess Rooms</Typography>
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
                <Button variant="outlined" onClick={joinBtn} >Enter</Button>
            </div>
        </>
    )
    }
    
    
}

export default Home;