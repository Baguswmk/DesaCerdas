import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Calendar, Users, Target, MapPin, Clock, Eye } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import DetailHero from "@/components/bantuDesa/detailKegiatan/DetailHero";
import DetailInformasi from "@/components/bantuDesa/detailKegiatan/DetailInformasi";
import DonasiProgress from "@/components/bantuDesa/detailKegiatan/DonasiProgress";
import InformasiKontak from "@/components/bantuDesa/detailKegiatan/InformasiKontak";
import Footer from "@/components/Footer";
import useThemeStore from "@/store/theme";
import { useDetailKegiatan } from "@/hooks/bantuDesa/useKegiatan";

// Utility function untuk safe JSON parsing
const safeJSONParse = (jsonString, fallback = null) => {
  try {
    if (!jsonString || jsonString.trim() === '') {
      return fallback;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', jsonString, error);
    return fallback;
  }
};

const DetailKegiatanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  
  const { data: kegiatan, isLoading, error } = useDetailKegiatan(id);

  // Debug log
  console.log('Detail kegiatan data:', kegiatan);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20"
      }`}>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="relative">
                <Loader2 className="animate-spin h-20 w-20 text-emerald-500 mx-auto mb-6" />
                <div className="absolute inset-0 h-20 w-20 border-4 border-emerald-200 rounded-full animate-pulse mx-auto"></div>
              </div>
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 h-20 w-20 bg-emerald-500 opacity-20 blur-2xl rounded-full mx-auto animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <span className={`text-2xl font-black ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Memuat detail kegiatan...
              </span>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
              </div>
              <div className={`p-6 rounded-2xl backdrop-blur-xl ${
                isDarkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/80 border border-emerald-200/50'
              } shadow-2xl max-w-md mx-auto`}>
                <p className={`text-base font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Sedang mengambil informasi kegiatan yang Anda pilih...
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20"
      }`}>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className={`p-10 rounded-3xl shadow-2xl backdrop-blur-xl border relative overflow-hidden ${
              isDarkMode 
                ? 'bg-gray-800/50 border-red-800/20' 
                : 'bg-white/90 border-red-200/50'
            }`}>
              {/* Error accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-gradient-x"></div>
              
              <div className="relative mb-8">
                <div className="p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl mx-auto w-fit shadow-xl">
                  <i className="fas fa-exclamation-triangle text-4xl text-white"></i>
                </div>
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 bg-red-500 opacity-20 blur-3xl rounded-full"></div>
              </div>
              <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Gagal Memuat Detail Kegiatan
              </h3>
              <p className={`text-base mb-8 leading-relaxed font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {error.response?.data?.message || error.message || "Terjadi kesalahan saat memuat detail kegiatan"}
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 rounded-2xl font-semibold py-3 px-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-700 bg-white/50 hover:bg-emerald-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Kembali
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  className="flex-1 rounded-2xl font-semibold py-3 px-6 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl text-white border border-emerald-500/30"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Muat Ulang
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!kegiatan) {
    return (
      <div className={`min-h-screen ${
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20"
      }`}>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className={`p-10 rounded-3xl shadow-2xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/90 border-emerald-200/50'
            } relative overflow-hidden`}>
              {/* Accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>
              
              <div className="relative mb-8">
                <div className={`p-6 rounded-3xl mx-auto w-fit shadow-xl ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-emerald-100/70'
                }`}>
                  <i className={`fas fa-search text-4xl ${
                    isDarkMode ? 'text-gray-400' : 'text-emerald-500'
                  }`}></i>
                </div>
              </div>
              <h3 className={`text-2xl font-black mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Kegiatan Tidak Ditemukan
              </h3>
              <p className={`text-base mb-8 leading-relaxed font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Kegiatan dengan ID {id} tidak ditemukan atau mungkin sudah dihapus.
              </p>
              <Button 
                onClick={handleBack}
                className="w-full rounded-2xl font-semibold py-3 px-6 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl text-white border border-emerald-500/30"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Safe parsing untuk data JSON
  const jadwal = safeJSONParse(kegiatan.jadwal, []);
  const persyaratan = safeJSONParse(kegiatan.persyaratan, {});
  const galeri = safeJSONParse(kegiatan.galeri, []);

  // Calculate progress percentage if not provided
  const progressPercentage = kegiatan.progress_percentage || 
    (kegiatan.target_dana > 0 
      ? Math.round((kegiatan.dana_terkumpul / kegiatan.target_dana) * 100)
      : 0);

  // Calculate days left
  const daysLeft = kegiatan.tanggal_selesai
    ? Math.max(
        0,
        Math.ceil((new Date(kegiatan.tanggal_selesai).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  // Get category icon
  const getCategoryIcon = (kategori) => {
    const icons = {
      PEMBANGUNAN: "🏗️",
      KESEHATAN: "🏥",
      PENDIDIKAN: "📚",
      LINGKUNGAN: "🌱",
      SOSIAL: "🤝",
      EKONOMI: "💰",
    };
    return icons[kategori] || "📋";
  };

  return (
    <div className={`pt-16 min-h-screen ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20"
    } relative overflow-hidden`}>
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-400/5 via-green-500/5 to-emerald-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-green-400/5 via-emerald-500/5 to-green-600/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>
      
      <Header />
      
      {/* Enhanced Back Button & Title Section */}
      <section className={`py-10 relative ${
        isDarkMode ? 'bg-gray-900/50 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'
      } border-b ${isDarkMode ? 'border-gray-700/50' : 'border-emerald-200/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="flex items-center gap-6">
              <Button
                onClick={handleBack}
                variant="outline"
                className={`rounded-2xl px-6 py-4 border-2 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-xl font-semibold group ${
                  isDarkMode
                    ? "border-gray-600 hover:border-emerald-500 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                    : "border-gray-300 hover:border-emerald-500 bg-white/50 hover:bg-emerald-50/50 text-gray-700 hover:text-emerald-700"
                }`}
              >
                <ArrowLeft className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                Kembali
              </Button>
              
              <div className="flex-1">
                <h1 className={`text-3xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent line-clamp-2`}>
                  {kegiatan.judul}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {getCategoryIcon(kegiatan.kategori)} {kegiatan.kategori}
                  </Badge>
                  <Badge className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                    kegiatan.status === 'AKTIF' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                      : kegiatan.status === 'SELESAI'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  }`}>
                    {kegiatan.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className={`flex flex-wrap gap-4 p-6 rounded-3xl shadow-2xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/80 border-emerald-200/50'
            } relative overflow-hidden`}>
              {/* Accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>
              
              <div className="flex items-center gap-3 text-sm group">
                <div className="p-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Progress
                  </div>
                  <div className="font-black text-xl text-emerald-600">
                    {progressPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm group">
                <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Donatur
                  </div>
                  <div className="font-black text-xl text-blue-600">
                    {kegiatan.jumlah_donatur || 0}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm group">
                <div className="p-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Sisa Waktu
                  </div>
                  <div className={`font-black text-xl ${daysLeft <= 7 ? 'text-orange-600' : 'text-purple-600'}`}>
                    {daysLeft > 0 ? `${daysLeft} hari` : 'Berakhir'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Location and Date Info */}
          {(kegiatan.lokasi || kegiatan.tanggal_mulai) && (
            <div className={`mt-8 p-6 rounded-3xl shadow-xl backdrop-blur-xl border transform hover:scale-102 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/30 border-gray-700/50' 
                : 'bg-white/60 border-emerald-200/50'
            } relative overflow-hidden group`}>
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex flex-wrap gap-8 text-base relative z-10">
                {kegiatan.lokasi && (
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Lokasi</div>
                      <span className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {kegiatan.lokasi}
                      </span>
                    </div>
                  </div>
                )}
                {kegiatan.tanggal_mulai && (
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Periode Kegiatan</div>
                      <span className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {new Date(kegiatan.tanggal_mulai).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })} - {new Date(kegiatan.tanggal_selesai).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced DetailHero with gradient overlay */}
      <div className="relative">
        <DetailHero 
          title={kegiatan.judul} 
          image={kegiatan.foto_url} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>
      
      <DonasiProgress
        terkumpul={kegiatan.dana_terkumpul || 0}
        target={kegiatan.target_dana || 0}
        deadline={kegiatan.tanggal_selesai}
        jumlahDonatur={kegiatan.jumlah_donatur || 0}
        progressPercentage={progressPercentage}
      />
      
      <DetailInformasi
        deskripsi={kegiatan.deskripsi || ''}
        jadwal={jadwal}
        persyaratan={persyaratan}
        galeri={galeri}
      />
      
      <InformasiKontak creator={kegiatan.creator} />
      
      <Footer />

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default DetailKegiatanPage;