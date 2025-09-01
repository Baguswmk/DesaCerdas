import prisma from "../../prisma/index.js";
import { storeWeatherFromBMKG } from "../utils/storeWeatherFromBMKG.js";
import { sendFarmAI } from "../utils/openaiClient.js";

export const getWeatherForecast = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ message: "Lokasi wajib diisi." });

    const forecasts = await prisma.weatherForecast.findMany({
      where: { location },
      orderBy: { date: "asc" },
    });
console.log("🔍 Fetching Weather Forecast for:", location);
    if (forecasts.length === 0) {
      
      await storeWeatherFromBMKG(location);
      const updated = await prisma.weatherForecast.findMany({
        where: { location },
        orderBy: { date: "asc" },
      });
      return res.json(updated);
    }
    console.log("✅ Weather Forecast Data:", forecasts);
    res.json(forecasts);
  } catch (err) {
    console.error("❌ Get Forecast Error:", err);
    res.status(500).json({ message: "Gagal mengambil data cuaca." });
  }
};


export const createFarmAnalysis = async (req, res) => {
  try {
    const { farmEntryId, harvestDate, plant, location, question } = req.body;

    if (!plant || !location) {
      return res.status(400).json({ message: "Tanaman dan lokasi wajib diisi." });
    }

    
    const aiResult = await sendFarmAI({ plant, location, question });

    
    const steps = extractSteps(aiResult);
    const risks = extractRisks(aiResult);

    
    const data = await prisma.farmAnalysis.create({
      data: {
        farmEntryId,
        harvestDate: new Date(harvestDate),
        steps,
        risks,
      },
    });

    res.json({ analysis: data, aiRaw: aiResult });
  } catch (err) {
    console.error("❌ Create Analysis Error:", err);
    res.status(500).json({ message: "Gagal menyimpan analisis." });
  }
};


function extractSteps(aiText) {
  const stepMatches = aiText.match(/(?:Langkah|Step)[\s\S]+?(?=Risiko|Risks|$)/i);
  if (!stepMatches) return [];
  return stepMatches[0]
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 3 && /^\d/.test(s));
}


function extractRisks(aiText) {
  const riskMatches = aiText.match(/(?:Risiko|Risks)[\s\S]+/i);
  if (!riskMatches) return [];
  return riskMatches[0]
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 3 && /^\d/.test(s));
}


export const getFarmAnalysis = async (req, res) => {
  try {
    const { farmEntryId } = req.params;

    const data = await prisma.farmAnalysis.findUnique({
      where: { farmEntryId },
    });

    res.json(data);
  } catch (err) {
    console.error("❌ Get Analysis Error:", err);
    res.status(500).json({ message: "Gagal mengambil analisis." });
  }
};
