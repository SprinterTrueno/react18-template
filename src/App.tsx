import React from "react";
import doge from "./assets/images/doge.jpg";
import "./App.css";

const App: React.FC = () => {
  return (
    <div>
      <div className="text">Hello World!</div>
      <img src={doge} alt="doge" />
    </div>
  );
};

export default App;
