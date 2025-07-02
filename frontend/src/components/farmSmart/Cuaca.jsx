// components/Cuaca.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useThemeStore from "@/store/theme";
import LocationSelect from "./LocationSelect";

const Cuaca = ({ weatherData, detectLocation }) => {
  const { isDarkMode: theme } = useThemeStore();
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cuaca Saat Ini */}
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle>Cuaca Saat Ini</CardTitle>
            <CardDescription>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-green-500 mr-2" />
                <LocationSelect />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={detectLocation}
                  className="ml-2 !rounded-button"
                >
                  <i className="fas fa-crosshairs text-green-500" />
                </Button>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center mb-4 md:mb-0">
                <i className="fas fa-cloud-sun text-6xl text-yellow-500 mb-2"></i>
               <p className="text-lg">{weatherData?.forecast ?? "Tidak tersedia"}</p>

              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <i className="fas fa-temperature-high text-2xl text-red-500 mb-2"></i>
                  <p className="text-3xl font-bold">{weatherData?.temperature}°C</p>
                  <p className="text-sm">Suhu</p>
                </div>
                <div>
                  <i className="fas fa-tint text-2xl text-blue-500 mb-2"></i>
                  <p className="text-3xl font-bold">{weatherData?.humidity}%</p>
                  <p className="text-sm">Kelembaban</p>
                </div>
                <div>
                  <i className="fas fa-wind text-2xl text-gray-500 mb-2"></i>
                  <p className="text-3xl font-bold">{weatherData?.windSpeed}</p>
                  <p className="text-sm">km/jam</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grafik Prakiraan */}
        <Card className={`col-span-1 lg:col-span-2 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardHeader>
            <CardTitle>Prakiraan Cuaca 7 Hari</CardTitle>
            <CardDescription>Sumber data: BMKG</CardDescription>
          </CardHeader>
          <CardContent>
            <div id="weatherChart" style={{ width: "100%", height: "300px" }}></div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Hari Per Hari */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        {["Senin", "Selasa", "Rabu", "Kamis"].map((day, index) => (
          <Card
            key={index}
            className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{day}</CardTitle>
              <CardDescription>{`${3 + index} Juli 2025`}</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-4">
              <i
                className={`fas ${index % 2 === 0 ? "fa-cloud-sun" : "fa-cloud-rain"} text-4xl ${
                  index % 2 === 0 ? "text-yellow-500" : "text-blue-500"
                } mb-2`}
              ></i>
              <p className="text-2xl font-bold">{27 + index}°C</p>
              <div className="flex justify-center space-x-4 mt-2">
                <div>
                  <i className="fas fa-tint text-blue-500 mr-1"></i>
                  <span>{75 - index * 2}%</span>
                </div>
                <div>
                  <i className="fas fa-wind text-gray-500 mr-1"></i>
                  <span>{12 - index}km/j</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Cuaca;
