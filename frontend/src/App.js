import { Routes, Route } from 'react-router-dom'

import Board from './components/Board';
import Home from './components/Home';
import Menubar from './components/Menubar';
import Profile from './components/Profile';

import ChessBG from "./media/ChessBG.jpg"

import { useState, useEffect } from 'react';

const App = () =>{
    const [loggedUser, setLoggedUser] = useState("")
    const [loggedDisplay, setLoggedDisplay] = useState("")
    const [inGame, setInGame] = useState(false)
    
    return(
        <>
        <div>
            <Menubar setLoggedUser={setLoggedUser} setLoggedDisplay = {setLoggedDisplay} inGame = {inGame}/>
            <Routes>
                <Route path = "/" element={<Home user = {loggedUser} displayName = {loggedDisplay} setInGame = {setInGame}/>} ></Route>
                <Route path = "/Board" element={<Board user = {loggedUser} setInGame = {setInGame}/>} ></Route>
                <Route path = "/Profile" element={<Profile user = {loggedUser} displayName = {loggedDisplay}/>}></Route>
            </Routes>
            </div>
        </>
    )
    
}

export default App;