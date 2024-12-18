import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SetupGame from "./components/SetupGame";
import DealCards from "./components/DealCards";
import PlayersCards from "./components/PlayersCards";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetupGame />} />
        <Route path="/deal" element={<DealCards />} />
        <Route path="/players" element={<PlayersCards />} />
      </Routes>
    </Router>
  );
};

export default App;
