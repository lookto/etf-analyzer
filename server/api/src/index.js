const express = require("express");
var cors = require("cors");

const etfRouter = require("./routes/etf");
const etfProviderRouter = require("./routes/etfProvider");
const etfIndexRouter = require("./routes/etfIndex");
const etfDataRouter = require("./routes/etfData");
const sectorRouter = require("./routes/sector");
const countryRouter = require("./routes/country");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/etf", etfRouter);
app.use("/provider", etfProviderRouter);
app.use("/index", etfIndexRouter);
app.use("/etfData", etfDataRouter);
app.use("/sector", sectorRouter);
app.use("/country", countryRouter);
app.get("/", (req, res) => res.send("Welcome to the etf analyzer API!"));
app.all("*", (req, res) =>
    res.send("You've tried reaching a route that doesn't exist.")
);

app.listen(PORT, () =>
    console.log(`Server running on port: http://localhost:${PORT}`)
);
