import { BrowserRouter , Routes, Route } from "react-router-dom";
import Login from './componentes/Login'
import Main from './componentes/Main'
import Historial from './componentes/Historial'

import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Login/>}/>
            <Route exact path="/datos" element={<Main/>}/>
            <Route exact path="/historial" element={<Historial/>}/>
        </Routes>
    </BrowserRouter> 
    </>
  );
}

export default App;
