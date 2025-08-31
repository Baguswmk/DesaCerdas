import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Loader2, Search } from "lucide-react";
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

const BantuDesaKegiatan = () => {
  const { isDarkMode } = useThemeStore();
  const [filters, setFilters] = useState({
    status: "AKTIF",
    search: "",
    page: 1,
    limit: 9
  });

  const { data: response, isLoading, error } = useKegiatanAktif(filters);
  const activities = response?.data || [];

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

  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Kegiatan Aktif
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
            <Input
              placeholder="Cari kegiatan..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}
            />
            <Button type="submit" size="icon" className="!rounded-button">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className={`w-40 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AKTIF">Aktif</SelectItem>
              <SelectItem value="SELESAI">Selesai</SelectItem>
              <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-primary mr-3" />
            <span className="text-base">Memuat data kegiatan...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">
              {error.response?.data?.message || "Gagal memuat data kegiatan"}
            </p>
            <Button onClick={() => window.location.reload()}>
              Muat Ulang
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && activities.length === 0 && (
          <div className="text-center py-20">
            <h3 className={`text-xl font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Tidak ada kegiatan ditemukan
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              {filters.search 
                ? `Tidak ada kegiatan yang cocok dengan pencarian "${filters.search}"`
                : "Belum ada kegiatan yang tersedia saat ini"
              }
            </p>
          </div>
        )}

        {/* Kegiatan Grid */}
        {!isLoading && !error && activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <Card 
                key={activity.id} 
                className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white hover:shadow-xl'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.foto_url || "https://via.placeholder.com/400x200?text=No+Image"}
                    alt={activity.judul}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
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
                </div>
                
                <CardContent className="p-6">
                  <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {activity.judul}
                  </h3>
                  
                  <div className={`flex items-center text-sm mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <i className="fas fa-calendar mr-2"></i>
                    {new Date(activity.tanggal_mulai).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  
                  <p className={`text-sm mb-4 line-clamp-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {activity.deskripsi}
                  </p>
                  
                  <div className="mb-4">
                    <div className={`flex justify-between text-sm mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <span>Terkumpul: {formatCurrency(activity.dana_terkumpul || 0)}</span>
                      <span>Target: {formatCurrency(activity.target_dana)}</span>
                    </div>
                    <Progress
                      value={activity.progress_percentage || 0}
                      className="h-2"
                    />
                    <div className={`text-xs mt-1 text-right ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {activity.progress_percentage?.toFixed(1) || 0}% tercapai
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button className="flex-1 !rounded-button" size="sm">
                      <i className="fas fa-heart mr-2"></i>
                      Donasi
                    </Button>
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
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && activities.length > 0 && response?.pagination && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              disabled={filters.page <= 1}
              onClick={() => handleFilterChange('page', filters.page - 1)}
              className="!rounded-button"
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Sebelumnya
            </Button>
            
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Halaman {filters.page} dari {response.pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              disabled={filters.page >= response.pagination.totalPages}
              onClick={() => handleFilterChange('page', filters.page + 1)}
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
