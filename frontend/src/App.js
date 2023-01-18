import { Routes, Route } from 'react-router-dom'
import Board from './components/Board';
import Home from './components/Home';

import ChessBG from "./media/ChessBG.jpg"

const containerStyle= {
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${ChessBG})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
}

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