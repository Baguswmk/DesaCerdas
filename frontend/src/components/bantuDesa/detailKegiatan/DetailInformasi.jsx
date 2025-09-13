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
  User,
  Mail,
  Phone,
} from "lucide-react";
import useThemeStore from "@/store/theme";

// Utility function untuk safe JSON parsing
const safeJSONParse = (data, fallback) => {
  try {
    // Jika data sudah berupa tipe yang diinginkan, return as is
    if (Array.isArray(data) && Array.isArray(fallback)) return data;
    if (typeof data === "object" && data !== null && !Array.isArray(fallback))
      return data;

    // Jika data berupa string, coba parse
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

  // Safely parse data dengan fallback yang lebih robust
  const safeJadwal = safeJSONParse(jadwal, []);
  const safePersyaratan = safeJSONParse(persyaratan, {});
  const safeGaleri = safeJSONParse(galeri, []);

  // Debug log
  console.log("DetailInformasi props:", {
    deskripsi,
    jadwal,
    persyaratan,
    galeri,
  });
  console.log("Parsed data:", { safeJadwal, safePersyaratan, safeGaleri });

  const tabIcons = {
    deskripsi: FileText,
    jadwal: Calendar,
    persyaratan: CheckCircle,
    galeri: Images,
  };

  return (
    <section
      className={`py-16 relative ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20"
      }`}
    >
      {/* Enhanced floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-400/5 via-green-500/5 to-emerald-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-green-400/5 via-emerald-500/5 to-green-600/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/20 rounded-full animate-float"
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
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Informasi Detail
            </h2>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Tab Navigation */}
          <div className="mb-8 flex justify-center">
            <TabsList
              className={`grid w-full max-w-2xl grid-cols-4 p-2 h-auto rounded-2xl shadow-xl ${
                isDarkMode
                  ? "bg-gray-800/50 backdrop-blur-sm border border-emerald-700/30"
                  : "bg-white/80 backdrop-blur-sm border border-emerald-200/50"
              }`}
            >
              {["deskripsi", "jadwal", "persyaratan", "galeri"].map((tab) => {
                const Icon = tabIcons[tab];
                const isActive = activeTab === tab;
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`flex items-center gap-2 !rounded-xl py-3 px-4 font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg transform scale-105"
                        : isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-emerald-800/20"
                        : "text-gray-600 hover:text-gray-900 hover:bg-emerald-100/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="capitalize hidden sm:inline">
                      {tab === "deskripsi"
                        ? "Deskripsi"
                        : tab === "jadwal"
                        ? "Jadwal"
                        : tab === "persyaratan"
                        ? "Persyaratan"
                        : "Galeri"}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          {/* Deskripsi Tab */}
          <TabsContent value="deskripsi">
            <Card
              className={`border-0 shadow-2xl ${
                isDarkMode
                  ? "bg-gray-800/50 backdrop-blur-sm"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
              style={{ animation: "fadeInUp 0.5s ease-out" }}
            >
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <div
                    className={`prose prose-lg max-w-none ${
                      isDarkMode ? "prose-invert" : ""
                    }`}
                  >
                    <p
                      className={`text-lg leading-relaxed ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {deskripsi ||
                        "Tidak ada deskripsi yang tersedia untuk kegiatan ini."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Jadwal Tab */}
          <TabsContent value="jadwal">
            <Card
              className={`border-0 shadow-2xl ${
                isDarkMode
                  ? "bg-gray-800/50 backdrop-blur-sm"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
              style={{ animation: "fadeInUp 0.5s ease-out" }}
            >
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  {safeJadwal.length > 0 ? (
                    <div className="space-y-4">
                      {safeJadwal.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-start space-x-6 p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                            isDarkMode
                              ? "bg-gray-700/50 hover:bg-gray-700/70 border border-emerald-600/20"
                              : "bg-emerald-50/50 hover:bg-emerald-100/50 border border-emerald-200/50"
                          }`}
                          style={{
                            animation: `fadeInUp 0.6s ease-out ${
                              index * 0.1
                            }s both`,
                          }}
                        >
                          <div className="flex-shrink-0">
                            <div
                              className={`w-20 p-3 rounded-xl text-center ${
                                isDarkMode ? "bg-emerald-800/50" : "bg-white"
                              } shadow-lg border border-emerald-500/30`}
                            >
                              <Clock className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                              <div
                                className={`text-sm font-bold ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {item.jam || "TBA"}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-xl font-bold mb-2 ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {item.judul || "Kegiatan"}
                            </h4>
                            <p
                              className={`leading-relaxed ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {item.deskripsi || "Tidak ada deskripsi"}
                            </p>
                            {item.lokasi && (
                              <div className="flex items-center gap-2 mt-3">
                                <MapPin className="h-4 w-4 text-emerald-500" />
                                <span
                                  className={`text-sm font-medium ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {item.lokasi}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div
                        className={`p-8 rounded-2xl ${
                          isDarkMode ? "bg-gray-700/50" : "bg-emerald-100/50"
                        }`}
                      >
                        <Calendar
                          className={`h-16 w-16 mx-auto mb-4 ${
                            isDarkMode ? "text-gray-400" : "text-emerald-500"
                          }`}
                        />
                        <h4
                          className={`text-xl font-bold mb-2 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Belum Ada Jadwal
                        </h4>
                        <p
                          className={`text-lg ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Jadwal acara belum tersedia.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="persyaratan" className="space-y-6">
            <Card
              className={`border-0 shadow-2xl ${
                isDarkMode
                  ? "bg-gray-800/50 backdrop-blur-sm"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
              style={{ animation: "fadeInUp 0.5s ease-out" }}
            >
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3
                    className={`text-3xl font-black ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Persyaratan Partisipasi
                  </h3>
                </div>

                <div className="grid gap-8">
                  {["umum", "lomba", "dibawa"].map((kategori, i) => {
                    const items = safePersyaratan[kategori] || [];
                    const title =
                      kategori === "umum"
                        ? "Persyaratan Umum"
                        : kategori === "lomba"
                        ? "Persyaratan Lomba"
                        : "Yang Perlu Dibawa";

                    const colors = [
                      "from-emerald-500 to-emerald-600",
                      "from-green-500 to-green-600",
                      "from-emerald-600 to-green-600",
                    ];

                    return (
                      <div
                        key={i}
                        className={`p-6 rounded-2xl border ${
                          isDarkMode
                            ? "bg-gray-700/30 border-emerald-600/20"
                            : "bg-emerald-50/50 border-emerald-200/50"
                        }`}
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${i * 0.2}s both`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className={`p-2 bg-gradient-to-r ${colors[i]} rounded-xl`}
                          >
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <h4
                            className={`text-xl font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {title}
                          </h4>
                        </div>

                        {items.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-2">
                            {items.map((item, j) => (
                              <li
                                key={j}
                                className={`${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p
                            className={`italic ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
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
            <Card
              className={`border-0 shadow-2xl ${
                isDarkMode
                  ? "bg-gray-800/50 backdrop-blur-sm"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
              style={{ animation: "fadeInUp 0.5s ease-out" }}
            >
              <CardContent className="p-8 md:p-12">
                {safeGaleri.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {safeGaleri.map((img, i) => (
                      <div
                        key={i}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Galeri ${i + 1}`}
                          className="rounded-2xl object-cover w-full h-40 shadow-lg group-hover:opacity-80 transition"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div
                      className={`p-8 rounded-2xl ${
                        isDarkMode ? "bg-gray-700/50" : "bg-emerald-100/50"
                      }`}
                    >
                      <Images
                        className={`h-20 w-20 mx-auto mb-6 ${
                          isDarkMode ? "text-gray-400" : "text-emerald-500"
                        }`}
                      />
                      <h4
                        className={`text-2xl font-bold mb-4 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Belum Ada Galeri
                      </h4>
                      <p
                        className={`text-lg ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] mx-4">
              <img
                src={selectedImage}
                alt="Galeri Detail"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
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
          0%,
          100% {
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
      `}</style>
    </section>
  );
};

export default DetailInformasi;
