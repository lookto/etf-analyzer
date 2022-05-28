import Select from "../../../components/Select/Select";
import "./AnalyzerEtfCard.css";

import Button from "../../../components/Button/Button.js";

export default function AnalyzerEtfCard(props) {
    function selectOption(option) {
        props.selectEtf(props.etf.id, option);
    }

    return (
        <div className=" flex--container etf--card--wrapper">
            <div className="etf--card--icon">{props.etf.index}</div>
            <div className="etf--card">
                <div className="etf--card--element etf--card--element--label">
                    ETF:
                </div>

                <div>
                    <Select
                        onChange={selectOption}
                        options={props.options}
                        width="100%"
                    />
                </div>

                <div className="etf--card--element etf--card--element--label ">
                    Weight:
                </div>

                <div className="etf--card--element ">
                    <input
                        className="etf--card--weight--input"
                        type="text"
                        placeholder="in EUR"
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onBlur={(event) =>
                            event.target.value
                                ? props.updateEtfWeight(
                                      props.etf.id,
                                      event.target.value
                                  )
                                : ""
                        }
                        disabled={props.etf.name ? false : true}
                    />
                </div>
            </div>
            <Button
                name="remove ETF from portfolio"
                click={() => props.deleteEtf(props.etf.id)}
            />
        </div>
    );
}
