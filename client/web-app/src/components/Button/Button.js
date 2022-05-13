import "./Button.css";

export default function Button(props) {
    return (
        <button onClick={props.click}>
            <div className="button--wrapper flex">
                {props.icon && <img src={props.icon} alt="Button Icon" />}
                {props.name}
            </div>
        </button>
    );
}
