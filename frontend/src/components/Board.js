import { Chessboard } from "react-chessboard";
import { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import moveAudio from "../media/move-self.mp3"
import captureAudio from "../media/capture.mp3"
import { useLocation } from "react-router-dom";

import { Typography, List, ListItemText, Box, TextField } from "@mui/material";

import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001")
//const socket = io.connect("https://chess-rooms-app.onrender.com")



const Board = () =>{
    const [chatLog, setChatLog] = useState([])
    const [game, setGame] = useState(new Chess());
    const turn = useRef(false)
    const [opponent, setOpponent] = useState("");
    const location = useLocation();
    let {roomName} = location.state;
    let {name} = location.state;
    const color = useRef("")
    const moveSound = new Audio(moveAudio);
    const captureSound = new Audio(captureAudio);
    const [mySeconds, setMySeconds] = useState(10)
    const [myTime, setMyTime] = useState("")
    const [oppTime, setOppTime] = useState("10:00")
    const wonOnTime = useRef(false)

    const sendBoard = (data) =>{ //Called everytime I make a valid move, I would like to just send the new move in the future 
        socket.emit("send_move", data)
    }

    const joinRoom = () =>{ //Called immediately on render
        socket.emit("join_room", roomName)
        console.log(`Joining room ${roomName}`)
    }

    
    function makeAMove(move) { //Kind of hacky function validating move/updating board
        const gameCopy = new Chess();
        gameCopy.loadPgn(game.pgn());
        const result = gameCopy.move(move);
        setGame(gameCopy); 
        sendBoard(gameCopy.pgn())
        console.log(gameCopy.pgn())
        return result;
    }

    
    function onDrop(sourceSquare, targetSquare) {//When moving a piece on the board
        if(game.turn() == 'w' && `${color.current}` == "white" || game.turn() == 'b' && `${color.current}` == "black"){
            const res = makeAMove({
                from: sourceSquare,
                to: targetSquare,
            });
            if(res){
                turn.current = false
                console.log(turn.current)
                if(res.captured){
                    captureSound.play()
                }
                else{
                    moveSound.play()
                }
            }
        }
    }

    function handleKeyDown(e){ //For chat 
        let s = e.target.value
        if (e.key === 'Enter' && s.length > 0) { //Make sure valid message
            s = `${name}: `+s
            setChatLog(chatLog =>[...chatLog, s])
            socket.emit("send_chat", {message: s, room: roomName})
        }
        
    }

    useEffect(()=>{//Updating time
        const interval = setInterval(()=>{
            if(turn.current){
                //console.log(turn.current)
                setMySeconds(mySeconds => mySeconds - 1)
            }
            //onsole.log(game)
        }, 1000)
        return () =>{
            clearInterval(interval)
        }
    }, [color], [game])

    useEffect(()=>{
        socket.emit("set_nickname", name)
        joinRoom()
    }, [])

    //Not sure why I couldn't put it after setMySeconds above...
    useEffect(()=>{
        //Formatting time
        if(Math.floor(mySeconds/60) < 10 && mySeconds%60 < 10){
            setMyTime("0"+Math.floor(mySeconds/60).toString()+" : 0"+(mySeconds%60).toString())
        }
        else if(mySeconds%60 < 10){
            setMyTime(Math.floor(mySeconds/60).toString()+" : 0"+(mySeconds%60).toString())
        }   
        else if(Math.floor(mySeconds/60) < 10){
            setMyTime("0"+Math.floor(mySeconds/60).toString()+" : "+(mySeconds%60).toString())
        }//11 26
        else{
            setMyTime(Math.floor(mySeconds/60).toString()+" : "+(mySeconds%60).toString())
        }
        if(mySeconds <= 0){
            let data = {
                col: color.current,
                room: roomName
            }
            socket.emit("no_time", data)
            if(color.current == "white"){
                alert("Black won")
            }
            if(color.current == "black"){
                alert("White won")
            }
            wonOnTime.current = true
        }
    },[mySeconds])

    useEffect(()=>{
        let data = {
            time: myTime,
            room: roomName
        }
        socket.emit("send_time", data)
    }, [myTime])
    

    useEffect(()=> {//Checking if game is over
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
    useEffect(()=>{ //Getting data from opponent/server
        socket.on("receive_move", (data)=>{
            const gameCopy = new Chess();
            gameCopy.loadPgn(data);
            setGame(gameCopy)
            turn.current = true
            console.log("recieved")
        })
        socket.on("receive_color", (col) =>{
            color.current = col
            if(col == "white"){
                turn.current = true
            }
        })
        socket.on("get_opponent", (oppName) =>{
            setOpponent(opponent => oppName)
        })
        socket.on("receive_chat", (s)=>{
            setChatLog(chatLog =>[...chatLog, s])
        })
        socket.on("receive_time", (t)=>{
            setOppTime(t)
        })
        socket.on("win_game", (col)=>{
            wonOnTime.current = true
            console.log("Won on time")
            if(col == "white"){
                alert("Black won")
            }
            if(col == "black"){
                alert("White won")
            }
        })
    }, [socket])

    

    
    return (
    <>
        <Typography align="right" variant = "h4" marginRight={30}>Room: {roomName}</Typography>
        <div style = {{marginTop: '1vw', display: 'flex', flexDirection: 'row'}}>
            <div style = {{alignItems: 'center', marginLeft: '25%',justifyContent: 'center', width: '80vh', height: '100%'}}>
            <div>
                <div style = {{marginTop: '1vw', display: 'inline-block', flexDirection: 'row', float: 'left'}}>
                    <Typography variant = "h4" align="left">{opponent}</Typography>
                </div>
                <div style = {{marginTop: '1vw', display: 'inline-block', flexDirection: 'row', float: 'right'}}>
                    <Typography variant = "h4" align="right">{oppTime}</Typography>
                </div>
            </div>
            <Chessboard position={game.fen()} onPieceDrop={onDrop} id="BasicBoard" boardOrientation={color.current}/>
            <div style = {{marginTop: '5vh'}}>
                <div style = {{marginTop: '1vw', display: 'inline-block', flexDirection: 'row', float: 'left'}}>
                    <Typography variant = "h4" align="left">{name}</Typography>
                </div>
                <div style = {{marginTop: '1vw', display: 'inline-block', flexDirection: 'row', float: 'right'}}>
                    <Typography variant = "h4" align="right">{myTime}</Typography>
                </div>
            </div>
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