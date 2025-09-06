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
    console.log(kegiatanResponse)
    console.log(donasiData)
  
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
console.log("kegiatan type:", typeof kegiatan, kegiatan);
  
  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* <Header /> */}
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard Admin
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Kelola kegiatan desa dan verifikasi donasi masyarakat
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="donasi">
              <DollarSign className="h-4 w-4 mr-2" />
              Kelola Donasi
            </TabsTrigger>
            <TabsTrigger value="kegiatan">
              <Activity className="h-4 w-4 mr-2" />
              Kelola Kegiatan
            </TabsTrigger>
            <TabsTrigger value="laporan">
              <FileText className="h-4 w-4 mr-2" />
              Laporan
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Memuat data dashboard...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Main Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Kegiatan</p>
                          <p className="text-2xl font-bold text-blue-600">{stats.totalKegiatan}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {stats.kegiatanAktif} aktif, {stats.kegiatanSelesai} selesai
                          </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Donasi</p>
                          <p className="text-2xl font-bold text-green-600">{stats.totalDonasi}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {stats.donasiPending} pending
                          </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Dana Terkumpul</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {formatCurrency(stats.totalDanaTermasuk).replace('Rp', '')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Sudah diverifikasi
                          </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                          <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Dana Pending</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {formatCurrency(stats.totalDanaPending).replace('Rp', '')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Menunggu verifikasi
                          </p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                          <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle>Aksi Cepat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        onClick={() => setActiveTab('donasi')}
                        className="flex flex-col items-center gap-2 h-20 !rounded-button"
                        variant="outline"
                      >
                        <CheckCircle className="h-6 w-6" />
                        <span className="text-sm">Verifikasi Donasi</span>
                        {stats.donasiPending > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {stats.donasiPending}
                          </Badge>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => setActiveTab('kegiatan')}
                        className="flex flex-col items-center gap-2 h-20 !rounded-button"
                        variant="outline"
                      >
                        <Target className="h-6 w-6" />
                        <span className="text-sm">Kelola Kegiatan</span>
                      </Button>
                      
                      <Button
                        onClick={() => setActiveTab('laporan')}
                        className="flex flex-col items-center gap-2 h-20 !rounded-button"
                        variant="outline"
                      >
                        <FileText className="h-6 w-6" />
                        <span className="text-sm">Lihat Laporan</span>
                      </Button>
                      
                      <Button
                        onClick={() => window.location.reload()}
                        className="flex flex-col items-center gap-2 h-20 !rounded-button"
                        variant="outline"
                      >
                        <TrendingUp className="h-6 w-6" />
                        <span className="text-sm">Refresh Data</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Donations */}
                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Donasi Terbaru
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentDonasi.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">Belum ada donasi</p>
                        ) : (
                          recentDonasi.map((donasi) => (
                            <div key={donasi.id} className={`flex items-center justify-between p-3 rounded-lg ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{donasi.kegiatan?.judul || 'Kegiatan N/A'}</p>
                                <p className="text-xs text-gray-500">
                                  {donasi.isAnonymous ? 'Anonim' : (donasi.donorName || 'N/A')} • {formatDate(donasi.createdAt)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm text-green-600">
                                  {formatCurrency(donasi.amount)}
                                </p>
                                <Badge
                                  variant={
                                    donasi.status === 'APPROVED' ? 'default' :
                                    donasi.status === 'PENDING' ? 'secondary' : 'destructive'
                                  }
                                  className="text-xs"
                                >
                                  {donasi.status === 'APPROVED' ? 'Disetujui' :
                                   donasi.status === 'PENDING' ? 'Pending' : 'Ditolak'}
                                </Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {recentDonasi.length > 0 && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="w-full !rounded-button"
                            onClick={() => setActiveTab('donasi')}
                          >
                            Lihat Semua Donasi
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activities */}
                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Kegiatan Terbaru
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentKegiatan.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">Belum ada kegiatan</p>
                        ) : (
                          recentKegiatan.map((kegiatan) => (
                            <div key={kegiatan.id} className={`flex items-center justify-between p-3 rounded-lg ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{kegiatan.judul}</p>
                                <p className="text-xs text-gray-500">
                                  Target: {formatCurrency(kegiatan.target_dana)} • 
                                  {formatDate(kegiatan.tanggal_mulai)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {kegiatan.progress_percentage?.toFixed(1) || 0}%
                                </p>
                                <Badge
                                  variant={
                                    kegiatan.status === 'AKTIF' ? 'default' :
                                    kegiatan.status === 'SELESAI' ? 'secondary' : 'destructive'
                                  }
                                  className="text-xs"
                                >
                                  {kegiatan.status}
                                </Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {recentKegiatan.length > 0 && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="w-full !rounded-button"
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

          {/* Laporan Tab */}
          <TabsContent value="laporan">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardHeader>
                <CardTitle>Laporan & Analitik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Summary Cards */}
                  <Card className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <h3 className="font-semibold">Total Kegiatan</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalKegiatan}</p>
                        <p className="text-sm text-gray-500">Semua kategori</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <h3 className="font-semibold">Total Donatur</h3>
                        <p className="text-2xl font-bold text-green-600">{stats.totalDonasi}</p>
                        <p className="text-sm text-gray-500">Partisipan aktif</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <h3 className="font-semibold">Total Dana</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatCurrency(stats.totalDanaTermasuk + stats.totalDanaPending).split(',')[0]}
                        </p>
                        <p className="text-sm text-gray-500">Terkumpul & pending</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Laporan Detail</h3>
                  <p className="text-gray-500 mb-4">
                    Fitur laporan dan analitik mendalam akan segera tersedia.
                  </p>
                  <p className="text-sm text-gray-400">
                    Termasuk grafik performa, trend donasi, dan analisis per kategori kegiatan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;