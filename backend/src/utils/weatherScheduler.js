// utils/weatherScheduler.js
import cron from "node-cron";
import { storeWeatherFromBMKG } from "../utils/storeWeatherFromBMKG.js";

// Daftar kode ADM4 valid dari BMKG
// utils/regionCodes.js

const REGION_CODES = {
  "18.10.01": "Pringsewu",
  "18.10.02": "Gading Rejo",
  "18.10.03": "Ambarawa",
  "18.10.04": "Pardasuka",
  "18.10.05": "Pagelaran",
  "18.10.06": "Banyumas",
  "18.10.07": "Adiluwih",
  "18.10.08": "Sukoharjo",
  "18.10.09": "Pagelaran Utara",
};



export const startWeatherScheduler = () => {
  cron.schedule("0 6 * * *", async () => {
    console.log("🔄 Menjalankan update cuaca otomatis...");

    for (const [regionCode, name] of Object.entries(REGION_CODES)) {
      try {
        await storeWeatherFromBMKG(regionCode);
        console.log(`✅ Data cuaca diperbarui untuk: ${name}`);
      } catch (err) {
        console.error(`❌ Gagal update untuk ${name}:`, err.message);
      }
    }
  });

  console.log("🕒 Scheduler cuaca aktif (update setiap jam 06:00 WIB)");
};
