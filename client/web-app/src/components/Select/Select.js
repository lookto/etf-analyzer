import "./Select.css";

import ReactSelect from "react-select";

export default function Select(props) {
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            borderRadius: "5px",
            backgroundColor: state.isSelected
                ? "#fc786b"
                : state.isFocused
                ? "#fee0dd"
                : "none",
        }),
        container: (provided, state) => ({
            ...provided,
            height: "fit-content",
            width: state.selectProps.width,
            margin: state.selectProps.margin,
        }),
        menu: (provided, state) => ({
            ...provided,
            zIndex: "3",
        }),
        menuList: (provided, state) => ({
            ...provided,
            paddingTop: "0px",
            paddingBottom: "0px",
        }),
        control: (provided, state) => ({
            ...provided,

            borderColor: state.isFocused ? "#fb4d3d" : "#B3B3B3",
            boxShadow: "none",
        }),
        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = "opacity 300ms";

            return { ...provided, opacity, transition };
        },
    };
    return (
        <ReactSelect
            styles={customStyles}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            options={props.options}
            width={props.width}
            margin={props.margin}
        />
    );
}
