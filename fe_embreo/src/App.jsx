import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Events from "./Pages/Events";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} exact element={<Dashboard />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/events"} element={<Events />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
