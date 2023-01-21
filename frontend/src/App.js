import { Routes, Route } from 'react-router-dom'
import Board from './components/Board';
import Home from './components/Home';

import ChessBG from "./media/ChessBG.jpg"

const App = () =>{
    return(
        <>
        <div>
            <Routes>
                <Route path = "/" element={<Home/>}></Route>
                <Route path = "/Board" element={<Board/>}></Route>
            </Routes>
            </div>
        </>
    )
    
}

export default App;