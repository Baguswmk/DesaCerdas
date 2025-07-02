import axiosInstance from "./api";

export const getWeather = (location) =>
  axiosInstance.get(`/farm/weather?location=${location}`);

export const createFarmAnalysis = (data) =>
  axiosInstance.post("/farm/analysis", data);

export const getFarmAnalysis = (farmEntryId) =>
  axiosInstance.get(`/farm/analysis/${farmEntryId}`);
