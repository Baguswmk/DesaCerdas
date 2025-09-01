import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Loader2, Search, Calendar, Users, Target, MapPin } from "lucide-react";
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

const BantuDesaKegiatan = () => {
  const { isDarkMode } = useThemeStore();
  const [filters, setFilters] = useState({
    status: "AKTIF",
    search: "",
    page: 1,
    limit: 9
  });

  const { data: response, isLoading, error, refetch } = useKegiatanAktif(filters);
  
  // Fix: Handle BE response structure properly
  const activities = response?.data || [];
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

  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Kegiatan Desa
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Bergabunglah dalam berbagai kegiatan desa yang sedang berlangsung dan butuh dukungan Anda
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari kegiatan..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}
              />
            </div>
            <Button type="submit" size="icon" className="!rounded-button">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="flex gap-2">
            <Select 
              value={filters.status} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className={`w-40 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AKTIF">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Aktif
                  </span>
                </SelectItem>
                <SelectItem value="SELESAI">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Selesai
                  </span>
                </SelectItem>
                <SelectItem value="DIBATALKAN">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Dibatalkan
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="!rounded-button"
            >
              <i className="fas fa-refresh mr-2"></i>
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Info */}
        {!isLoading && !error && (
          <div className={`mb-6 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Total: {total} kegiatan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Halaman: {filters.page} dari {totalPages}
                </span>
              </div>
              {filters.search && (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-orange-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Hasil untuk: "{filters.search}"
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
              <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" />
              <span className="text-lg font-medium">Memuat data kegiatan...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className={`max-w-md mx-auto p-6 rounded-lg ${
              isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="text-red-500 mb-4">
                <i className="fas fa-exclamation-circle text-3xl"></i>
              </div>
              <h3 className="text-lg font-medium mb-2 text-red-600">
                Gagal Memuat Data
              </h3>
              <p className="text-red-500 mb-4 text-sm">
                {error.response?.data?.message || "Terjadi kesalahan saat memuat data kegiatan"}
              </p>
              <Button onClick={() => refetch()} className="!rounded-button">
                <i className="fas fa-refresh mr-2"></i>
                Coba Lagi
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && activities.length === 0 && (
          <div className="text-center py-20">
            <div className={`max-w-md mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div className="mb-6">
                <i className="fas fa-search text-6xl opacity-50"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">
                Tidak ada kegiatan ditemukan
              </h3>
              <p className="text-sm mb-6">
                {filters.search 
                  ? `Tidak ada kegiatan yang cocok dengan pencarian "${filters.search}"`
                  : "Belum ada kegiatan yang tersedia saat ini"
                }
              </p>
              {filters.search && (
                <Button 
                  onClick={() => handleFilterChange('search', '')}
                  variant="outline"
                  className="!rounded-button"
                >
                  Hapus Filter
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Kegiatan Grid */}
        {!isLoading && !error && activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {activities.map((activity) => {
              const daysLeft = calculateDaysLeft(activity.tanggal_selesai);
              const progressPercentage = activity.progress_percentage || 0;
              
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
                        e.target.src = `https://readdy.ai/api/search-image?query=Indonesian%20village%20community%20activity&width=400&height=200&seq=${activity.id}&orientation=landscape`;
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        activity.status === 'AKTIF' 
                          ? 'bg-green-100 text-green-800' 
                          : activity.status === 'SELESAI'
                          ? 'bg-blue-100 text-blue-800'
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
                    <h3 className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors ${
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
                          ? 'text-green-600 font-medium' 
                          : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {progressPercentage.toFixed(1)}% tercapai
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Link to={`/bantu-desa/detail/${activity.id}`} className="flex-1">
                        <Button 
                          className="w-full !rounded-button" 
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
                          className="w-full !rounded-button" 
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
              className="!rounded-button"
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
                    className="!rounded-button w-10"
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
              className="!rounded-button"
            >
              Selanjutnya
              <i className="fas fa-chevron-right ml-2"></i>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BantuDesaKegiatan;