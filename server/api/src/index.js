import express from "express";

import etfRoutes from "./routes/etf";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/etf", etfRoutes);
app.get("/", (req, res) => res.send("Welcome to the etf analyzer API!"));
app.all("*", (req, res) =>
    res.send("You've tried reaching a route that doesn't exist.")
);

app.listen(PORT, () =>
    console.log(`Server running on port: http://localhost:${PORT}`)
);
