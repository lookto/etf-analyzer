import express from "express";

import { getAllEtfs } from "../controllers/etf";

const router = express.Router();

router.get("/", getAllEtfs);

export default router;
