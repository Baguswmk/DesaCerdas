import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Loader2, Search, Calendar, Users, Target, MapPin, Clock, Filter, RefreshCw, Heart, Info, TrendingUp, Activity, AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useKegiatanAktif } from "@/hooks/bantuDesa/useKegiatan";
import useThemeStore from "@/store/theme";

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
}

function calculateDaysLeft(endDate) {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
}

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


const BantuDesaKegiatan = () => {
  const { isDarkMode } = useThemeStore();
  const [filters, setFilters] = useState({
    status: "AKTIF",
    search: "",
    page: 1,
    limit: 9
  });

  const { data: response, isLoading, error, refetch } = useKegiatanAktif(filters);
  
  // Properly handle the response structure
  const activities = response?.data?.data || [];
  const total = response?.total || 0;
  const totalPages = Math.ceil(total / filters.limit);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset ke halaman 1 saat filter berubah
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Calculate statistics
  const stats = {
    total: activities.length,
    aktif: activities.filter((k) => k.status === "AKTIF").length,
    selesai: activities.filter((k) => k.status === "SELESAI").length,
    totalTarget: activities.reduce((sum, k) => sum + (k.target_dana || 0), 0),
    totalTerkumpul: activities.reduce((sum, k) => sum + (k.dana_terkumpul || 0), 0),
  };

  return (
    <section id="kegiatan-section" className={`py-20 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className={`text-5xl py-4 md:text-6xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent`}>
                Kegiatan Desa
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto mt-2" />
            </div>
          </div>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Bergabunglah dalam berbagai kegiatan desa yang sedang berlangsung dan butuh dukungan Anda untuk kemajuan bersama
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "Total Kegiatan",
              value: stats.total,
              icon: Activity,
              color: "from-emerald-400 to-emerald-500",
              bgColor: "bg-emerald-100",
              textColor: "text-emerald-600",
              description: "Semua kegiatan",
            },
            {
              title: "Sedang Aktif",
              value: stats.aktif,
              icon: TrendingUp,
              color: "from-emerald-400 to-emerald-500",
              bgColor: "bg-emerald-100",
              textColor: "text-emerald-600",
              description: "Berjalan",
            },
            {
              title: "Target Dana",
              value: formatCurrency(stats.totalTarget).replace("Rp", "").trim(),
              icon: Target,
              color: "from-green-400 to-green-500",
              bgColor: "bg-green-100",
              textColor: "text-green-600",
              description: "Total target",
              isAmount: true,
            },
            {
              title: "Dana Terkumpul",
              value: formatCurrency(stats.totalTerkumpul).replace("Rp", "").trim(),
              icon: Users,
              color: "from-emerald-400 to-green-500",
              bgColor: "bg-emerald-100",
              textColor: "text-emerald-600",
              description: "Terkumpul",
              isAmount: true,
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                isDarkMode
                  ? "bg-gray-800/50 backdrop-blur-sm"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p
                      className={`text-xs font-bold uppercase tracking-wide ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {stat.title}
                    </p>
                    <p
                      className={`text-xl md:text-2xl font-black mt-2 ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {stat.isAmount ? `${stat.value}` : stat.value.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs mt-1 font-medium ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${stat.bgColor} transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Filter Section */}
        <Card
          className={`border-0 shadow-xl mb-8 ${
            isDarkMode
              ? "bg-gray-800/50 backdrop-blur-sm"
              : "bg-white/80 backdrop-blur-sm"
          }`}
        >
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Filter & Pencarian
                </h3>
              </div>

              <form onSubmit={handleSearchSubmit} className="flex gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="🔍 Cari kegiatan berdasarkan judul, deskripsi, atau lokasi..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className={`pl-12 pr-4 py-3 text-base !rounded-xl border-2 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 focus:border-emerald-500"
                        : "bg-white border-gray-300 focus:border-emerald-500"
                    } shadow-lg focus:shadow-xl`}
                  />
                </div>
                <Button type="submit" className="!rounded-xl px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              
              <div className="flex gap-3">
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger className={`w-48 !rounded-xl py-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} shadow-lg`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AKTIF">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                         🚀 Aktif
                      </span>
                    </SelectItem>
                    <SelectItem value="SELESAI">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ✅ Selesai
                      </span>
                    </SelectItem>
                    <SelectItem value="DIBATALKAN">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        ❌ Dibatalkan
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="!rounded-xl px-6 py-3 border-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        {!isLoading && !error && (
          <div className={`mb-8 p-6 rounded-2xl shadow-lg ${
            isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <div className="flex flex-wrap gap-6 items-center text-sm font-medium">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Total: <span className="font-bold text-green-600">{total}</span> kegiatan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Halaman: <span className="font-bold text-green-600">{filters.page}</span> dari <span className="font-bold text-green-600">{totalPages || 1}</span>
                </span>
              </div>
              {filters.search && (
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-emerald-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Hasil untuk: <span className="font-bold text-emerald-600">"{filters.search}"</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative mb-6">
                <Loader2 className="animate-spin h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-emerald-200 rounded-full animate-pulse mx-auto"></div>
              </div>
              <div className="space-y-2">
                <span className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Memuat data kegiatan...
                </span>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center max-w-md">
              <div className={`p-8 rounded-2xl shadow-2xl ${
                isDarkMode 
                  ? 'bg-gray-800/50 backdrop-blur-sm border border-red-800/20' 
                  : 'bg-white/80 backdrop-blur-sm border border-red-200'
              }`}>
                <div className="relative mb-6">
                  <div className="p-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full mx-auto w-fit">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Gagal Memuat Data
                </h3>
                <p className={`text-sm mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {error.response?.data?.message || error.message || "Terjadi kesalahan saat memuat data kegiatan"}
                </p>
                <Button 
                  onClick={() => refetch()} 
                  className="!rounded-xl px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && activities.length === 0 && (
          <div className="text-center py-20">
            <div className={`max-w-md mx-auto p-8 rounded-2xl shadow-2xl ${
              isDarkMode 
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
                : 'bg-white/80 backdrop-blur-sm border border-gray-200'
            }`}>
              <div className="text-6xl mb-6">🎯</div>
              <h3 className={`text-xl font-bold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Tidak ada kegiatan ditemukan
              </h3>
              <p className={`text-sm mb-6 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {filters.search 
                  ? `Tidak ada kegiatan yang cocok dengan pencarian "${filters.search}"`
                  : "Belum ada kegiatan yang tersedia saat ini"
                }
              </p>
              {filters.search && (
                <Button 
                  onClick={() => handleFilterChange('search', '')}
                  variant="outline"
                  className="!rounded-xl hover:scale-105 transition-all duration-200"
                >
                  Hapus Filter
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Kegiatan Grid */}
        {!isLoading && !error && activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {activities.map((activity, index) => {
              const daysLeft = calculateDaysLeft(activity.tanggal_selesai);
              const progressPercentage = activity.progress_percentage || 
                (activity.target_dana > 0 ? Math.round((activity.dana_terkumpul / activity.target_dana) * 100) : 0);
              
              return (
                <Card 
                  key={activity.id}
                  className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={activity.foto_url || `https://readdy.ai/api/search-image?query=Indonesian%20village%20community%20activity&width=400&height=200&seq=${activity.id}&orientation=landscape`}
                      alt={activity.judul}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = `https://readdy.ai/api/search-image?query=Indonesian%20village%20community%20activity&width=400&height=200&seq=fallback&orientation=landscape`;
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        activity.status === 'AKTIF' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : activity.status === 'SELESAI'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    {daysLeft > 0 && daysLeft <= 7 && activity.status === 'AKTIF' && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          Segera Berakhir
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {activity.judul}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(activity.tanggal_mulai).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      
                      <div className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Users className="h-4 w-4 mr-2" />
                        {activity.jumlah_donatur || 0} donatur
                      </div>
                      
                      {daysLeft > 0 ? (
                        <div className={`flex items-center text-sm ${
                          daysLeft <= 7 ? 'text-orange-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <i className="fas fa-clock mr-2"></i>
                          Sisa {daysLeft} hari
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-red-500">
                          <i className="fas fa-times-circle mr-2"></i>
                          Sudah berakhir
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-4 line-clamp-3 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {activity.deskripsi}
                    </p>
                    
                    <div className="mb-6">
                      <div className={`flex justify-between text-sm mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span>Terkumpul:</span>
                        <span className="font-medium">
                          {formatCurrency(activity.dana_terkumpul || 0)}
                        </span>
                      </div>
                      <div className={`flex justify-between text-sm mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span>Target:</span>
                        <span className="font-medium">
                          {formatCurrency(activity.target_dana)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(progressPercentage, 100)}
                        className="h-3 mb-2"
                      />
                      <div className={`text-xs text-right ${
                        progressPercentage >= 100 
                          ? 'text-emerald-600 font-medium' 
                          : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {progressPercentage.toFixed(1)}% tercapai
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Link to={`/bantu-desa/detail/${activity.id}`} className="flex-1">
                        <Button 
                          className="w-full !rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" 
                          size="sm"
                          disabled={activity.status !== 'AKTIF'}
                        >
                          <i className="fas fa-heart mr-2"></i>
                          {activity.status === 'AKTIF' ? 'Donasi' : 'Lihat Detail'}
                        </Button>
                      </Link>
                      <Link to={`/bantu-desa/detail/${activity.id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full !rounded-xl border-2 hover:border-emerald-500" 
                          size="sm"
                        >
                          <i className="fas fa-info-circle mr-2"></i>
                          Detail
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && activities.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              disabled={filters.page <= 1}
              onClick={() => handlePageChange(filters.page - 1)}
              className="!rounded-xl"
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Sebelumnya
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (filters.page <= 3) {
                  pageNum = i + 1;
                } else if (filters.page > totalPages - 3) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = filters.page - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={filters.page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={`!rounded-xl w-10 ${
                      filters.page === pageNum 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                        : ''
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              disabled={filters.page >= totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
              className="!rounded-xl"
            >
              Selanjutnya
              <i className="fas fa-chevron-right ml-2"></i>
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-400/5 via-green-500/5 to-emerald-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-green-400/5 via-emerald-500/5 to-green-600/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/20 rounded-full animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
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
      `}</style>
    </section>
  );
};

export default BantuDesaKegiatan;