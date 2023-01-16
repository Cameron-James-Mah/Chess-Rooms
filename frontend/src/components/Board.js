import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import moveAudio from "../media/move-self.mp3"
import captureAudio from "../media/capture.mp3"

import io from 'socket.io-client'
const socket = io.connect("http://localhost:3001")



const Board = () =>{
    const [game, setGame] = useState(new Chess());
    const [color, setColor] = useState("Waiting for opponent...")
    const moveSound = new Audio(moveAudio);
    const captureSound = new Audio(captureAudio);

    const sendBoard = (data) =>{
        socket.emit("send_move", data)
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
        if(game.turn() == 'w' && `${color}` == "White" || game.turn() == 'b' && `${color}` == "Black"){
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

    }, [socket])

    return (
    <>
        <div style = {{width: '40%',alignItems: 'center', marginLeft: '25%',justifyContent: 'center'}}>
            <Chessboard position={game.fen()} onPieceDrop={onDrop} id="BasicBoard"/>
        </div>
        <div>
            <p style={{fontSize:18}}>{color}</p>
        </div>

    </>
  );
}

export default Board;