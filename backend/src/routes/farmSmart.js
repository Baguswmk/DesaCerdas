import express from "express";
import {
  getWeatherForecast,
  createFarmAnalysis,
  getFarmAnalysis,
} from "../controllers/farmSmart.js";

const router = express.Router();

// static first
router.get("/weather", getWeatherForecast);

// farm analysis
router.post("/analysis", createFarmAnalysis);
router.get("/analysis/:farmEntryId", getFarmAnalysis);

export default router;
