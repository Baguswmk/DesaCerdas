import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminDashboardDonasi from "@/components/admin/AdminDashboardDonasi";
import AdminDashboardKegiatan from "@/components/admin/AdminDashboardKegiatan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Activity,
  TrendingUp,
  Calendar,
  Settings,
  FileText,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useKegiatanAktif } from "@/hooks/bantuDesa/useKegiatan";
import { useDonasiPending } from "@/hooks/bantuDesa/useDonasi";
import useThemeStore from "@/store/theme";
import useAuthStore from "@/store/auth";
import useBantuDesaStore from "@/store/bantuDesaStore";
import { Navigate } from "react-router-dom";

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

const AdminDashboard = () => {
  const { isDarkMode } = useThemeStore();
  const { user, isLoggedIn } = useAuthStore();
  const { dashboardStats, calculateDashboardStats } = useBantuDesaStore();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: kegiatanResponse, isLoading: loadingKegiatan } = useKegiatanAktif({ limit: 100 });
  const { data: donasiData, isLoading: loadingDonasi } = useDonasiPending();
  
  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const kegiatan = kegiatanResponse?.data.data || [];
  const donasi = donasiData?.data || [];

  
  useEffect(() => {
    if (kegiatan.length > 0 || donasi.length > 0) {
      calculateDashboardStats();
    }
  }, [kegiatan, donasi, calculateDashboardStats]);

  
  const stats = {
    totalKegiatan: kegiatan?.length,
    kegiatanAktif: kegiatan?.filter(k => k.status === 'AKTIF').length,
    kegiatanSelesai: kegiatan?.filter(k => k.status === 'SELESAI').length,
    totalDonasi: donasi?.length,
    donasiPending: donasi?.filter(d => d.status === 'AKTIF').length,
    donasiApproved: donasi?.filter(d => d.status === 'APPROVED').length,
    totalDanaTermasuk: donasi?.filter(d => d.status === 'APPROVED').reduce((sum, d) => sum + d.amount, 0),
    totalDanaPending: donasi?.filter(d => d.status === 'PENDING').reduce((sum, d) => sum + d.amount, 0)
  };

  const recentDonasi = donasi?.slice(0, 5);
  const recentKegiatan = kegiatan?.slice(0, 5);

  const isLoading = loadingKegiatan || loadingDonasi;
  
  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-gray-50 via-emerald-50/20 to-green-50/30"
    }`}>
      <div className="pb-16"><Header /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className={`mb-8 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border transform hover:scale-102 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50' 
            : 'bg-white/80 border-emerald-200/50'
        } relative overflow-hidden`}>
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-2xl shadow-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-4xl font-black ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } mb-2`}>
                  Dashboard Admin
                </h1>
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Kelola kegiatan desa dan verifikasi donasi masyarakat
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full grid-cols-4 p-2 h-auto rounded-2xl shadow-xl backdrop-blur-xl border ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/80 border-emerald-200/50'
          }`}>
            <TabsTrigger 
              value="overview"
              className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:via-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transform hover:scale-105"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="donasi"
              className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:via-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transform hover:scale-105"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Kelola Donasi
            </TabsTrigger>
            <TabsTrigger 
              value="kegiatan"
              className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:via-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transform hover:scale-105"
            >
              <Activity className="h-4 w-4 mr-2" />
              Kelola Kegiatan
            </TabsTrigger>
            <TabsTrigger 
              value="laporan"
              className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:via-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transform hover:scale-105"
            >
              <FileText className="h-4 w-4 mr-2" />
              Laporan
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8 mt-8">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <div className="absolute inset-0 h-16 w-16 border-4 border-emerald-200 rounded-full animate-pulse mx-auto"></div>
                  </div>
                  <div className="space-y-3">
                    <span className={`text-xl font-bold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      Memuat data dashboard...
                    </span>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Enhanced Main Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className={`${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-emerald-200/50'
                  } backdrop-blur-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Total Kegiatan</p>
                          <p className="text-3xl font-black text-blue-600 mb-1">{stats.totalKegiatan}</p>
                          <p className="text-xs text-gray-500">
                            {stats.kegiatanAktif} aktif, {stats.kegiatanSelesai} selesai
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                          <Activity className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-emerald-200/50'
                  } backdrop-blur-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Total Donasi</p>
                          <p className="text-3xl font-black text-emerald-600 mb-1">{stats.totalDonasi}</p>
                          <p className="text-xs text-gray-500">
                            {stats.donasiPending} pending
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-emerald-200/50'
                  } backdrop-blur-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Dana Terkumpul</p>
                          <p className="text-3xl font-black text-green-600 mb-1">
                            {formatCurrency(stats.totalDanaTermasuk).replace('Rp', '')}
                          </p>
                          <p className="text-xs text-gray-500">
                            Sudah diverifikasi
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                          <DollarSign className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-emerald-200/50'
                  } backdrop-blur-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Dana Pending</p>
                          <p className="text-3xl font-black text-orange-600 mb-1">
                            {formatCurrency(stats.totalDanaPending).replace('Rp', '')}
                          </p>
                          <p className="text-xs text-gray-500">
                            Menunggu verifikasi
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                          <Calendar className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Quick Actions */}
                <Card className={`${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-emerald-200/50'
                } backdrop-blur-xl shadow-xl rounded-2xl relative overflow-hidden`}>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl font-black">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      Aksi Cepat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        onClick={() => setActiveTab('donasi')}
                        className="flex flex-col items-center gap-3 h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50/70 hover:from-emerald-100 hover:to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transform hover:scale-105 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:shadow-xl"
                        variant="outline"
                      >
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold">Verifikasi Donasi</span>
                        {stats.donasiPending > 0 && (
                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {stats.donasiPending}
                          </Badge>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => setActiveTab('kegiatan')}
                        className="flex flex-col items-center gap-3 h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50/70 hover:from-emerald-100 hover:to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transform hover:scale-105 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:shadow-xl"
                        variant="outline"
                      >
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold">Kelola Kegiatan</span>
                      </Button>
                      
                      <Button
                        onClick={() => setActiveTab('laporan')}
                        className="flex flex-col items-center gap-3 h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50/70 hover:from-emerald-100 hover:to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transform hover:scale-105 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:shadow-xl"
                        variant="outline"
                      >
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold">Lihat Laporan</span>
                      </Button>
                      
                      <Button
                        onClick={() => window.location.reload()}
                        className="flex flex-col items-center gap-3 h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50/70 hover:from-emerald-100 hover:to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transform hover:scale-105 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:shadow-xl"
                        variant="outline"
                      >
                        <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold">Refresh Data</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Donations */}
                  <Card className={`${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-emerald-200/50'
                  } backdrop-blur-xl shadow-xl rounded-2xl relative overflow-hidden hover:shadow-2xl transition-all duration-300`}>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-600"></div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl font-black">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        Donasi Terbaru
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentDonasi.length === 0 ? (
                          <div className="text-center py-8">
                            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} w-fit mx-auto mb-4`}>
                              <DollarSign className={`h-8 w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                            <p className="text-gray-500 font-medium">Belum ada donasi</p>
                          </div>
                        ) : (
                          recentDonasi.map((donasi) => (
                            <div key={donasi.id} className={`flex items-center justify-between p-4 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300 ${
                              isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700/70' : 'bg-emerald-50/50 hover:bg-emerald-50/70'
                            } border ${
                              isDarkMode ? 'border-gray-600/50' : 'border-blue-200/50'
                            }`}>
                              <div className="flex-1">
                                <p className="font-bold text-base">{kegiatan.judul}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                  <span>Target: {formatCurrency(kegiatan.target_dana)}</span>
                                  <span>•</span>
                                  <span>{formatDate(kegiatan.tanggal_mulai)}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500 mb-2">
                                  {kegiatan.progress_percentage?.toFixed(1) || 0}%
                                </p>
                                <Badge
                                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                    kegiatan.status === 'AKTIF' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' :
                                    kegiatan.status === 'SELESAI' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 
                                    'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                  }`}
                                >
                                  {kegiatan.status}
                                </Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {recentKegiatan.length > 0 && (
                        <div className="mt-6">
                          <Button 
                            variant="outline" 
                            className="w-full rounded-2xl py-3 font-semibold bg-gradient-to-r from-blue-50 to-blue-50/70 hover:from-blue-100 hover:to-blue-100 dark:from-blue-900/20 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                            onClick={() => setActiveTab('kegiatan')}
                          >
                            Lihat Semua Kegiatan
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Donasi Management Tab */}
          <TabsContent value="donasi">
            <AdminDashboardDonasi />
          </TabsContent>

          {/* Kegiatan Management Tab */}
          <TabsContent value="kegiatan">
            <AdminDashboardKegiatan />
          </TabsContent>

          {/* Enhanced Laporan Tab */}
          <TabsContent value="laporan">
            <Card className={`${
              isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-emerald-200/50'
            } backdrop-blur-xl shadow-xl rounded-2xl relative overflow-hidden`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-black">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  Laporan & Analitik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* Summary Cards with enhanced styling */}
                  <Card className={`${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-blue-50 to-blue-100/70'
                  } backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border ${
                    isDarkMode ? 'border-blue-600/20' : 'border-blue-200/50'
                  } relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg w-fit mx-auto group-hover:scale-110 transition-all duration-300">
                          <Activity className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <h3 className="font-black text-lg mb-2">Total Kegiatan</h3>
                      <p className="text-4xl font-black text-blue-600 mb-2">{stats.totalKegiatan}</p>
                      <p className="text-sm text-gray-500 font-medium">Semua kategori</p>
                    </CardContent>
                  </Card>

                  <Card className={`${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-emerald-50 to-emerald-100/70'
                  } backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border ${
                    isDarkMode ? 'border-emerald-600/20' : 'border-emerald-200/50'
                  } relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg w-fit mx-auto group-hover:scale-110 transition-all duration-300">
                          <Users className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <h3 className="font-black text-lg mb-2">Total Donatur</h3>
                      <p className="text-4xl font-black text-emerald-600 mb-2">{stats.totalDonasi}</p>
                      <p className="text-sm text-gray-500 font-medium">Partisipan aktif</p>
                    </CardContent>
                  </Card>

                  <Card className={`${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-green-50 to-green-100/70'
                  } backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border ${
                    isDarkMode ? 'border-green-600/20' : 'border-green-200/50'
                  } relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg w-fit mx-auto group-hover:scale-110 transition-all duration-300">
                          <DollarSign className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <h3 className="font-black text-lg mb-2">Total Dana</h3>
                      <p className="text-4xl font-black text-green-600 mb-2">
                        {formatCurrency(stats.totalDanaTermasuk + stats.totalDanaPending).split(',')[0]}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">Terkumpul & pending</p>
                    </CardContent>
                  </Card>
                </div>

                <div className={`text-center p-8 rounded-2xl ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-emerald-50/50'
                } backdrop-blur-sm border ${
                  isDarkMode ? 'border-gray-600/50' : 'border-emerald-200/50'
                }`}>
                  <div className="mb-6">
                    <div className={`p-6 rounded-3xl w-fit mx-auto ${
                      isDarkMode ? 'bg-gray-600/50' : 'bg-emerald-100/70'
                    } shadow-lg`}>
                      <AlertCircle className={`h-16 w-16 ${
                        isDarkMode ? 'text-gray-400' : 'text-emerald-500'
                      }`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4">Laporan Detail</h3>
                  <p className="text-gray-500 mb-6 text-lg font-medium">
                    Fitur laporan dan analitik mendalam akan segera tersedia.
                  </p>
                  <div className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-600/30' : 'bg-emerald-100/50'
                  } backdrop-blur-sm`}>
                    <p className="text-sm text-gray-500 font-medium">
                      Termasuk grafik performa, trend donasi, dan analisis per kategori kegiatan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;