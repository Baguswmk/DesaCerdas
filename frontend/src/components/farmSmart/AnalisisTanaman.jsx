// components/AnalysisTab.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import useThemeStore from "@/store/theme";
import useFarmSmartStore from "@/store/farmStore";

const AnalysisTab = ({ aiResult, isLoading, detectLocation, handleSubmit, handleSaveResult }) => {
  const {
    location,
    plant,
    date,
    question,
    savedResults,
    setLocation,
    setPlant,
    setDate,
    setQuestion,
  } = useFarmSmartStore();
  const { isDarkMode: theme } = useThemeStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Input Analisis */}
      <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}>
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
                  className={`${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"}`}
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
                <SelectTrigger className={`w-full ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"}`}>
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
                    className={`w-full justify-start text-left font-normal !rounded-button whitespace-nowrap ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"}`}
                  >
                    <i className="fas fa-calendar-alt mr-2"></i>
                    {date ? format(date, "PPP", { locale: id }) : "Pilih tanggal"}
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

      {/* Hasil Analisis */}
      <Card className={`col-span-1 lg:col-span-2 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <CardHeader>
          <CardTitle>Hasil Analisis</CardTitle>
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
                  Tanaman {plant || "Anda"} diperkirakan siap panen pada <strong>{aiResult.harvestDate}</strong>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <i className="fas fa-seedling mr-2 text-green-500"></i>
                  Panduan Penanaman
                </h3>
                <ol className="space-y-2 list-decimal list-inside">
                  {aiResult.steps.map((step, index) => (
                    <li key={index} className="pl-2">{step}</li>
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
              <Button onClick={handleSaveResult} className="mt-4 !rounded-button whitespace-nowrap">
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
              <h3 className="text-xl font-medium mb-2">Belum Ada Hasil Analisis</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Silakan masukkan informasi lokasi, jenis tanaman, dan tanggal penanaman untuk mendapatkan rekomendasi pertanian cerdas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Riwayat */}
      <div className="col-span-3 mt-12">
        <h2 className="text-2xl font-bold mb-6">Riwayat Analisis</h2>
        {savedResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedResults.map((result) => (
              <Card
                key={result.id}
                className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{result.plant}</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 !rounded-button">
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
                    <Button variant="outline" size="sm" className="w-full !rounded-button whitespace-nowrap">
                      <i className="fas fa-eye mr-2"></i>
                      Lihat Detail
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <i className="fas fa-history text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-medium mb-2">Belum Ada Riwayat</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Riwayat analisis tanaman Anda akan muncul di sini setelah Anda menyimpan hasil analisis.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalysisTab;
