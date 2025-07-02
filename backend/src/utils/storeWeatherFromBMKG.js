import prisma from "../../prisma/index.js";
import { fetchBMKGWeather } from "./fetchBMKGWeather.js";

/**
 * Ambil dari BMKG & simpan/update ke Prisma DB
 * @param {string} regionCode - kode wilayah adm4
 */
export const storeWeatherFromBMKG = async (regionCode) => {
  const forecasts = await fetchBMKGWeather(regionCode);
  if (!Array.isArray(forecasts) || forecasts.length === 0) return;
  for (const forecast of forecasts) {
    await prisma.weatherForecast.upsert({
      where: {
        location_date: {
          location: forecast.location,
          date: forecast.date,
        },
      },
      update: forecast,
      create: forecast,
    });
  }
};
