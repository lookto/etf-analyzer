import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AnalyzerPage.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { defaults } from "chart.js";
import {
    getRGBAColor,
    getRGBARainbowArray,
} from "../../../utils/colorGenerator";

import Button from "../../../components/Button/Button.js";
import AnalyzerEtfCard from "../AnalyzerEtfCard/AnalyzerEtfCard";

ChartJS.register(ArcElement, Tooltip, Legend);
defaults.plugins.legend.position = "right";

export default function AnalyzerPage(props) {
    const [selectedEtfs, setSelectedEtfs] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "# of Votes",
                data: [],
                backgroundColor: [],
            },
        ],
    });

    const [analysisView, setAnalysisView] = useState("sectors");
    const allEtfs = useRef(null);
    const etfProvider = useRef(null);
    const sectors = useRef(null);
    const countries = useRef(null);
    const totalPortfolioWeight = useRef(null);

    function addEmptyEtf() {
        setSelectedEtfs((prevSelectedEtfs) => {
            return [
                ...prevSelectedEtfs,
                {
                    id:
                        prevSelectedEtfs.length === 0
                            ? 1
                            : prevSelectedEtfs[prevSelectedEtfs.length - 1].id +
                              1,
                    index: prevSelectedEtfs.length + 1,
                    etfId: null,
                    name: null,
                    provider: null,
                    countryData: null,
                    sectorData: null,
                },
            ];
        });
    }

    function deleteEtf(id) {
        setSelectedEtfs((prevSelectedEtfs) => {
            return prevSelectedEtfs
                .filter((etf) => etf.id !== id)
                .map((etf, index) => {
                    return { ...etf, index: index + 1 };
                });
        });
    }

    function selectEtf(id, option) {
        axios.get(`/api/etfdata/${option.value}`).then((res) => {
            setSelectedEtfs((prevSelectedEtfs) => {
                const index = prevSelectedEtfs.findIndex(
                    (etf) => etf.id === id
                );
                prevSelectedEtfs[index] = {
                    ...prevSelectedEtfs[index],
                    etfId: option.value,
                    name: option.label,
                    provider: etfProvider.current.find(
                        (provider) => provider.id === option.providerId
                    ).name,
                    countryData: res.data.countryData,
                    sectorData: res.data.sectorData,
                };
                return [...prevSelectedEtfs];
            });
        });
    }

    function updateEtfWeight(id, weight) {
        setSelectedEtfs((prevSelectedEtfs) => {
            const index = prevSelectedEtfs.findIndex((etf) => etf.id === id);
            prevSelectedEtfs[index] = {
                ...prevSelectedEtfs[index],
                weight: parseInt(weight),
            };
            return [...prevSelectedEtfs];
        });
    }

    function calcTotalPortfolioWeight() {
        totalPortfolioWeight.current = selectedEtfs.reduce((total, etf) => {
            return (total = etf.weight ? total + etf.weight : total);
        }, 0);
    }

    useEffect(() => {
        if (selectedEtfs) {
            calcTotalPortfolioWeight();
            const {
                catKey,
                mapKey,
                mapArr,
                mapArrColorKey,
                colorRange,
                colorOffset,
                groupByKey,
                reduce,
                amount,
            } =
                analysisView === "sectors"
                    ? {
                          catKey: "sectorData",
                          mapKey: "sectorId",
                          mapArr: sectors.current,
                          mapArrColorKey: "color",
                          groupByKey: null,
                      }
                    : analysisView === "markets"
                    ? {
                          catKey: "countryData",
                          mapKey: "countryId",
                          mapArr: countries.current,
                          colorRange: { min: 200, max: 340 },
                          groupByKey: "market",
                      }
                    : analysisView === "countries"
                    ? {
                          catKey: "countryData",
                          mapKey: "countryId",
                          mapArr: countries.current,
                          colorOffset: 200,
                          groupByKey: null,
                          reduce: true,
                          amount: 3,
                      }
                    : analysisView === "regions"
                    ? {
                          catKey: "countryData",
                          mapKey: "countryId",
                          colorRange: { min: 200, max: 360 },
                          colorOffset: 160,
                          mapArr: countries.current,
                          groupByKey: "region",
                      }
                    : {};

            const categories = selectedEtfs.reduce((total, etf) => {
                if (etf.weight) {
                    for (const data of etf[catKey]) {
                        if (
                            !total.find((element) => element === data[mapKey])
                        ) {
                            total.push(data[mapKey]);
                        }
                    }
                }
                return total;
            }, []);
            if (categories.length !== 0) {
                let newData = categories
                    .map((cat) => {
                        const value =
                            selectedEtfs.reduce((total, etf) => {
                                const data = etf[catKey]
                                    ? etf[catKey].find(
                                          (element) => element[mapKey] === cat
                                      )
                                    : null;

                                return data && etf.weight
                                    ? data.weight * etf.weight + total
                                    : total;
                            }, 0) / totalPortfolioWeight.current;
                        return {
                            id: cat,
                            value: Math.round(value * 10000) / 100,
                        };
                    })
                    .sort((a, b) => b.value - a.value);

                let newLabels = newData.map((data) => {
                    return mapArr.find((cat) => cat.id === data.id).name;
                });

                if (groupByKey) {
                    newData = newData
                        .reduce((groupedData, data) => {
                            const mapElement = mapArr.find(
                                (cat) => cat.id === data.id
                            );
                            if (mapElement[groupByKey]) {
                                const index = groupedData.findIndex(
                                    (element) =>
                                        element?.group ===
                                        mapElement[groupByKey]
                                );
                                index < 0
                                    ? groupedData.push({
                                          group: mapElement[groupByKey],
                                          value: data.value,
                                      })
                                    : (groupedData[index].value =
                                          groupedData[index].value +
                                          data.value);
                            }
                            return [...groupedData];
                        }, [])
                        .sort((a, b) => b.value - a.value);

                    newLabels = newData.map((data) => {
                        return data.group;
                    });
                }

                if (reduce) {
                    let reducedAmount = 0;
                    while (
                        reducedAmount + newData[newData.length - 1].value <=
                        amount
                    ) {
                        reducedAmount = newData.pop().value;
                        newLabels.pop();
                    }
                    newData.push({ id: "Others", value: reducedAmount });
                    newLabels.push("Others");
                }
                const backgroundColor = !mapArrColorKey
                    ? getRGBARainbowArray(newData.length, {
                          range: colorRange,
                          offset: colorOffset,
                      })
                    : newData.map((data) => {
                          const element = mapArr.find(
                              (element) => element.id === data.id
                          );
                          if (element[mapArrColorKey]) {
                              return element[mapArrColorKey];
                          }
                      });

                console.log(backgroundColor);
                setChartData((prevChartData) => {
                    return {
                        ...prevChartData,
                        labels: newLabels,
                        datasets: [
                            {
                                ...prevChartData.datasets[0],
                                data: newData,
                                backgroundColor,
                            },
                        ],
                    };
                });
            }
        }
    }, [selectedEtfs, analysisView]);

    useEffect(() => {
        axios.get("/api/etf").then(
            (res) =>
                (allEtfs.current = res.data.map((data) => ({
                    value: data.id,
                    label: data.name,
                    isin: data.isin,
                    providerId: data.providerId,
                    inUse: false,
                })))
        );

        axios
            .get("/api/provider")
            .then((res) => (etfProvider.current = res.data));
        axios.get("/api/sector").then((res) => {
            if (!sectors.current) {
                sectors.current = res.data.sort((a, b) => a.id - b.id);
                sectors.current = sectors.current.map((sector, index) => {
                    return {
                        ...sector,
                        color: getRGBAColor(index, sectors.current.length, {
                            offset: 180,
                        }),
                    };
                });
                console.log(sectors.current);
            }
        });
        axios.get("/api/country").then((res) => (countries.current = res.data));
    }, []);

    const mappedEtfComponents = selectedEtfs.map((etf) => {
        return (
            <AnalyzerEtfCard
                etf={etf}
                selectEtf={selectEtf}
                deleteEtf={deleteEtf}
                options={allEtfs.current}
                updateEtfWeight={updateEtfWeight}
                key={etf.id}
            />
        );
    });

    return (
        <>
            <div className="analyzer--info--wrapper  content--box">
                <div className="analyzer--info">
                    <h2>Analyze your portfolio now!</h2>
                    Get an overview of the diversification of your investment by
                    adding your ETF positions to the portfolio.
                </div>
            </div>
            <div className="analyzer--headers content--box flex--container">
                <h2>Portfolio</h2>
            </div>
            <div className="analyzer--body--etfs content--box flex--container">
                {mappedEtfComponents}

                <div className="analyzer--body--etfs--button">
                    <Button name="+ add ETF" click={addEmptyEtf} />
                </div>
            </div>
            <div className="analyzer--headers content--box flex--container">
                <h2>Diversification</h2>
            </div>
            <div className="analyzer--diversification--menu flex--container">
                by
                <ul className="flex--container">
                    <li
                        onClick={() => setAnalysisView("sectors")}
                        className={
                            analysisView === "sectors" ? "li--active" : ""
                        }
                    >
                        Sectors
                    </li>
                    <li
                        onClick={() => setAnalysisView("markets")}
                        className={
                            analysisView === "markets" ? "li--active" : ""
                        }
                    >
                        Markets
                    </li>
                    <li
                        onClick={() => setAnalysisView("countries")}
                        className={
                            analysisView === "countries" ? "li--active" : ""
                        }
                    >
                        Countries
                    </li>
                    <li
                        onClick={() => setAnalysisView("regions")}
                        className={
                            analysisView === "regions" ? "li--active" : ""
                        }
                    >
                        Regions
                    </li>
                </ul>
            </div>
            {totalPortfolioWeight.current > 0 && (
                <Doughnut
                    className="analyzer--diversification--chart"
                    data={chartData}
                    options={{
                        aspectRatio: 1,
                        parsing: { key: "value" },
                    }}
                />
            )}
        </>
    );
}
