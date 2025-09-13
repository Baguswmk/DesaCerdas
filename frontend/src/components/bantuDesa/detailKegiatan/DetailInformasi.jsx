import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { FileText, Calendar, CheckCircle, Images, Clock, MapPin, User, Mail, Phone } from "lucide-react";
import useThemeStore from "@/store/theme";

// Utility function untuk safe JSON parsing
const safeJSONParse = (data, fallback) => {
  try {
    // Jika data sudah berupa tipe yang diinginkan, return as is
    if (Array.isArray(data) && Array.isArray(fallback)) return data;
    if (typeof data === 'object' && data !== null && !Array.isArray(fallback)) return data;
    
    // Jika data berupa string, coba parse
    if (typeof data === 'string' && data.trim() !== '' && data !== 'null') {
      return JSON.parse(data);
    }
    
    return fallback;
  } catch (error) {
    console.warn('Safe JSON parse error:', error, 'Data:', data);
    return fallback;
  }
};

const DetailInformasi = ({ 
  deskripsi = "", 
  jadwal = [], 
  persyaratan = {}, 
  galeri = [] 
}) => {
  const { isDarkMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [selectedImage, setSelectedImage] = useState(null);

  // Safely parse data dengan fallback yang lebih robust
  const safeJadwal = safeJSONParse(jadwal, []);
  const safePersyaratan = safeJSONParse(persyaratan, {});
  const safeGaleri = safeJSONParse(galeri, []);

  // Debug log
  console.log('DetailInformasi props:', { deskripsi, jadwal, persyaratan, galeri });
  console.log('Parsed data:', { safeJadwal, safePersyaratan, safeGaleri });

  const tabIcons = {
    deskripsi: FileText,
    jadwal: Calendar,
    persyaratan: CheckCircle,
    galeri: Images
  };

  return (
    <section className={`py-16 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Informasi Detail
            </h2>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Tab Navigation */}
          <div className="mb-8 flex justify-center">
            <TabsList className={`grid w-full max-w-2xl grid-cols-4 p-2 h-auto rounded-2xl shadow-xl ${
              isDarkMode 
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
                : 'bg-white/80 backdrop-blur-sm border border-gray-200'
            }`}>
              {['deskripsi', 'jadwal', 'persyaratan', 'galeri'].map((tab) => {
                const Icon = tabIcons[tab];
                const isActive = activeTab === tab;
                return (
                  <TabsTrigger 
                    key={tab}
                    value={tab}
                    className={`flex items-center gap-2 !rounded-xl py-3 px-4 font-bold transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                        : isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="capitalize hidden sm:inline">
                      {tab === 'deskripsi' ? 'Deskripsi' : 
                       tab === 'jadwal' ? 'Jadwal' : 
                       tab === 'persyaratan' ? 'Persyaratan' : 'Galeri'}
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
                ? 'bg-gray-800/50 backdrop-blur-sm' 
                : 'bg-white/80 backdrop-blur-sm'
            }`} style={{ animation: 'fadeInUp 0.5s ease-out' }}>
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  {safeJadwal.length > 0 ? (
                    <div className="space-y-4">
                      {safeJadwal.map((item, index) => (
                        <div 
                          key={index} 
                          className={`flex items-start space-x-6 p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                            isDarkMode 
                              ? 'bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600' 
                              : 'bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200'
                          }`}
                          style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                        >
                          <div className="flex-shrink-0">
                            <div className={`w-20 p-3 rounded-xl text-center ${
                              isDarkMode ? 'bg-gray-600' : 'bg-white'
                            } shadow-lg`}>
                              <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                              <div className={`text-sm font-bold ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {item.jam || 'TBA'}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xl font-bold mb-2 ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.judul || 'Kegiatan'}
                            </h4>
                            <p className={`leading-relaxed ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {item.deskripsi || 'Tidak ada deskripsi'}
                            </p>
                            {item.lokasi && (
                              <div className="flex items-center gap-2 mt-3">
                                <MapPin className="h-4 w-4 text-blue-500" />
                                <span className={`text-sm font-medium ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
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
                    <div className="text-center py-12">
                      <div className={`p-8 rounded-2xl ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                      }`}>
                        <Calendar className={`h-16 w-16 mx-auto mb-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <h4 className={`text-xl font-bold mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Belum Ada Jadwal
                        </h4>
                        <p className={`text-lg ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
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
                ? 'bg-gray-800/50 backdrop-blur-sm' 
                : 'bg-white/80 backdrop-blur-sm'
            }`} style={{ animation: 'fadeInUp 0.5s ease-out' }}>
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-3xl font-black ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Persyaratan Partisipasi
                  </h3>
                </div>
                
                <div className="grid gap-8">
                  {["umum", "lomba", "dibawa"].map((kategori, i) => {
                    const items = safePersyaratan[kategori] || [];
                    const title = kategori === "umum" 
                      ? "Persyaratan Umum"
                      : kategori === "lomba"
                      ? "Persyaratan Lomba"
                      : "Yang Perlu Dibawa";

                    const colors = [
                      "from-blue-500 to-blue-600",
                      "from-green-500 to-green-600", 
                      "from-purple-500 to-purple-600"
                    ];

                    return (
                      <div 
                        key={i}
                        className={`p-6 rounded-2xl border ${
                          isDarkMode 
                            ? 'bg-gray-700/30 border-gray-600' 
                            : 'bg-gray-50/50 border-gray-200'
                        }`}
                        style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.2}s both` }}
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`p-2 bg-gradient-to-r ${colors[i]} rounded-xl`}>
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <h4 className={`text-xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {title}
                          </h4>
                        </div>
                        
                        {items.length > 0 ? (
                          <div className="grid gap-3">
                            {items.map((item, j) => (
                              <div 
                                key={j} 
                                className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                                  isDarkMode 
                                    ? 'bg-gray-600/30 hover:bg-gray-600/50' 
                                    : 'bg-white/80 hover:bg-white/90'
                                } shadow-lg`}
                              >
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="p-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  </div>
                                </div>
                                <span className={`font-medium leading-relaxed ${
                                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`text-center py-6 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Tidak ada persyaratan khusus untuk kategori ini.</p>
                          </div>
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
                ? 'bg-gray-800/50 backdrop-blur-sm' 
                : 'bg-white/80 backdrop-blur-sm'
            }`} style={{ animation: 'fadeInUp 0.5s ease-out' }}>
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl">
                    <Images className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-3xl font-black ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Galeri Foto Kegiatan
                  </h3>
                </div>
                
                {safeGaleri.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {safeGaleri.map((image, index) => (
                      <div 
                        key={index} 
                        className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                        onClick={() => setSelectedImage(image)}
                        style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image}
                            alt={`Galeri ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = `https://readdy.ai/api/search-image?query=Indonesian%20village%20activity&width=400&height=400&seq=${index}&orientation=square`;
                            }}
                          />
                        </div>
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Image Number */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 font-bold">
                            #{index + 1}
                          </Badge>
                        </div>
                        
                        {/* View Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                            <Images className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className={`p-8 rounded-2xl ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                    }`}>
                      <Images className={`h-20 w-20 mx-auto mb-6 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <h4 className={`text-2xl font-bold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Belum Ada Galeri
                      </h4>
                      <p className={`text-lg ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
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
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
      `}</style>
    </section>
  );
};

export default DetailInformasi;