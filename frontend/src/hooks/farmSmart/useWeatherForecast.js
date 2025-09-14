// hooks/farmSmart/useWeatherForecast.js
import { useQuery } from "@tanstack/react-query";
import { getWeather } from "@/services/apiFarm";

export const useWeatherForecast = (location, options = {}) => {
  return useQuery({
    queryKey: ["weather", location],
    queryFn: async () => {
      const res = await getWeather(location);
      return res.data; 
    },
    enabled: !!location,
    ...options,
  });
};
