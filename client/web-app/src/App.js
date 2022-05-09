import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import "./App.css";

export default function App() {
    return (
        <Router>
            <Navbar />
        </Router>
    );
}
