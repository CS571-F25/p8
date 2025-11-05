import { HashRouter, Routes,Route } from 'react-router'
import './App.css'
import Home from './components/Home'
import Gallery from './components/Gallery'
import Create from './components/Create'



function App() {
  return<HashRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/Gallery" element={<Gallery/>}></Route>
      <Route path="/Create" element={<Create/>}></Route>

    </Routes>
  </HashRouter>


}

export default App
