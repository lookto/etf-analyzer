import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./views/Home/HomePage/HomePage";
import AnalyzerPage from "./views/Analyzer/AnalyzerPage/AnalyzerPage";
import "./App.css";

export default function App() {
    return (
        <Router>
            <Navbar />
            <main className="flex--container content--container">
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route
                        path="/getstarted"
                        element={<AnalyzerPage />}
                    ></Route>
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}
