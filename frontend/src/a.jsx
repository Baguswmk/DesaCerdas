import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import * as echarts from "echarts";

const App = () => {
  const [theme, setTheme] = useState("light");
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState("Jakarta");
  const [plant, setPlant] = useState("");
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 75,
    windSpeed: 12,
    forecast: "Cerah Berawan",
  });
  const [aiResult, setAiResult] = useState(null);
  const [savedResults, setSavedResults] = useState([
    {
      id: 1,
      location: "Bandung",
      plant: "Padi",
      plantingDate: "10 Juni 2025",
      harvestDate: "10 September 2025",
    },
    {
      id: 2,
      location: "Yogyakarta",
      plant: "Jagung",
      plantingDate: "15 Mei 2025",
      harvestDate: "15 Agustus 2025",
    },
  ]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;

    const chartDom = document.getElementById("weatherChart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        tooltip: { trigger: "axis" },
        legend: {
          data: ["Suhu", "Kelembaban"],
          textStyle: {
            color: theme === "dark" ? "#ffffff" : "#333333",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
          axisLabel: {
            color: theme === "dark" ? "#ffffff" : "#333333",
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: theme === "dark" ? "#ffffff" : "#333333",
          },
        },
        series: [
          {
            name: "Suhu",
            type: "line",
            data: [28, 29, 30, 29, 28, 27, 28],
            smooth: true,
            lineStyle: { color: "#10b981" },
            itemStyle: { color: "#10b981" },
          },
          {
            name: "Kelembaban",
            type: "line",
            data: [75, 73, 70, 72, 75, 78, 76],
            smooth: true,
            lineStyle: { color: "#3b82f6" },
            itemStyle: { color: "#3b82f6" },
          },
        ],
      };
      myChart.setOption(option);

      const handleResize = () => myChart.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        myChart.dispose();
      };
    }
  }, [theme]);

  const handleSubmit = () => {
    setAiResult({
      harvestDate: "10 Oktober 2025",
      steps: [
        "Persiapkan lahan dengan membersihkan dari gulma dan sisa tanaman sebelumnya.",
        "Olah tanah dengan kedalaman 20-30 cm dan buat bedengan dengan lebar 1 meter.",
        "Taburkan benih secara merata dengan jarak tanam 25x25 cm.",
        "Lakukan penyiraman secara rutin, terutama pada pagi dan sore hari.",
        "Berikan pupuk dasar berupa kompos atau pupuk kandang sebanyak 10 kg per 10 m².",
      ],
      risks: [
        "Serangan hama wereng coklat yang biasa muncul pada musim hujan.",
        "Penyakit blast yang dapat menyerang daun dan batang tanaman.",
        "Kekeringan jika curah hujan rendah selama masa pertumbuhan.",
        "Banjir yang dapat merusak sistem perakaran tanaman.",
      ],
    });
  };

  const handleSaveResult = () => {
    if (aiResult) {
      const newSaved = {
        id: Date.now(),
        location,
        plant,
        plantingDate: format(date, "dd MMMM yyyy", { locale: id }),
        harvestDate: aiResult.harvestDate,
      };
      setSavedResults([...savedResults, newSaved]);
      alert("Data berhasil disimpan!");
    }
  };

  const detectLocation = () => {
    setTimeout(() => {
      setLocation("Surabaya");
    }, 500);
  };
  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`w-full py-4 px-6 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-leaf text-green-500 text-2xl mr-2"></i>
            <h1 className="text-xl font-bold">FarmSmart</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a
              href="#"
              className={`${
                theme === "dark" ? "text-white" : "text-gray-700"
              } hover:text-green-500 cursor-pointer whitespace-nowrap`}
            >
              Beranda
            </a>
            <a
              href="#"
              className={`${
                theme === "dark" ? "text-white" : "text-gray-700"
              } hover:text-green-500 cursor-pointer whitespace-nowrap`}
            >
              Panduan
            </a>
            <a
              href="#"
              className={`${
                theme === "dark" ? "text-white" : "text-gray-700"
              } hover:text-green-500 cursor-pointer whitespace-nowrap`}
            >
              Riwayat
            </a>
            <a
              href="#"
              className={`${
                theme === "dark" ? "text-white" : "text-gray-700"
              } hover:text-green-500 cursor-pointer whitespace-nowrap`}
            >
              Profil
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } cursor-pointer !rounded-button`}
            >
              <i
                className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"} ${
                  theme === "dark" ? "text-yellow-300" : "text-gray-700"
                }`}
              ></i>
            </button>
            <Button
              variant="outline"
              className="hidden md:block !rounded-button whitespace-nowrap"
            >
              Login
            </Button>
            <Button className="hidden md:block !rounded-button whitespace-nowrap">
              Register
            </Button>
            <button className="md:hidden text-2xl">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-transparent opacity-90"></div>
        <div
          className="h-96 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Beautiful%20agricultural%20farm%20landscape%20with%20lush%20green%20rice%20fields%20and%20terraces%20under%20clear%20blue%20sky%2C%20mountains%20in%20background%2C%20modern%20sustainable%20farming%20technology%2C%20professional%20photography%2C%20ultra%20HD%2C%20cinematic%20lighting&width=1440&height=600&seq=1&orientation=landscape')`,
          }}
        >
          <div className="container mx-auto px-6 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                FarmSmart - Asisten Pertanian Pintar Anda
              </h1>
              <p className="text-white text-lg mb-8">
                Dapatkan rekomendasi pertanian cerdas dengan data cuaca BMKG dan
                panduan lengkap untuk hasil panen yang optimal.
              </p>
              <Button size="lg" className="!rounded-button whitespace-nowrap">
                Mulai Sekarang
              </Button>
            </div>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-6 py-12">
        <Tabs defaultValue="weather" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
            <TabsTrigger
              value="weather"
              className="!rounded-button whitespace-nowrap"
            >
              Data Cuaca
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="!rounded-button whitespace-nowrap"
            >
              Analisis Tanaman
            </TabsTrigger>
          </TabsList>
          <TabsContent value="weather" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Weather Card */}
              <Card
                className={`${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle>Cuaca Saat Ini</CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-green-500 mr-2"></i>
                      <span>{location}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={detectLocation}
                        className="ml-2 !rounded-button whitespace-nowrap"
                      >
                        <i className="fas fa-crosshairs text-green-500"></i>
                      </Button>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-center mb-4 md:mb-0">
                      <i className="fas fa-cloud-sun text-6xl text-yellow-500 mb-2"></i>
                      <p className="text-lg">{weatherData.forecast}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <i className="fas fa-temperature-high text-2xl text-red-500 mb-2"></i>
                        <p className="text-3xl font-bold">
                          {weatherData.temperature}°C
                        </p>
                        <p className="text-sm">Suhu</p>
                      </div>
                      <div>
                        <i className="fas fa-tint text-2xl text-blue-500 mb-2"></i>
                        <p className="text-3xl font-bold">
                          {weatherData.humidity}%
                        </p>
                        <p className="text-sm">Kelembaban</p>
                      </div>
                      <div>
                        <i className="fas fa-wind text-2xl text-gray-500 mb-2"></i>
                        <p className="text-3xl font-bold">
                          {weatherData.windSpeed}
                        </p>
                        <p className="text-sm">km/jam</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Weather Forecast Cards */}
              <Card
                className={`col-span-1 lg:col-span-2 ${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle>Prakiraan Cuaca 7 Hari</CardTitle>
                  <CardDescription>Sumber data: BMKG</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    id="weatherChart"
                    style={{ width: "100%", height: "300px" }}
                  ></div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Senin", "Selasa", "Rabu", "Kamis"].map((day, index) => (
                <Card
                  key={index}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{day}</CardTitle>
                    <CardDescription>{`${
                      3 + index
                    } Juli 2025`}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-4">
                    <i
                      className={`fas ${
                        index % 2 === 0 ? "fa-cloud-sun" : "fa-cloud-rain"
                      } text-4xl ${
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
          </TabsContent>
          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Form */}
              <Card
                className={`${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle>Analisis Tanaman</CardTitle>
                  <CardDescription>
                    Masukkan informasi untuk mendapatkan rekomendasi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Lokasi</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Masukkan lokasi"
                          className={`${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white"
                          }`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={detectLocation}
                          className="!rounded-button whitespace-nowrap"
                        >
                          <i className="fas fa-crosshairs mr-2"></i>
                          Deteksi
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plant">Jenis Tanaman</Label>
                      <Select value={plant} onValueChange={setPlant}>
                        <SelectTrigger
                          className={`w-full ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white"
                          }`}
                        >
                          <SelectValue placeholder="Pilih jenis tanaman" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padi">Padi</SelectItem>
                          <SelectItem value="jagung">Jagung</SelectItem>
                          <SelectItem value="kedelai">Kedelai</SelectItem>
                          <SelectItem value="cabai">Cabai</SelectItem>
                          <SelectItem value="tomat">Tomat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Tanggal Penanaman</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal !rounded-button whitespace-nowrap ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white"
                            }`}
                          >
                            <i className="fas fa-calendar-alt mr-2"></i>
                            {date
                              ? format(date, "PPP", { locale: id })
                              : "Pilih tanggal"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full !rounded-button whitespace-nowrap"
                    >
                      <i className="fas fa-search mr-2"></i>
                      Analisis
                    </Button>
                  </form>
                </CardContent>
              </Card>
              {/* Result Card */}
              <Card
                className={`col-span-1 lg:col-span-2 ${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle>Hasil Analisis</CardTitle>
                  <CardDescription>
                    Rekomendasi berdasarkan data cuaca dan kondisi tanah
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {aiResult ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h3 className="text-lg font-medium flex items-center text-green-800 dark:text-green-300">
                          <i className="fas fa-calendar-check mr-2"></i>
                          Perkiraan Panen
                        </h3>
                        <p className="mt-2 text-green-700 dark:text-green-400">
                          Tanaman {plant || "Anda"} diperkirakan siap panen pada{" "}
                          <strong>{aiResult.harvestDate}</strong>
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <i className="fas fa-seedling mr-2 text-green-500"></i>
                          Panduan Penanaman
                        </h3>
                        <ol className="space-y-2 list-decimal list-inside">
                          {aiResult.steps.map((step, index) => (
                            <li key={index} className="pl-2">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <i className="fas fa-exclamation-triangle mr-2 text-amber-500"></i>
                          Potensi Risiko
                        </h3>
                        <ul className="space-y-2">
                          {aiResult.risks.map((risk, index) => (
                            <li key={index} className="flex items-start">
                              <i className="fas fa-circle text-xs mt-1.5 mr-2 text-amber-500"></i>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        onClick={handleSaveResult}
                        className="mt-4 !rounded-button whitespace-nowrap"
                      >
                        <i className="fas fa-save mr-2"></i>
                        Simpan Hasil Analisis
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                      <img
                        src="https://readdy.ai/api/search-image?query=Illustration%20of%20a%20modern%20farming%20concept%20with%20digital%20tablet%20showing%20plant%20growth%20analysis%2C%20minimalist%20design%2C%20flat%20colors%2C%20clean%20background%2C%20professional%20vector%20style%2C%20no%20text&width=200&height=200&seq=2&orientation=squarish"
                        alt="Analisis Tanaman"
                        className="w-32 h-32 mb-4 object-contain"
                      />
                      <h3 className="text-xl font-medium mb-2">
                        Belum Ada Hasil Analisis
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        Silakan masukkan informasi lokasi, jenis tanaman, dan
                        tanggal penanaman untuk mendapatkan rekomendasi
                        pertanian cerdas.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Saved Results */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Riwayat Analisis</h2>
              {savedResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedResults.map((result) => (
                    <Card
                      key={result.id}
                      className={`${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white"
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{result.plant}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 !rounded-button"
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </Button>
                        </div>
                        <CardDescription>{result.location}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <i className="fas fa-calendar-alt text-green-500 w-6"></i>
                            <span>Tanggal Tanam: {result.plantingDate}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-calendar-check text-amber-500 w-6"></i>
                            <span>Perkiraan Panen: {result.harvestDate}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <a
                          href="https://readdy.ai/home/85c6cc25-8d34-4817-aa51-d3a0a8153624/34909a43-eb4b-4235-b46e-d90fdde28cfb"
                          data-readdy="true"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full !rounded-button whitespace-nowrap"
                          >
                            <i className="fas fa-eye mr-2"></i>
                            Lihat Detail
                          </Button>
                        </a>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white"
                  }`}
                >
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <i className="fas fa-history text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-xl font-medium mb-2">
                      Belum Ada Riwayat
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      Riwayat analisis tanaman Anda akan muncul di sini setelah
                      Anda menyimpan hasil analisis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      {/* Features Section */}
      <section
        className={`py-16 ${theme === "dark" ? "bg-gray-800" : "bg-green-50"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Fitur Unggulan FarmSmart
            </h2>
            <p className="text-lg max-w-2xl mx-auto">
              Dapatkan informasi dan rekomendasi terbaik untuk keberhasilan
              pertanian Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              className={`${
                theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"
              }`}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <i className="fas fa-cloud-sun-rain text-2xl text-green-600 dark:text-green-400"></i>
                </div>
                <CardTitle>Data Cuaca Akurat</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>
                  Dapatkan informasi cuaca terkini dan prakiraan hingga 7 hari
                  ke depan dari BMKG untuk perencanaan pertanian yang lebih
                  baik.
                </p>
              </CardContent>
            </Card>
            <Card
              className={`${
                theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"
              }`}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <i className="fas fa-robot text-2xl text-green-600 dark:text-green-400"></i>
                </div>
                <CardTitle>Analisis AI</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>
                  Teknologi kecerdasan buatan memberikan rekomendasi spesifik
                  berdasarkan jenis tanaman, lokasi, dan kondisi cuaca terkini.
                </p>
              </CardContent>
            </Card>
            <Card
              className={`${
                theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"
              }`}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <i className="fas fa-book-open text-2xl text-green-600 dark:text-green-400"></i>
                </div>
                <CardTitle>Panduan Lengkap</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>
                  Dapatkan panduan penanaman langkah demi langkah dan informasi
                  tentang potensi risiko untuk mengoptimalkan hasil panen Anda.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Testimoni Petani</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Apa kata petani yang telah menggunakan FarmSmart
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Budi Santoso",
                location: "Petani Padi, Cianjur",
                image:
                  "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Indonesian%20farmer%2C%20male%2C%20mid%2040s%2C%20wearing%20traditional%20hat%2C%20natural%20lighting%2C%20rural%20background%2C%20high%20quality%20portrait%2C%20neutral%20expression%2C%20professional%20photography&width=100&height=100&seq=3&orientation=squarish",
                quote:
                  "FarmSmart membantu saya menentukan waktu tanam yang tepat. Hasil panen padi saya meningkat hingga 30% dibandingkan musim sebelumnya.",
              },
              {
                name: "Siti Aminah",
                location: "Petani Sayur, Malang",
                image:
                  "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Indonesian%20female%20farmer%2C%20late%2030s%2C%20smiling%2C%20wearing%20traditional%20headscarf%2C%20natural%20lighting%2C%20rural%20background%2C%20high%20quality%20portrait%2C%20professional%20photography&width=100&height=100&seq=4&orientation=squarish",
                quote:
                  "Dengan panduan dari FarmSmart, saya bisa mengatasi serangan hama pada tanaman tomat saya. Aplikasi ini sangat membantu!",
              },
              {
                name: "Hendra Wijaya",
                location: "Petani Jagung, Yogyakarta",
                image:
                  "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Indonesian%20farmer%2C%20male%2C%20early%2050s%2C%20weathered%20face%2C%20natural%20lighting%2C%20rural%20background%2C%20high%20quality%20portrait%2C%20neutral%20expression%2C%20professional%20photography&width=100&height=100&seq=5&orientation=squarish",
                quote:
                  "Data cuaca yang akurat membantu saya mengantisipasi musim kemarau. FarmSmart memberikan rekomendasi yang tepat untuk irigasi tanaman jagung saya.",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className={`${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <p className="mb-4 italic">"{testimonial.quote}"</p>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section
        className={`py-16 ${theme === "dark" ? "bg-gray-800" : "bg-green-100"}`}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Meningkatkan Hasil Pertanian Anda?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Bergabunglah dengan ribuan petani yang telah merasakan manfaat dari
            teknologi pertanian cerdas
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="!rounded-button whitespace-nowrap">
              <i className="fas fa-user-plus mr-2"></i>
              Daftar Sekarang
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="!rounded-button whitespace-nowrap"
            >
              <i className="fas fa-info-circle mr-2"></i>
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer
        className={`py-12 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-800"
        } text-white`}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <i className="fas fa-leaf text-green-500 text-2xl mr-2"></i>
                <h2 className="text-xl font-bold">FarmSmart</h2>
              </div>
              <p className="mb-4">
                Platform pertanian cerdas yang menggabungkan data cuaca BMKG dan
                teknologi AI untuk membantu petani Indonesia.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white cursor-pointer"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white cursor-pointer"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white cursor-pointer"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white cursor-pointer"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Fitur</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    Data Cuaca
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    Analisis Tanaman
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    Panduan Penanaman
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    Kalender Pertanian
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Perusahaan</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    Karir
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    Kontak
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kontak</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-2 text-green-500"></i>
                  <span>Jl. Pertanian No. 123, Jakarta Selatan, Indonesia</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt mr-2 text-green-500"></i>
                  <span>+62 21 1234 5678</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2 text-green-500"></i>
                  <span>info@farmsmart.id</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2025 FarmSmart. Hak Cipta Dilindungi.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                Syarat & Ketentuan
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
