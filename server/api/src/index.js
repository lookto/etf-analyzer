const express = require("express");

const etfRouter = require("./routes/etf.js");
const etfProviderRouter = require("./routes/etfProvider.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/etf", etfRouter);
app.use("/provider", etfProviderRouter);
app.get("/", (req, res) => res.send("Welcome to the etf analyzer API!"));
app.all("*", (req, res) =>
    res.send("You've tried reaching a route that doesn't exist.")
);

app.listen(PORT, () =>
    console.log(`Server running on port: http://localhost:${PORT}`)
);
