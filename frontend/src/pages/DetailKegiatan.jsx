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
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative mb-6">
              <Loader2 className="animate-spin h-16 w-16 text-primary mx-auto mb-4" />
              <div className="absolute inset-0 h-16 w-16 border-4 border-blue-200 rounded-full animate-pulse mx-auto"></div>
            </div>
            <div className="space-y-2">
              <span className={`text-xl font-bold ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Memuat detail kegiatan...
              </span>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
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
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className={`p-8 rounded-2xl shadow-2xl ${
              isDarkMode 
                ? 'bg-gray-800/50 backdrop-blur-sm border border-red-800/20' 
                : 'bg-white/80 backdrop-blur-sm border border-red-200'
            }`}>
              <div className="relative mb-6">
                <div className="p-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full mx-auto w-fit">
                  <i className="fas fa-exclamation-circle text-3xl text-white"></i>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Gagal Memuat Detail Kegiatan
              </h3>
              <p className={`text-sm mb-6 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {error.response?.data?.message || error.message || "Terjadi kesalahan saat memuat detail kegiatan"}
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 !rounded-xl font-medium hover:scale-105 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  className="flex-1 !rounded-xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200"
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
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className={`p-8 rounded-2xl shadow-2xl ${
              isDarkMode 
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
                : 'bg-white/80 backdrop-blur-sm border border-gray-200'
            }`}>
              <div className="relative mb-6">
                <div className={`p-4 rounded-full mx-auto w-fit ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <i className={`fas fa-search text-3xl ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}></i>
                </div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Kegiatan Tidak Ditemukan
              </h3>
              <p className={`text-sm mb-6 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Kegiatan dengan ID {id} tidak ditemukan atau mungkin sudah dihapus.
              </p>
              <Button 
                onClick={handleBack}
                className="w-full !rounded-xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
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
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      <Header />
      
      {/* Back Button & Title Section */}
      <section className={`py-8 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className={`!rounded-xl px-4 py-3 border-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                  isDarkMode
                    ? "border-gray-600 hover:border-gray-500 bg-gray-800/50 backdrop-blur-sm"
                    : "border-gray-300 hover:border-gray-400 bg-white/50 backdrop-blur-sm"
                }`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              
                <h1 className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent line-clamp-2`}>
                  {kegiatan.judul}
                </h1>
            </div>

            {/* Quick Stats */}
            <div className={`flex flex-wrap gap-4 p-4 rounded-2xl shadow-lg ${
              isDarkMode 
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
                : 'bg-white/80 backdrop-blur-sm border border-gray-200'
            }`}>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Progress
                  </div>
                  <div className="font-bold text-green-600">
                    {progressPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Donatur
                  </div>
                  <div className="font-bold text-blue-600">
                    {kegiatan.jumlah_donatur || 0}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Sisa Waktu
                  </div>
                  <div className={`font-bold ${daysLeft <= 7 ? 'text-orange-600' : 'text-purple-600'}`}>
                    {daysLeft > 0 ? `${daysLeft} hari` : 'Berakhir'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location and Date Info */}
          {(kegiatan.lokasi || kegiatan.tanggal_mulai) && (
            <div className={`mt-6 p-4 rounded-2xl shadow-lg ${
              isDarkMode 
                ? 'bg-gray-800/30 backdrop-blur-sm border border-gray-700/50' 
                : 'bg-white/60 backdrop-blur-sm border border-gray-200/50'
            }`}>
              <div className="flex flex-wrap gap-6 text-sm">
                {kegiatan.lokasi && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {kegiatan.lokasi}
                    </span>
                  </div>
                )}
                {kegiatan.tanggal_mulai && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DetailKegiatanPage;