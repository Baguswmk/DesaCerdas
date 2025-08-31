import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useThemeStore from "@/store/theme";
import LocationSelect from "./LocationSelect";

const Cuaca = ({ weatherData, isLoading, detectLocation }) => {
  const { isDarkMode } = useThemeStore();
  
  // Ambil data cuaca hari ini
  const todayWeather = Array.isArray(weatherData) && weatherData.length > 0 
    ? weatherData[0] 
    : null;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cuaca Saat Ini */}
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle>Cuaca Hari Ini</CardTitle>
            <CardDescription>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-green-500 mr-2" />
                <LocationSelect />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={detectLocation}
                  className="ml-2 !rounded-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <i className="fas fa-crosshairs text-green-500" />
                  )}
                </Button>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : todayWeather ? (
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center mb-4 md:mb-0">
                  {todayWeather.image ? (
                    <img 
                      src={`https://bmkg.go.id/asset/img/cuaca/${todayWeather.image}`}
                      alt={todayWeather.forecast}
                      className="w-16 h-16 mx-auto mb-2"
                    />
                  ) : (
                    <i className="fas fa-cloud-sun text-6xl text-yellow-500 mb-2"></i>
                  )}
                  <p className="text-lg">{todayWeather.forecast}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(todayWeather.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long"
                    })}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <i className="fas fa-temperature-high text-2xl text-red-500 mb-2"></i>
                    <p className="text-3xl font-bold">{todayWeather.temperature}°C</p>
                    <p className="text-sm">Suhu</p>
                  </div>
                  <div>
                    <i className="fas fa-tint text-2xl text-blue-500 mb-2"></i>
                    <p className="text-3xl font-bold">{todayWeather.humidity}%</p>
                    <p className="text-sm">Kelembaban</p>
                  </div>
                  <div>
                    <i className="fas fa-wind text-2xl text-gray-500 mb-2"></i>
                    <p className="text-3xl font-bold">{todayWeather.windSpeed}</p>
                    <p className="text-sm">km/jam</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Data cuaca tidak tersedia</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prakiraan Cuaca */}
        <Card className={`col-span-1 lg:col-span-2 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardHeader>
            <CardTitle>Prakiraan Cuaca</CardTitle>
            <CardDescription>Sumber data: BMKG</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : weatherData && weatherData.length > 0 ? (
              <div className="space-y-3">
                {weatherData.slice(0, 4).map((weather, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      {weather.image ? (
                        <img 
                          src={`https://bmkg.go.id/asset/img/cuaca/${weather.image}`}
                          alt={weather.forecast}
                          className="w-10 h-10"
                        />
                      ) : (
                        <i className="fas fa-cloud text-2xl text-gray-400"></i>
                      )}
                      <div>
                        <p className="font-medium">
                          {new Date(weather.date).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric", 
                            month: "long"
                          })}
                        </p>
                        <p className="text-sm text-gray-500">{weather.forecast}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{weather.temperature}°C</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span><i className="fas fa-tint mr-1"></i>{weather.humidity}%</span>
                        <span><i className="fas fa-wind mr-1"></i>{weather.windSpeed}km/h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Data prakiraan cuaca tidak tersedia</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Cuaca;