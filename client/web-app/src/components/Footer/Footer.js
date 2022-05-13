import "./Footer.css";

import iconGitHub from "../../images/icon-github.png";

export default function Footer() {
    return (
        <div className="footer--wrapper flex--container">
            <div className="content--container flex--container footer">
                <p className="flex--container">
                    <img src={iconGitHub} alt="Github Icon" className="icon" />
                    <a
                        href="https://github.com/lookto/etf-analyzer"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Visit the GitHub repository
                    </a>
                </p>
                <p>
                    This project is maintained by{" "}
                    <a
                        href="https://lookto.de"
                        target="_blank"
                        rel="noreferrer"
                    >
                        www.lookto.de
                    </a>
                </p>
            </div>
        </div>
    );
}
