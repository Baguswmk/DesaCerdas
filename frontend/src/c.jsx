// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { id } from 'date-fns/locale';
import * as echarts from 'echarts';

const App = () => {
  const [theme, setTheme] = useState('light');

  const plantData = {
    id: 1,
    name: "Padi",
    variety: "IR-64",
    location: "Bandung, Jawa Barat",
    coordinates: "-6.9175, 107.6191",
    plantingDate: "10 Juni 2025",
    harvestDate: "10 September 2025",
    growthStage: "Vegetatif",
    growthProgress: 35,
    weather: {
      current: {
        temperature: 28,
        humidity: 75,
        rainfall: 12,
        windSpeed: 8,
        condition: "Cerah Berawan"
      },
      forecast: [
        { day: "Kamis", date: "03 Juli 2025", temp: 29, condition: "Cerah", humidity: 72, rainfall: 0 },
        { day: "Jumat", date: "04 Juli 2025", temp: 30, condition: "Cerah Berawan", humidity: 70, rainfall: 0 },
        { day: "Sabtu", date: "05 Juli 2025", temp: 28, condition: "Hujan Ringan", humidity: 78, rainfall: 15 },
        { day: "Minggu", date: "06 Juli 2025", temp: 27, condition: "Hujan", humidity: 82, rainfall: 25 },
        { day: "Senin", date: "07 Juli 2025", temp: 28, condition: "Cerah Berawan", humidity: 75, rainfall: 5 },
        { day: "Selasa", date: "08 Juli 2025", temp: 29, condition: "Cerah", humidity: 70, rainfall: 0 },
        { day: "Rabu", date: "09 Juli 2025", temp: 30, condition: "Cerah", humidity: 68, rainfall: 0 }
      ]
    },
    guide: {
      preparation: [
        "Persiapkan lahan dengan membersihkan dari gulma dan sisa tanaman sebelumnya.",
        "Olah tanah dengan kedalaman 20-30 cm dan buat bedengan dengan lebar 1 meter.",
        "Berikan pupuk dasar berupa kompos atau pupuk kandang sebanyak 10 kg per 10 m²."
      ],
      planting: [
        "Taburkan benih secara merata dengan jarak tanam 25x25 cm.",
        "Pastikan kedalaman tanam sekitar 2-3 cm.",
        "Tutup benih dengan tanah tipis dan padatkan secara perlahan."
      ],
      maintenance: [
        "Lakukan penyiraman secara rutin, terutama pada pagi dan sore hari.",
        "Berikan pupuk susulan pada umur 15, 30, dan 45 hari setelah tanam.",
        "Lakukan penyiangan gulma secara berkala untuk menghindari persaingan nutrisi."
      ],
      harvesting: [
        "Panen dilakukan saat 90% bulir padi sudah menguning.",
        "Gunakan sabit untuk memotong batang padi sekitar 15-20 cm dari permukaan tanah.",
        "Jemur gabah hingga kadar air mencapai 14% untuk penyimpanan yang optimal."
      ]
    },
    risks: [
      {
        name: "Serangan Hama Wereng",
        level: "Tinggi",
        description: "Wereng coklat biasa muncul pada musim hujan dan dapat merusak tanaman secara signifikan.",
        mitigation: "Gunakan varietas tahan wereng dan lakukan pemantauan rutin. Aplikasikan pestisida organik jika ditemukan gejala serangan."
      },
      {
        name: "Penyakit Blast",
        level: "Sedang",
        description: "Penyakit jamur yang menyerang daun dan batang tanaman padi.",
        mitigation: "Gunakan fungisida yang direkomendasikan dan pastikan drainase lahan baik untuk mengurangi kelembaban."
      },
      {
        name: "Kekeringan",
        level: "Rendah",
        description: "Risiko kekeringan rendah berdasarkan prakiraan cuaca untuk 30 hari ke depan.",
        mitigation: "Siapkan sistem irigasi cadangan dan gunakan mulsa untuk menjaga kelembaban tanah."
      },
      {
        name: "Banjir",
        level: "Rendah",
        description: "Risiko banjir rendah berdasarkan prakiraan cuaca dan kondisi geografis lokasi tanam.",
        mitigation: "Pastikan sistem drainase berfungsi dengan baik dan buat saluran pembuangan air yang memadai."
      }
    ],
    recommendations: [
      "Berdasarkan prakiraan cuaca, lakukan penyiraman tambahan pada hari Jumat dan Sabtu karena suhu akan meningkat.",
      "Pantau serangan hama wereng secara intensif karena risiko serangan tinggi pada fase vegetatif ini.",
      "Aplikasikan pupuk susulan dalam 3 hari ke depan untuk mendukung pertumbuhan vegetatif yang optimal.",
      "Persiapkan perlindungan tanaman untuk mengantisipasi hujan pada akhir pekan yang dapat meningkatkan risiko penyakit blast."
    ],
    notes: [
      {
        date: "15 Juni 2025",
        content: "Benih mulai berkecambah dengan baik. Kelembaban tanah optimal."
      },
      {
        date: "22 Juni 2025",
        content: "Ditemukan beberapa tanaman yang terserang hama ulat. Dilakukan penyemprotan pestisida organik."
      },
      {
        date: "30 Juni 2025",
        content: "Tanaman tumbuh dengan baik. Dilakukan pemupukan susulan pertama."
      }
    ]
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Tinggi':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Sedang':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Rendah':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Cerah':
        return 'fa-sun';
      case 'Cerah Berawan':
        return 'fa-cloud-sun';
      case 'Berawan':
        return 'fa-cloud';
      case 'Hujan Ringan':
        return 'fa-cloud-sun-rain';
      case 'Hujan':
        return 'fa-cloud-rain';
      default:
        return 'fa-cloud';
    }
  };

  useEffect(() => {
    document.body.className = theme;

    // ECharts logic as is (unchanged for JSX)
    // Growth chart and Weather chart initialization goes here (same as yang kamu punya)

  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 w-full py-4 px-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <a 
              href="https://readdy.ai/home/85c6cc25-8d34-4817-aa51-d3a0a8153624/dcb5db70-c7c2-4aaf-b741-124bab0125de" 
              data-readdy="true"
              className="flex items-center cursor-pointer"
            >
              <i className="fas fa-arrow-left text-green-500 text-lg mr-3"></i>
              <span className="text-sm">Kembali</span>
            </a>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">Detail Analisis Tanaman</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} cursor-pointer !rounded-button`}
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} ${theme === 'dark' ? 'text-yellow-300' : 'text-gray-700'}`}></i>
            </button>
            <Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap">
              <i className="fas fa-ellipsis-v"></i>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Plant Summary Card */}
        <div className="relative mb-8 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-transparent z-10"></div>
          <div
            className="h-64 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Beautiful%20rice%20paddy%20field%20in%20Indonesia%20with%20lush%20green%20plants%20growing%20in%20rows%2C%20mountains%20in%20background%2C%20clear%20blue%20sky%2C%20golden%20sunlight%2C%20professional%20photography%2C%20ultra%20HD%2C%20cinematic%20lighting&width=1440&height=500&seq=10&orientation=landscape')`
            }}
          >
            <div className="relative z-20 h-full flex flex-col justify-end p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{plantData.name}</h2>
                  <p className="text-white/90 text-lg">{plantData.variety}</p>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600 text-white">{plantData.growthStage}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
                  <div className="flex items-center mb-1">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span className="text-sm font-medium">Lokasi</span>
                  </div>
                  <p className="text-sm">{plantData.location}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
                  <div className="flex items-center mb-1">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    <span className="text-sm font-medium">Tanggal Tanam</span>
                  </div>
                  <p className="text-sm">{plantData.plantingDate}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
                  <div className="flex items-center mb-1">
                    <i className="fas fa-calendar-check mr-2"></i>
                    <span className="text-sm font-medium">Perkiraan Panen</span>
                  </div>
                  <p className="text-sm">{plantData.harvestDate}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
                  <div className="flex items-center mb-1">
                    <i className="fas fa-seedling mr-2"></i>
                    <span className="text-sm font-medium">Progres</span>
                  </div>
                  <div className="w-full">
                    <Progress value={plantData.growthProgress} className="h-2 bg-white/30" />
                    <p className="text-sm mt-1">{plantData.growthProgress}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview" className="!rounded-button whitespace-nowrap">Ringkasan</TabsTrigger>
                <TabsTrigger value="guide" className="!rounded-button whitespace-nowrap">Panduan</TabsTrigger>
                <TabsTrigger value="risks" className="!rounded-button whitespace-nowrap">Risiko</TabsTrigger>
                <TabsTrigger value="growth" className="!rounded-button whitespace-nowrap">Perkembangan</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="fas fa-info-circle text-green-500 mr-2"></i>
                      Informasi Tanaman
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jenis Tanaman</p>
                        <p className="font-medium">{plantData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Varietas</p>
                        <p className="font-medium">{plantData.variety}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Lokasi</p>
                        <p className="font-medium">{plantData.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Koordinat</p>
                        <p className="font-medium">{plantData.coordinates}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Tanam</p>
                        <p className="font-medium">{plantData.plantingDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Perkiraan Panen</p>
                        <p className="font-medium">{plantData.harvestDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="fas fa-lightbulb text-amber-500 mr-2"></i>
                      Rekomendasi Perawatan
                    </CardTitle>
                    <CardDescription>
                      Berdasarkan kondisi cuaca dan tahap pertumbuhan saat ini
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plantData.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="fas fa-sticky-note text-blue-500 mr-2"></i>
                      Catatan Lapangan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {plantData.notes.map((note, index) => (
                        <div key={index} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{note.date}</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 !rounded-button cursor-pointer">
                              <i className="fas fa-ellipsis-v"></i>
                            </Button>
                          </div>
                          <p>{note.content}</p>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full !rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-plus mr-2"></i>
                        Tambah Catatan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Guide Tab */}
              <TabsContent value="guide" className="space-y-6">
                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="fas fa-book text-green-500 mr-2"></i>
                      Panduan Penanaman Lengkap
                    </CardTitle>
                    <CardDescription>
                      Langkah-langkah detail untuk penanaman {plantData.name} yang optimal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="preparation">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                              <i className="fas fa-tools text-green-600 dark:text-green-400"></i>
                            </div>
                            <span>Persiapan Lahan</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 space-y-3">
                            {plantData.guide.preparation.map((step, index) => (
                              <div key={index} className="flex items-start">
                                <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-sm mr-3">
                                  {index + 1}
                                </span>
                                <p>{step}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="planting">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                              <i className="fas fa-seedling text-blue-600 dark:text-blue-400"></i>
                            </div>
                            <span>Penanaman</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 space-y-3">
                            {plantData.guide.planting.map((step, index) => (
                              <div key={index} className="flex items-start">
                                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm mr-3">
                                  {index + 1}
                                </span>
                                <p>{step}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="maintenance">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                              <i className="fas fa-hand-holding-water text-amber-600 dark:text-amber-400"></i>
                            </div>
                            <span>Perawatan</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 space-y-3">
                            {plantData.guide.maintenance.map((step, index) => (
                              <div key={index} className="flex items-start">
                                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 text-sm mr-3">
                                  {index + 1}
                                </span>
                                <p>{step}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="harvesting">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                              <i className="fas fa-cut text-red-600 dark:text-red-400"></i>
                            </div>
                            <span>Pemanenan</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 space-y-3">
                            {plantData.guide.harvesting.map((step, index) => (
                              <div key={index} className="flex items-start">
                                <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-sm mr-3">
                                  {index + 1}
                                </span>
                                <p>{step}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="fas fa-calendar-alt text-purple-500 mr-2"></i>
                      Jadwal Perawatan
                    </CardTitle>
                    <CardDescription>
                      Jadwal perawatan untuk 30 hari ke depan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center mb-2">
                          <Badge className="bg-green-500 mr-2">Hari Ini</Badge>
                          <span className="font-medium">2 Juli 2025</span>
                        </div>
                        <p>Pemupukan susulan kedua dengan pupuk NPK sebanyak 5 gram per tanaman.</p>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center mb-2">
                          <span className="font-medium">5 Juli 2025</span>
                        </div>
                        <p>Pemeriksaan hama dan penyakit, terutama fokus pada gejala serangan wereng.</p>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center mb-2">
                          <span className="font-medium">15 Juli 2025</span>
                        </div>
                        <p>Pemupukan susulan ketiga dengan pupuk NPK sebanyak 5 gram per tanaman.</p>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center mb-2">
                          <span className="font-medium">30 Juli 2025</span>
                        </div>
                        <p>Persiapan memasuki fase generatif, pastikan ketersediaan air yang cukup.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Risks Tab */}
              <TabsContent value="risks" className="space-y-6">
                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="fas fa-exclamation-triangle text-amber-500 mr-2"></i>
                      Analisis Risiko
                    </CardTitle>
                    <CardDescription>
                      Potensi risiko berdasarkan jenis tanaman, lokasi, dan kondisi cuaca
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {plantData.risks.map((risk, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className={`px-4 py-3 flex justify-between items-center ${getRiskLevelColor(risk.level)}`}>
                            <div className="flex items-center">
                              <i className="fas fa-exclamation-circle mr-2"></i>
                              <span className="font-medium">{risk.name}</span>
                            </div>
                            <Badge className={`${
                              risk.level === 'Tinggi' ? 'bg-red-500' :
                              risk.level === 'Sedang' ? 'bg-amber-500' : 'bg-green-500'
                            }`}>
                              {risk.level}
                            </Badge>
                          </div>
                          <div className="p-4">
                            <p className="mb-4">{risk.description}</p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                                <i className="fas fa-shield-alt mr-2"></i>
                                Mitigasi
                              </h4>
                              <p className="text-blue-700 dark:text-blue-400 text-sm">{risk.mitigation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Growth Tab */}
              <TabsContent value="growth" className="space-y-6">
                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="fas fa-chart-line text-blue-500 mr-2"></i>
                      Grafik Perkembangan
                    </CardTitle>
                    <CardDescription>
                      Perkembangan tanaman sejak penanaman
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div id="growthChart" style={{ width: '100%', height: '300px' }}></div>
                  </CardContent>
                </Card>

                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="fas fa-leaf text-green-500 mr-2"></i>
                      Tahapan Pertumbuhan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute h-full w-0.5 bg-gray-200 dark:bg-gray-700 left-6 top-0"></div>
                      <div className="space-y-6">
                        <div className="flex">
                          <div className="relative z-10 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                            <i className="fas fa-seedling text-green-600 dark:text-green-400"></i>
                          </div>
                          <div className={`p-4 rounded-lg flex-grow ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className="font-medium mb-1">Fase Perkecambahan</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">10 Juni - 20 Juni 2025</p>
                            <Badge className="bg-green-500">Selesai</Badge>
                            <p className="mt-3">Benih berkecambah dan mulai menumbuhkan akar serta daun pertama.</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="relative z-10 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                            <i className="fas fa-leaf text-green-600 dark:text-green-400"></i>
                          </div>
                          <div className={`p-4 rounded-lg flex-grow ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className="font-medium mb-1">Fase Vegetatif</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">21 Juni - 10 Agustus 2025</p>
                            <Badge className="bg-blue-500">Sedang Berlangsung</Badge>
                            <p className="mt-3">Tanaman aktif tumbuh, menambah tinggi dan jumlah daun.</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="relative z-10 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4 flex-shrink-0">
                            <i className="fas fa-spa text-gray-400 dark:text-gray-500"></i>
                          </div>
                          <div className={`p-4 rounded-lg flex-grow ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} opacity-60`}>
                            <h3 className="font-medium mb-1">Fase Generatif</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">11 Agustus - 10 September 2025</p>
                            <Badge className="bg-gray-500">Belum Dimulai</Badge>
                            <p className="mt-3">Tanaman mulai berbunga dan membentuk bulir padi.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-cloud-sun text-amber-500 mr-2"></i>
                  Cuaca Saat Ini
                </CardTitle>
                <CardDescription>
                  {plantData.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <i className={`fas ${getWeatherIcon(plantData.weather.current.condition)} text-6xl ${plantData.weather.current.condition.includes('Cerah') ? 'text-amber-500' : 'text-blue-500'} mb-3`}></i>
                  <p className="text-lg">{plantData.weather.current.condition}</p>
                  <p className="text-4xl font-bold mt-2">{plantData.weather.current.temperature}°C</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <i className="fas fa-tint text-2xl text-blue-500 mb-2"></i>
                    <p className="text-xl font-bold">{plantData.weather.current.humidity}%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Kelembaban</p>
                  </div>
                  <div>
                    <i className="fas fa-cloud-rain text-2xl text-blue-500 mb-2"></i>
                    <p className="text-xl font-bold">{plantData.weather.current.rainfall} mm</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Curah Hujan</p>
                  </div>
                  <div>
                    <i className="fas fa-wind text-2xl text-blue-500 mb-2"></i>
                    <p className="text-xl font-bold">{plantData.weather.current.windSpeed}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">km/jam</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-calendar-week text-purple-500 mr-2"></i>
                  Prakiraan 7 Hari
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div id="weatherForecastChart" style={{ width: '100%', height: '200px' }} className="mb-4"></div>
                <div className="space-y-3 mt-4">
                  {plantData.weather.forecast.slice(0, 4).map((day, index) => (
                    <div key={index} className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="w-10 text-center">
                        <i className={`fas ${getWeatherIcon(day.condition)} text-lg ${day.condition.includes('Cerah') ? 'text-amber-500' : 'text-blue-500'}`}></i>
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between">
                          <span className="font-medium">{day.day}</span>
                          <span>{day.date}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{day.condition}</span>
                          <span className="font-medium">{day.temp}°C</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full !rounded-button whitespace-nowrap cursor-pointer">
                    Lihat Semua
                    <i className="fas fa-chevron-right ml-2"></i>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-image text-indigo-500 mr-2"></i>
                  Galeri Tanaman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src="https://readdy.ai/api/search-image?query=Close%20up%20of%20healthy%20rice%20plant%20in%20vegetative%20stage%2C%20green%20leaves%20and%20stems%2C%20detailed%20plant%20structure%2C%20natural%20lighting%2C%20shallow%20depth%20of%20field%2C%20professional%20macro%20photography%2C%20high%20resolution&width=300&height=300&seq=11&orientation=squarish" 
                      alt="Tanaman Padi" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src="https://readdy.ai/api/search-image?query=Rice%20paddy%20field%20in%20Indonesia%2C%20rows%20of%20young%20rice%20plants%2C%20irrigation%20channels%2C%20golden%20hour%20lighting%2C%20professional%20landscape%20photography%2C%20high%20resolution&width=300&height=300&seq=12&orientation=squarish" 
                      alt="Lahan Padi" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src="https://readdy.ai/api/search-image?query=Indonesian%20farmer%20working%20in%20rice%20field%2C%20tending%20to%20young%20rice%20plants%2C%20wearing%20traditional%20hat%2C%20morning%20light%2C%20documentary%20style%20photography%2C%20high%20resolution&width=300&height=300&seq=13&orientation=squarish" 
                      alt="Petani" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer">
                    <img 
                      src="https://readdy.ai/api/search-image?query=Soil%20testing%20for%20rice%20cultivation%2C%20hands%20holding%20soil%20sample%2C%20testing%20equipment%20nearby%2C%20natural%20lighting%2C%20documentary%20style%20photography%2C%20high%20resolution&width=300&height=300&seq=14&orientation=squarish" 
                      alt="Pengujian Tanah" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">+3 Foto</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 !rounded-button whitespace-nowrap cursor-pointer">
                  <i className="fas fa-plus mr-2"></i>
                  Tambah Foto
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Action Buttons */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-t border-gray-200 dark:border-gray-700 z-40`}>
        <div className="container mx-auto flex justify-between">
          <div className="flex space-x-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="!rounded-button whitespace-nowrap cursor-pointer">
                  <i className="fas fa-trash-alt mr-2"></i>
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Analisis Tanaman?</AlertDialogTitle>
                  <AlertDialogDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
                    Tindakan ini tidak dapat dibatalkan. Data analisis tanaman akan dihapus secara permanen dari sistem.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="!rounded-button whitespace-nowrap">Batal</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600 !rounded-button whitespace-nowrap">Hapus</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
              <i className="fas fa-edit mr-2"></i>
              Edit
            </Button>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
              <i className="fas fa-print mr-2"></i>
              Cetak
            </Button>
            
            <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
              <i className="fas fa-share-alt mr-2"></i>
              Bagikan
            </Button>
            
            <a 
              href="https://readdy.ai/home/85c6cc25-8d34-4817-aa51-d3a0a8153624/dcb5db70-c7c2-4aaf-b741-124bab0125de" 
              data-readdy="true"
            >
              <Button className="!rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-arrow-left mr-2"></i>
                Kembali
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
