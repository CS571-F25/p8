import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Gallery from "./components/Gallery.jsx";
import Create from "./components/Create.jsx";
import NavBar from "./components/NavBar.jsx";

export default function App() {
  return (
    <Router basename="/p8">
      <NavBar />

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </div>
    </Router>
  );
}
