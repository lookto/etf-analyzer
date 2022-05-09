import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="flex--container content--container">
            <div className="logo">
                <h1>etfAnalyzer</h1>
            </div>
            <ul className="flex--container">
                <Link to="/">
                    <li>Home</li>
                </Link>
                <Link to="/getStarted">
                    <li>Start</li>
                </Link>
            </ul>
        </nav>
    );
}
