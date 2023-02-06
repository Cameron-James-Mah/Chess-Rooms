import { Routes, Route } from 'react-router-dom'

import Board from './components/Board';
import Home from './components/Home';
import Menubar from './components/Menubar';
import Profile from './components/Profile';

import ChessBG from "./media/ChessBG.jpg"

import { useState, useEffect } from 'react';

import io from 'socket.io-client'

import Axios  from 'axios';



const socket = io.connect(process.env.REACT_APP_SERVER_URL)

const App = () =>{
    const [loggedUser, setLoggedUser] = useState("")
    const [loggedDisplay, setLoggedDisplay] = useState("")
    const [inGame, setInGame] = useState(false)
    const [rating, setRating] = useState("Unrated")
    /*
    useEffect(()=>{
        if(loggedUser.length > 0){//If logged in, update info
            Axios.post(`${process.env.REACT_APP_SERVER_URL}/getUserRating`,{
                Username: loggedUser,
            }).then((response)=>{
                setRating(response)
            })
        }
    },[])*/
    
    
    return(
        <>
        <div>
            <Menubar setLoggedUser={setLoggedUser} setLoggedDisplay = {setLoggedDisplay} inGame = {inGame} setRating = {setRating}/>
            <Routes>
                <Route path = "/" element={<Home user = {loggedUser} displayName = {loggedDisplay} setInGame = {setInGame} socket = {socket}/>} ></Route>
                <Route path = "/Board" element={<Board user = {loggedUser} setInGame = {setInGame} rating = {rating} socket = {socket} setRating = {setRating}/>} ></Route>
                <Route path = "/Profile" element={<Profile user = {loggedUser} displayName = {loggedDisplay} rating = {rating}/>}></Route>
            </Routes>
            </div>
        </>
    )
    
}

export default App;