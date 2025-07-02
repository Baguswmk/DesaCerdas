import express from "express";
import {
  getWeatherForecast,
  createFarmAnalysis,
  getFarmAnalysis,
} from "../controllers/farmSmart.js";

const router = express.Router();

router.get("/weather", getWeatherForecast);

router.post("/analysis", createFarmAnalysis);

router.get("/analysis/:farmEntryId", getFarmAnalysis);

export default router;
