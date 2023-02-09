import {Typography, TextField, Button, List, ListItem, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from "react";





const Home = ({user, displayName, setInGame, socket}) =>{
    //const [room, setRoom] = useState("");
    //const [username, setUserName] = useState("")
    const room = useRef("")
    const username = useRef("")
    //const [validRoom, setValidRoom] = useState(false)
    const [pop1, setPop1] = useState(false) //Popup open for full room
    const [openRooms, setOpenRooms] = useState({})

    const navigate = useNavigate() //using this hook to navigate to other components going to be used for entering rooms
    
    function handleClose(){
        setPop1(false)
    }
    
    function updateRoom(e){
        //setRoom(e.target.value)
        room.current = e.target.value
    }

    function updateName(e){
        //setUserName(e.target.value)
        username.current = e.target.value
    }
    
    function joinBtn(){
        socket.emit("check_room_size", room.current)
    }

    useEffect(()=>{
        //setUserName(displayName)
        username.current = displayName
    },[displayName])

    useEffect(()=>{
        setInGame(false)
    },[])

    useEffect(()=>{
        socket.on("valid_room", (valid)=>{
            if(valid){
                navigate("/Board", {state: {roomName: room.current, name: username.current}})
            }
            else{
                setPop1(true)
            }
        })
    },[socket])

    /*
    useEffect(()=>{
        //navigate to room
        if(validRoom){
            navigate("/Board", {state: {roomName: room, name: username}})
        }   
    },[validRoom])*/

    
    
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
            <Dialog
            open = {pop1}
                >
                    <DialogTitle id="responsive-dialog-title" textAlign={"center"}>
                    {"Room is full"}
                    </DialogTitle>
                    <DialogActions style={{justifyContent: "center"}}>
                    <Button onClick={handleClose}>
                        Ok
                    </Button>
                    </DialogActions>
                </Dialog>
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
            <Dialog
            open = {pop1}
                >
                    <DialogTitle id="responsive-dialog-title" textAlign={"center"}>
                    {"Room is full"}
                    </DialogTitle>
                    <DialogActions style={{justifyContent: "center"}}>
                    <Button onClick={handleClose}>
                        Ok
                    </Button>
                    </DialogActions>
                </Dialog>
        </>
    )
    }
    
    
}

export default Home;