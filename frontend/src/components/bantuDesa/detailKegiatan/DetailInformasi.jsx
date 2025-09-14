import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  FileText,
  Calendar,
  CheckCircle,
  Images,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import useThemeStore from "@/store/theme";

// Utility function untuk safe JSON parsing
const safeJSONParse = (data, fallback) => {
  try {
    if (Array.isArray(data) && Array.isArray(fallback)) return data;
    if (typeof data === "object" && data !== null && !Array.isArray(fallback))
      return data;

    if (typeof data === "string" && data.trim() !== "" && data !== "null") {
      return JSON.parse(data);
    }

    return fallback;
  } catch (error) {
    console.warn("Safe JSON parse error:", error, "Data:", data);
    return fallback;
  }
};

const DetailInformasi = ({
  deskripsi = "",
  jadwal = [],
  persyaratan = {},
  galeri = [],
}) => {
  const { isDarkMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [selectedImage, setSelectedImage] = useState(null);

  // Safely parse data
  const safeJadwal = safeJSONParse(jadwal, []);
  const safePersyaratan = safeJSONParse(persyaratan, {});
  const safeGaleri = safeJSONParse(galeri, []);

  const tabIcons = {
    deskripsi: FileText,
    jadwal: Calendar,
    persyaratan: CheckCircle,
    galeri: Images,
  };

  const tabLabels = {
    deskripsi: "Deskripsi",
    jadwal: "Jadwal",
    persyaratan: "Persyaratan",
    galeri: "Galeri",
  };

  return (
    <section className={`py-8 sm:py-12 lg:py-16 relative min-h-screen ${
      isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20"
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 sm:left-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-emerald-400/5 via-green-500/5 to-emerald-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-4 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-80 lg:h-80 bg-gradient-to-r from-green-400/5 via-emerald-500/5 to-green-600/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-emerald-400/20 rounded-full animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-center ${
              isDarkMode 
                ? "bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
            }`}>
              Informasi Detail
            </h2>
          </div>
          <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <TabsList className={`grid w-full max-w-4xl grid-cols-4 p-1 gap-2 sm:p-2 h-auto rounded-2xl shadow-xl ${
              isDarkMode
                ? "bg-gray-800/50 backdrop-blur-sm border border-emerald-700/30"
                : "bg-white/80 backdrop-blur-sm border border-emerald-200/50"
            }`}>
              {["deskripsi", "jadwal", "persyaratan", "galeri"].map((tab) => {
                const Icon = tabIcons[tab];
                const isActive = activeTab === tab;
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 !rounded-xl py-2 sm:py-3 px-2 sm:px-4 font-bold transition-all duration-300 min-h-[60px] sm:min-h-auto ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg transform scale-105"
                        : isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-emerald-800/20"
                        : "text-gray-600 hover:text-gray-900 hover:bg-emerald-100/50"
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm text-center">
                      {tabLabels[tab]}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          
          {/* Deskripsi Tab */}
          <TabsContent value="deskripsi">
            <Card className={`border-0 shadow-2xl ${
              isDarkMode
                ? "bg-gray-800/50 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm"
            }`}>
              <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
                <div className="space-y-6">
                  <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                    <p className={`text-base sm:text-lg leading-relaxed ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {deskripsi || "Tidak ada deskripsi yang tersedia untuk kegiatan ini."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jadwal Tab */}
          <TabsContent value="jadwal">
            <Card className={`border-0 shadow-2xl ${
              isDarkMode
                ? "bg-gray-800/50 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm"
            }`}>
              <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
                <div className="space-y-4 sm:space-y-6">
                  {safeJadwal.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {safeJadwal.map((item, index) => (
                        <div
                          key={index}
                          className={`flex flex-col lg:flex-row items-start space-y-3 lg:space-y-0 lg:space-x-6 p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                            isDarkMode
                              ? "bg-gray-700/50 hover:bg-gray-700/70 border border-emerald-600/20"
                              : "bg-emerald-50/50 hover:bg-emerald-100/50 border border-emerald-200/50"
                          }`}
                        >
                          <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:block">
                            <div className={`w-16 sm:w-20 p-2 sm:p-3 rounded-xl text-center shadow-lg border border-emerald-500/30 ${
                              isDarkMode ? "bg-emerald-800/50" : "bg-white"
                            }`}>
                              <Clock className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 text-emerald-500" />
                              <div className={`text-xs sm:text-sm font-bold ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}>
                                {item.jam || "TBA"}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 text-center lg:text-left">
                            <h4 className={`text-lg sm:text-xl font-bold mb-2 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}>
                              {item.judul || "Kegiatan"}
                            </h4>
                            <p className={`leading-relaxed text-sm sm:text-base mb-3 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}>
                              {item.deskripsi || "Tidak ada deskripsi"}
                            </p>
                            {item.lokasi && (
                              <div className="flex items-center justify-center lg:justify-start gap-2">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                                <span className={`text-xs sm:text-sm font-medium ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}>
                                  {item.lokasi}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className={`p-6 sm:p-8 rounded-2xl ${
                        isDarkMode ? "bg-gray-700/50" : "bg-emerald-100/50"
                      }`}>
                        <Calendar className={`h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 ${
                          isDarkMode ? "text-gray-400" : "text-emerald-500"
                        }`} />
                        <h4 className={`text-lg sm:text-xl font-bold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Belum Ada Jadwal
                        </h4>
                        <p className={`text-base sm:text-lg ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                          Jadwal acara belum tersedia.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Persyaratan Tab */}
          <TabsContent value="persyaratan" className="space-y-6">
            <Card className={`border-0 shadow-2xl ${
              isDarkMode
                ? "bg-gray-800/50 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm"
            }`}>
              <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className={`text-xl sm:text-2xl lg:text-3xl font-black text-center sm:text-left ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Persyaratan Partisipasi
                  </h3>
                </div>

                <div className="grid gap-6 sm:gap-8">
                  {["umum", "lomba", "dibawa"].map((kategori, i) => {
                    const items = safePersyaratan[kategori] || [];
                    const titles = {
                      umum: "Persyaratan Umum",
                      lomba: "Persyaratan Lomba", 
                      dibawa: "Yang Perlu Dibawa"
                    };

                    const colors = [
                      "from-emerald-500 to-emerald-600",
                      "from-green-500 to-green-600",
                      "from-emerald-600 to-green-600",
                    ];

                    return (
                      <div
                        key={i}
                        className={`p-4 sm:p-6 rounded-2xl border ${
                          isDarkMode
                            ? "bg-gray-700/30 border-emerald-600/20"
                            : "bg-emerald-50/50 border-emerald-200/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                          <div className={`p-2 bg-gradient-to-r ${colors[i]} rounded-xl`}>
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <h4 className={`text-lg sm:text-xl font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {titles[kategori]}
                          </h4>
                        </div>

                        {items.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-2">
                            {items.map((item, j) => (
                              <li
                                key={j}
                                className={`text-sm sm:text-base ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className={`italic text-sm sm:text-base ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            Tidak ada persyaratan untuk kategori ini.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Galeri Tab */}
          <TabsContent value="galeri" className="space-y-6">
            <Card className={`border-0 shadow-2xl ${
              isDarkMode
                ? "bg-gray-800/50 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm"
            }`}>
              <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
                {safeGaleri.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {safeGaleri.map((img, i) => (
                      <div
                        key={i}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Galeri ${i + 1}`}
                          className="rounded-2xl object-cover w-full h-32 sm:h-40 lg:h-48 shadow-lg group-hover:opacity-80 transition-all duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Images className="h-8 w-8 text-white drop-shadow-lg" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <div className={`p-6 sm:p-8 rounded-2xl ${
                      isDarkMode ? "bg-gray-700/50" : "bg-emerald-100/50"
                    }`}>
                      <Images className={`h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 ${
                        isDarkMode ? "text-gray-400" : "text-emerald-500"
                      }`} />
                      <h4 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        Belum Ada Galeri
                      </h4>
                      <p className={`text-base sm:text-lg ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Belum ada foto galeri untuk kegiatan ini.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] mx-auto">
              <img
                src={selectedImage}
                alt="Galeri Detail"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
                aria-label="Tutup gambar"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          33% {
            transform: translateY(-10px) rotate(5deg);
            opacity: 1;
          }
          66% {
            transform: translateY(-5px) rotate(-5deg);
            opacity: 0.8;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        /* Improve mobile responsiveness for tabs */
        @media (max-width: 640px) {
          .grid-cols-4 > * {
            min-height: 60px;
            padding: 0.5rem;
          }
        }

        /* Ensure proper text wrapping in cards */
        @media (max-width: 768px) {
          .prose {
            font-size: 0.875rem;
            line-height: 1.5;
          }
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-pulse-slow,
          .transition-all,
          .hover\\:scale-105 {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default DetailInformasi;