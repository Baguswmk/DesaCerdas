import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminDashboardDonasi from "@/components/admin/AdminDashboardDonasi";
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
  FileText
} from "lucide-react";
import { useKegiatanAktif } from "@/hooks/bantuDesa/useKegiatan";
import { useDonasiPending } from "@/hooks/bantuDesa/useDonasi";
import useThemeStore from "@/store/theme";
import useAuthStore from "@/store/auth";
import { Navigate } from "react-router-dom";

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
}

const AdminDashboard = () => {
  const { isDarkMode } = useThemeStore();
  const { user, isLoggedIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: kegiatanResponse } = useKegiatanAktif({ limit: 100 });
  const { data: donasiData } = useDonasiPending();

  // Redirect if not admin
  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const kegiatan = kegiatanResponse?.data || [];
  const donasi = donasiData || [];

  // Calculate statistics
  const stats = {
    totalKegiatan: kegiatan.length,
    kegiatanAktif: kegiatan.filter(k => k.status === 'AKTIF').length,
    kegiatanSelesai: kegiatan.filter(k => k.status === 'SELESAI').length,
    totalDonasi: donasi.length,
    donasiPending: donasi.filter(d => d.status === 'PENDING').length,
    donasiApproved: donasi.filter(d => d.status === 'APPROVED').length,
    totalDanaTermasuk: donasi.filter(d => d.status === 'APPROVED').reduce((sum, d) => sum + d.amount, 0),
    totalDanaPending: donasi.filter(d => d.status === 'PENDING').reduce((sum, d) => sum + d.amount, 0)
  };

  const recentDonasi = donasi.slice(0, 5);
  const recentKegiatan = kegiatan.slice(0, 5);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
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
                        <div key={donasi.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{donasi.kegiatan.judul}</p>
                            <p className="text-xs text-gray-500">
                              {donasi.isAnonymous ? 'Anonim' : donasi.donorName} • {new Date(donasi.createdAt).toLocaleDateString('id-ID')}
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
                        <div key={kegiatan.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{kegiatan.judul}</p>
                            <p className="text-xs text-gray-500">
                              Target: {formatCurrency(kegiatan.target_dana)} • 
                              {new Date(kegiatan.tanggal_mulai).toLocaleDateString('id-ID')}
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
          </TabsContent>

          {/* Donasi Management Tab */}
          <TabsContent value="donasi">
            <AdminDashboardDonasi />
          </TabsContent>

          {/* Kegiatan Management Tab */}
          <TabsContent value="kegiatan">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardHeader>
                <CardTitle>Kelola Kegiatan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Fitur Dalam Pengembangan</h3>
                  <p className="text-gray-500">
                    Fitur untuk mengelola kegiatan akan segera tersedia.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Laporan Tab */}
          <TabsContent value="laporan">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardHeader>
                <CardTitle>Laporan & Analitik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Fitur Dalam Pengembangan</h3>
                  <p className="text-gray-500">
                    Fitur laporan dan analitik akan segera tersedia.
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