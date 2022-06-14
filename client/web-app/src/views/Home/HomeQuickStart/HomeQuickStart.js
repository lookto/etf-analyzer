import { Link } from "react-router-dom";
import "./HomeQuickStart.css";

import Button from "../../../components/Button/Button.js";

export default function HomeQuickStart() {
    return (
        <div className="flex--container content--box home--quickstart">
            <h2>
                Get an overview of the diversification of your ETF portfolio
            </h2>
            <Link to="/getStarted">
                <Button name="Start now" />
            </Link>
        </div>
    );
}
