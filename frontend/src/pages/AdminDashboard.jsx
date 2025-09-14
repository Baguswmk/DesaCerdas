import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  Target,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboardDonasi from "@/components/admin/AdminDashboardDonasi";
import AdminDashboardKegiatan from "@/components/admin/AdminDashboardKegiatan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useKegiatanAktif } from "@/hooks/bantuDesa/useKegiatan";
import { useDonasiPending } from "@/hooks/bantuDesa/useDonasi";
import useThemeStore from "@/store/theme";
import useAuthStore from "@/store/auth";
import useBantuDesaStore from "@/store/bantuDesaStore";

// Format helper
const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const AdminDashboard = () => {
  const { isDarkMode } = useThemeStore();
  const { user, isLoggedIn } = useAuthStore();
  const { calculateDashboardStats, setKegiatan, setDonasiPending } =
    useBantuDesaStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: kegiatanResponse, isLoading: loadingKegiatan } =
    useKegiatanAktif({ limit: 100 });
  const { data: donasiData, isLoading: loadingDonasi } = useDonasiPending();

  // Check login & role
  if (!isLoggedIn || user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const kegiatan = kegiatanResponse?.data.data || [];
  const donasi = donasiData?.data || [];

  // Calculate stats only once when data comes in
  useEffect(() => {
    if (kegiatanResponse?.data?.data) {
      setKegiatan(kegiatanResponse.data.data);
    }
  }, [kegiatanResponse, setKegiatan]);
  useEffect(() => {
    if (donasiData?.data) {
      setDonasiPending(donasiData.data);
    }
  }, [donasiData, setDonasiPending]);

  // Jalankan kalkulasi setelah data masuk store
  useEffect(() => {
    calculateDashboardStats();
  }, [kegiatanResponse, donasiData, calculateDashboardStats]);

  // Statistics collection
  const stats = {
    totalKegiatan: kegiatan.length,
    kegiatanAktif: kegiatan.filter((k) => k.status === "AKTIF").length,
    kegiatanSelesai: kegiatan.filter((k) => k.status === "SELESAI").length,
    totalDonasi: donasi.length,
    donasiPending: donasi.filter((d) => d.status === "AKTIF").length,
    donasiApproved: donasi.filter((d) => d.status === "APPROVED").length,
    totalDanaTermasuk: donasi
      .filter((d) => d.status === "APPROVED")
      .reduce((sum, d) => sum + d.amount, 0),
    totalDanaPending: donasi
      .filter((d) => d.status === "PENDING")
      .reduce((sum, d) => sum + d.amount, 0),
  };

  const recentKegiatan = kegiatan.slice(0, 5);
  const isLoading = loadingKegiatan || loadingDonasi;

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
          : "bg-gradient-to-br from-emerald-800 via-emerald-800 to-green-800"
      }`}
    >
      {/* Header Component */}
      <Header />

      {/* Background Elements - matching Hero.jsx */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-emerald-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-emerald-100/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-emerald-300/25 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content - Added proper spacing from header */}
      <div className="relative  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  z-10 pt-20 sm:pt-24 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Enhanced Header Section */}
        <div
          className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-xl border transform hover:scale-102 transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/80 border-emerald-200/50"
          } relative overflow-hidden`}
        >
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-xl">
                  <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-2xl sm:text-3xl md:text-4xl font-black ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } mb-1 sm:mb-2`}
                  >
                    Dashboard Admin
                  </h1>
                  <p
                    className={`text-sm sm:text-base md:text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Kelola kegiatan desa dan verifikasi donasi masyarakat
                  </p>
                </div>
              </div>

              {/* Mobile menu button */}
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Responsive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Desktop Tab List */}
          <TabsList
            className={`hidden sm:grid sm:grid-cols-2 md:grid-cols-4 w-full p-2 h-auto rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-xl border ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white/80 border-emerald-200/50"
            }`}
          >
            <TabsTrigger
              value="overview"
              className={`rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300
    data-[state=active]:shadow-lg transform hover:scale-105
    ${
      isDarkMode
        ? "text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-800 data-[state=active]:to-emerald-900 data-[state=active]:text-white hover:text-emerald-400"
        : "text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white hover:text-emerald-600"
    }`}
            >
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="donasi"
              className={`rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300
    data-[state=active]:shadow-lg transform hover:scale-105
    ${
      isDarkMode
        ? "text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-800 data-[state=active]:to-emerald-900 data-[state=active]:text-white hover:text-emerald-400"
        : "text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white hover:text-emerald-600"
    }`}
            >
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Kelola </span>Donasi
            </TabsTrigger>

            <TabsTrigger
              value="kegiatan"
              className={`rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300
    data-[state=active]:shadow-lg transform hover:scale-105
    ${
      isDarkMode
        ? "text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-800 data-[state=active]:to-emerald-900 data-[state=active]:text-white hover:text-emerald-400"
        : "text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white hover:text-emerald-600"
    }`}
            >
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Kelola </span>Kegiatan
            </TabsTrigger>

            <TabsTrigger
              value="laporan"
              className={`rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300
    data-[state=active]:shadow-lg transform hover:scale-105
    ${
      isDarkMode
        ? "text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-800 data-[state=active]:to-emerald-900 data-[state=active]:text-white hover:text-emerald-400"
        : "text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white hover:text-emerald-600"
    }`}
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Laporan
            </TabsTrigger>
          </TabsList>

          {/* Mobile Tab Menu */}
          {isMobileMenuOpen && (
            <div
              className={`sm:hidden mb-4 p-4 rounded-2xl shadow-xl backdrop-blur-xl border ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-white/80 border-emerald-200/50"
              }`}
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "overview", icon: BarChart3, label: "Overview" },
                  { id: "donasi", icon: DollarSign, label: "Donasi" },
                  { id: "kegiatan", icon: Activity, label: "Kegiatan" },
                  { id: "laporan", icon: FileText, label: "Laporan" },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                        : isDarkMode
                        ? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Overview Tab */}
          <TabsContent
            value="overview"
            className="space-y-4 sm:space-y-6 md:space-y-8 mt-4 sm:mt-6 md:mt-8"
          >
            {isLoading ? (
              <div className="flex justify-center py-12 sm:py-16 md:py-20">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <div className="absolute inset-0 h-12 w-12 sm:h-16 sm:w-16 border-4 border-emerald-200 rounded-full animate-pulse mx-auto"></div>
                  </div>
                  <div className="space-y-3">
                    <span
                      className={`text-lg sm:text-xl font-bold ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
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
                {/* Enhanced Main Statistics - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {[
                    {
                      title: "Total Kegiatan",
                      value: stats.totalKegiatan,
                      subtitle: `${stats.kegiatanAktif} aktif, ${stats.kegiatanSelesai} selesai`,
                      icon: Activity,
                      color: "from-blue-400 to-blue-600",
                      bgColor: "from-blue-50 to-blue-100/70",
                      darkBgColor: "from-blue-900/20 to-blue-800/20",
                    },
                    {
                      title: "Total Donasi",
                      value: stats.totalDonasi,
                      subtitle: `${stats.donasiPending} pending`,
                      icon: Users,
                      color: "from-emerald-400 to-emerald-600",
                      bgColor: "from-emerald-50 to-emerald-100/70",
                      darkBgColor: "from-emerald-900/20 to-emerald-800/20",
                    },
                    {
                      title: "Dana Terkumpul",
                      value: formatCurrency(stats.totalDanaTermasuk).replace(
                        "Rp",
                        ""
                      ),
                      subtitle: "Sudah diverifikasi",
                      icon: DollarSign,
                      color: "from-green-400 to-green-600",
                      bgColor: "from-green-50 to-green-100/70",
                      darkBgColor: "from-green-900/20 to-green-800/20",
                      isAmount: true,
                    },
                    {
                      title: "Dana Pending",
                      value: formatCurrency(stats.totalDanaPending).replace(
                        "Rp",
                        ""
                      ),
                      subtitle: "Menunggu verifikasi",
                      icon: Calendar,
                      color: "from-orange-400 to-orange-600",
                      bgColor: "from-orange-50 to-orange-100/70",
                      darkBgColor: "from-orange-900/20 to-orange-800/20",
                      isAmount: true,
                    },
                  ].map((stat, index) => (
                    <Card
                      key={stat.title}
                      className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 backdrop-blur-sm ${
                        isDarkMode
                          ? `bg-gradient-to-br ${stat.darkBgColor} border-gray-700/50`
                          : `bg-gradient-to-br ${stat.bgColor} border-emerald-200/50`
                      } animate-fadeInUp`}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
                      ></div>
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 truncate">
                              {stat.title}
                            </p>
                            <p
                              className={`text-lg sm:text-2xl md:text-3xl font-black mb-1 group-hover:scale-110 transition-transform duration-300 ${
                                stat.color.includes("blue")
                                  ? "text-blue-600"
                                  : stat.color.includes("emerald")
                                  ? "text-emerald-600"
                                  : stat.color.includes("green")
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {stat.isAmount
                                ? stat.value
                                : stat.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {stat.subtitle}
                            </p>
                          </div>
                          <div
                            className={`p-2 sm:p-3 md:p-4 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0 ml-2`}
                          >
                            <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Enhanced Quick Actions - Responsive */}
                <Card
                  className={`${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700/50"
                      : "bg-white/80 border-emerald-200/50"
                  } backdrop-blur-xl shadow-xl rounded-2xl relative overflow-hidden`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>
                  <CardHeader className="pb-4">
                    <CardTitle
                      className={`flex items-center gap-3 text-lg sm:text-xl font-black ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl">
                        <Target className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      Aksi Cepat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {[
                        {
                          title: "Verifikasi Donasi",
                          icon: CheckCircle,
                          color: "from-emerald-500 to-emerald-600",
                          bgColor: "from-emerald-50 to-green-50/70",
                          darkBgColor: "from-emerald-900/20 to-green-900/20",
                          badge: stats.donasiPending,
                          action: () => {
                            setActiveTab("donasi");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          },
                        },
                        {
                          title: "Kelola Kegiatan",
                          icon: Target,
                          color: "from-blue-500 to-blue-600",
                          bgColor: "from-blue-50 to-blue-50/70",
                          darkBgColor: "from-blue-900/20 to-blue-900/20",
                          action: () => {
                            setActiveTab("kegiatan");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          },
                        },
                        {
                          title: "Lihat Laporan",
                          icon: FileText,
                          color: "from-purple-500 to-purple-600",
                          bgColor: "from-purple-50 to-purple-50/70",
                          darkBgColor: "from-purple-900/20 to-purple-900/20",
                          action: () => {
                            setActiveTab("laporan");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          },
                        },
                        {
                          title: "Refresh Data",
                          icon: TrendingUp,
                          color: "from-green-500 to-green-600",
                          bgColor: "from-green-50 to-green-50/70",
                          darkBgColor: "from-green-900/20 to-green-900/20",
                          action: () => window.location.reload(),
                        },
                      ].map((action, index) => (
                        <Button
                          key={action.title}
                          onClick={action.action}
                          className={`relative flex flex-col items-center gap-2 sm:gap-3 h-16 sm:h-20 md:h-24 rounded-xl sm:rounded-2xl transition-all duration-300 border hover:shadow-xl transform hover:scale-105 ${
                            isDarkMode
                              ? `bg-gradient-to-br ${action.darkBgColor} border-emerald-700/50 hover:border-emerald-600 text-gray-300`
                              : `bg-gradient-to-br ${action.bgColor} border-emerald-200/50 hover:border-emerald-300 text-gray-700`
                          }`}
                          variant="outline"
                        >
                          <div
                            className={`p-1.5 sm:p-2 bg-gradient-to-br ${action.color} rounded-lg sm:rounded-xl shadow-lg`}
                          >
                            <action.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-center leading-tight">
                            {action.title}
                          </span>
                          {action.badge && action.badge > 0 && (
                            <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                              {action.badge}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Recent Activities - Responsive */}
                <Card
                  className={`${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700/50"
                      : "bg-white/80 border-emerald-200/50"
                  } backdrop-blur-xl shadow-xl rounded-2xl relative overflow-hidden hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-600"></div>
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center gap-3 text-lg sm:text-xl font-black ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl">
                        <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      Kegiatan Terbaru
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {recentKegiatan.length === 0 ? (
                        <div className="text-center py-6 sm:py-8">
                          <div
                            className={`p-3 sm:p-4 rounded-2xl ${
                              isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                            } w-fit mx-auto mb-4`}
                          >
                            <Activity
                              className={`h-6 w-6 sm:h-8 sm:w-8 ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                          </div>
                          <p className="text-gray-500 font-medium">
                            Belum ada kegiatan
                          </p>
                        </div>
                      ) : (
                        recentKegiatan.map((kegiatan, index) => (
                          <div
                            key={kegiatan.id}
                            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300 ${
                              isDarkMode
                                ? "bg-gray-700/50 hover:bg-gray-700/70"
                                : "bg-emerald-50/50 hover:bg-emerald-50/70"
                            } border ${
                              isDarkMode
                                ? "border-gray-600/50"
                                : "border-emerald-200/50"
                            } animate-fadeInUp`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex-1 min-w-0 w-full sm:w-auto">
                              <p
                                className={`font-bold text-sm sm:text-base truncate mb-1 ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {kegiatan.judul}
                              </p>
                              <div
                                className={`flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-xs sm:text-sm ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                <span>
                                  Target: {formatCurrency(kegiatan.target_dana)}
                                </span>
                                <span className="hidden xs:inline">•</span>
                                <span>
                                  {formatDate(kegiatan.tanggal_mulai)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:text-right">
                              <span
                                className={`text-xs sm:text-sm font-bold ${
                                  isDarkMode
                                    ? "text-emerald-400"
                                    : "text-emerald-600"
                                }`}
                              >
                                {kegiatan.progress_percentage?.toFixed(1) || 0}%
                              </span>
                              <Badge
                                className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full ${
                                  kegiatan.status === "AKTIF"
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                                    : kegiatan.status === "SELESAI"
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                    : "bg-gradient-to-r from-red-500 to-red-600 text-white"
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
                      <div className="mt-4 sm:mt-6">
                        <Button
                          variant="outline"
                          className={`w-full rounded-xl sm:rounded-2xl py-2 sm:py-3 font-semibold transform hover:scale-105 transition-all duration-300 hover:shadow-lg border ${
                            isDarkMode
                              ? "bg-gradient-to-r from-emerald-900/20 to-emerald-900/20 border-emerald-700/50 hover:border-emerald-600 text-emerald-300"
                              : "bg-gradient-to-r from-emerald-50 to-emerald-50/70 border-emerald-200/50 hover:border-emerald-300 text-emerald-700"
                          }`}
                          onClick={() => {
                            setActiveTab("kegiatan");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          Lihat Semua Kegiatan
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="donasi">
            <AdminDashboardDonasi />
          </TabsContent>

          {/* Kegiatan Management Tab */}
          <TabsContent value="kegiatan">
            <AdminDashboardKegiatan />
          </TabsContent>

          {/* Enhanced Laporan Tab - Responsive */}
          <TabsContent value="laporan">
            <Card
              className={`${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-white/80 border-emerald-200/50"
              } backdrop-blur-xl shadow-xl rounded-2xl relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-3 text-lg sm:text-xl md:text-2xl font-black ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <div
                    className={`p-2 sm:p-3 rounded-xl shadow-lg ${
                      isDarkMode
                        ? "bg-gradient-to-br from-gray-700 to-gray-600"
                        : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                    }`}
                  >
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  Laporan & Analitik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {/* Summary Cards with enhanced responsive styling */}
                  {[
                    {
                      title: "Total Kegiatan",
                      value: stats.totalKegiatan,
                      subtitle: "Semua kategori",
                      icon: Activity,
                      color: "from-blue-400 to-blue-600",
                      bgColor: "from-blue-50 to-blue-100/70",
                      darkBgColor: "from-blue-900/20 to-blue-800/20",
                      textColor: "text-blue-600",
                    },
                    {
                      title: "Total Donatur",
                      value: stats.totalDonasi,
                      subtitle: "Partisipan aktif",
                      icon: Users,
                      color: "from-emerald-400 to-emerald-600",
                      bgColor: "from-emerald-50 to-emerald-100/70",
                      darkBgColor: "from-emerald-900/20 to-emerald-800/20",
                      textColor: "text-emerald-600",
                    },
                    {
                      title: "Total Dana",
                      value: formatCurrency(
                        stats.totalDanaTermasuk + stats.totalDanaPending
                      ).split(",")[0],
                      subtitle: "Terkumpul & pending",
                      icon: DollarSign,
                      color: "from-green-400 to-green-600",
                      bgColor: "from-green-50 to-green-100/70",
                      darkBgColor: "from-green-900/20 to-green-800/20",
                      textColor: "text-green-600",
                    },
                  ].map((card, index) => (
                    <Card
                      key={card.title}
                      className={`group relative overflow-hidden backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border ${
                        isDarkMode
                          ? `bg-gradient-to-br ${card.darkBgColor} border-gray-600/20`
                          : `bg-gradient-to-br ${card.bgColor} border-emerald-200/50`
                      }`}
                    >
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`}
                      ></div>
                      <CardContent className="p-4 sm:p-6 text-center">
                        <div className="mb-3 sm:mb-4">
                          <div
                            className={`p-3 sm:p-4 bg-gradient-to-br ${card.color} rounded-xl sm:rounded-2xl shadow-lg w-fit mx-auto group-hover:scale-110 transition-all duration-300`}
                          >
                            <card.icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
                          </div>
                        </div>
                        <h3
                          className={`font-black text-base sm:text-lg mb-2 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {card.title}
                        </h3>
                        <p
                          className={`text-2xl sm:text-3xl md:text-4xl font-black ${card.textColor} mb-2`}
                        >
                          {typeof card.value === "string"
                            ? card.value
                            : card.value.toLocaleString()}
                        </p>
                        <p
                          className={`text-xs sm:text-sm font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {card.subtitle}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div
                  className={`text-center p-6 sm:p-8 rounded-xl sm:rounded-2xl ${
                    isDarkMode ? "bg-gray-700/30" : "bg-emerald-50/50"
                  } backdrop-blur-sm border ${
                    isDarkMode ? "border-gray-600/50" : "border-emerald-200/50"
                  }`}
                >
                  <div className="mb-4 sm:mb-6">
                    <div
                      className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl w-fit mx-auto ${
                        isDarkMode ? "bg-gray-600/50" : "bg-emerald-100/70"
                      } shadow-lg`}
                    >
                      <AlertCircle
                        className={`h-12 w-12 sm:h-16 sm:w-16 ${
                          isDarkMode ? "text-gray-400" : "text-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                  <h3
                    className={`text-xl sm:text-2xl font-black mb-3 sm:mb-4 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Laporan Detail
                  </h3>

                  <p
                    className={`mb-4 sm:mb-6 text-base sm:text-lg font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Fitur laporan dan analitik mendalam akan segera tersedia.
                  </p>

                  <div
                    className={`p-3 sm:p-4 rounded-xl ${
                      isDarkMode ? "bg-gray-600/30" : "bg-emerald-100/50"
                    } backdrop-blur-sm`}
                  >
                    <p
                      className={`text-xs sm:text-sm font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Termasuk grafik performa, trend donasi, dan analisis per
                      kategori kegiatan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Component - Added proper spacing */}
      <div className="relative z-10 mt-12 sm:mt-16 md:mt-20">
        <Footer />
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(2deg);
          }
          66% {
            transform: translateY(-5px) rotate(-2deg);
          }
        }

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

        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        /* Custom breakpoint for extra small devices */
        @media (min-width: 475px) {
          .xs\\:flex-row {
            flex-direction: row;
          }
          .xs\\:items-center {
            align-items: center;
          }
          .xs\\:gap-2 {
            gap: 0.5rem;
          }
          .xs\\:inline {
            display: inline;
          }
        }

        /* Respect reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-fadeInUp,
          .animate-gradient-x {
            animation: none !important;
          }

          .transform {
            transform: none !important;
          }

          .hover\\:scale-105:hover,
          .hover\\:scale-102:hover,
          .hover\\:-translate-y-1:hover,
          .hover\\:-translate-y-2:hover {
            transform: none !important;
          }
        }

        /* Ensure proper text wrapping on very small screens */
        @media (max-width: 320px) {
          .text-2xl {
            font-size: 1.25rem;
            line-height: 1.75rem;
          }
          .text-3xl {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          .text-4xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
          }
        }

        /* Improve touch targets for mobile */
        @media (max-width: 768px) {
          button {
            min-height: 44px;
          }
        }

        /* Additional spacing for header clearance */
        .pt-20 {
          padding-top: 5rem;
        }
        .pt-24 {
          padding-top: 6rem;
        }

        @media (min-width: 640px) {
          .sm\\:pt-24 {
            padding-top: 6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
