import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import moveAudio from "../media/move-self.mp3"
import captureAudio from "../media/capture.mp3"
import { useLocation } from "react-router-dom";

import { Typography, List, ListItemText, Box, TextField } from "@mui/material";

import io from 'socket.io-client'
const socket = io.connect("http://localhost:3001")



const Board = () =>{
    const [chatLog, setChatLog] = useState([])
    const [game, setGame] = useState(new Chess());
    const [opponent, setOpponent] = useState("");
    const location = useLocation();
    let {roomName} = location.state;
    let {name} = location.state;
    const [color, setColor] = useState("Waiting for opponent...")
    const moveSound = new Audio(moveAudio);
    const captureSound = new Audio(captureAudio);

    const sendBoard = (data) =>{
        socket.emit("send_move", data)
    }

    const joinRoom = () =>{
        socket.emit("join_room", roomName)
        console.log(`Joining room ${roomName}`)
    }

    
    function makeAMove(move) {
        const gameCopy = new Chess();
        gameCopy.loadPgn(game.pgn());
        const result = gameCopy.move(move);
        setGame(gameCopy); 
        sendBoard(gameCopy.pgn())
        console.log(gameCopy.pgn())
        return result;
    }

    
    function onDrop(sourceSquare, targetSquare) {
        if(game.turn() == 'w' && `${color}` == "white" || game.turn() == 'b' && `${color}` == "black"){
            const res = makeAMove({
                from: sourceSquare,
                to: targetSquare,
            });
            if(res){
                if(res.captured){
                    captureSound.play()
                }
                else{
                    moveSound.play()
                }
            }
        }
    }

    function handleKeyDown(e){
        let s = e.target.value
        if (e.key === 'Enter' && s.length > 0) {
            s = `${name}: `+s
            setChatLog(chatLog =>[...chatLog, s])
            socket.emit("send_chat", {message: s, room: roomName})
        }
        
    }

    useEffect(()=>{
        socket.emit("set_nickname", name)
        joinRoom()
    }, [])
    

    useEffect(()=> {
        //console.log(1)
        if(game.isGameOver()){
            if(game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()){
                alert("Stalemate");
            } 
            if(game.turn() == "b"){
                alert("White won");
            }
            else if(game.turn() == "w"){
                alert("Black won");
            }
        }
    }, [ game ]);
    useEffect(()=>{
        socket.on("recieve_move", (data)=>{
            const gameCopy = new Chess();
            gameCopy.loadPgn(data);
            setGame(gameCopy)
            console.log("recieved")
        })
        socket.on("recieve_color", (col) =>{
            setColor(col)
            //console.log(col)
        })
        socket.on("get_opponent", (oppName) =>{
            setOpponent(oppName)
        })
        socket.on("recieve_chat", (s)=>{
            setChatLog(chatLog =>[...chatLog, s])
        })
    }, [socket])

    return (
    <>
        <Typography align="right" variant = "h4" marginRight={30}>Room: {roomName}</Typography>
        <div style = {{marginTop: '1vw', display: 'flex', flexDirection: 'row'}}>
            <div style = {{alignItems: 'center', marginLeft: '25%',justifyContent: 'center', width: '80vh'}}>
            <Typography variant = "h4">{opponent}</Typography>
            <Chessboard position={game.fen()} onPieceDrop={onDrop} id="BasicBoard" boardOrientation={color}/>
            <Typography variant = "h4">{name}</Typography>
            </div>
            <Box sx={{border: '1px solid grey', width: '20%', marginLeft: '5%', position: "relative", maxHeight: '70vh', marginTop: '5%'}}>
                <Typography variant = "h4" align="center">Chat</Typography>
            <List sx={{
                width: '90%',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: '55vh',
                marginLeft: '10%'
            }}>
                {chatLog.map((elem)=>(
                    <ListItemText primary = {`${elem}`}/>
                ))}

            </List>
                <TextField label="Say something..." variant="outlined" sx = {{marginLeft: '0%', position: "absolute", bottom: 0, width: '100%'}} onKeyDown = {handleKeyDown} />
            </Box>
            
        </div>
        
        
        
    </>
  );
}

export default Board;