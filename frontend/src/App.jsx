import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/profile" element={<h1>Photographer Profile</h1>}/>
      </Routes>
    </Router>
  );
}
   

export default App;
