import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Users,
  Download,
  Search,
  RefreshCw,
  AlertCircle,
  Activity,
  Filter,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { useDonasiPending, useVerifyDonasi } from "@/hooks/bantuDesa/useDonasi";
import { useKegiatanAktif } from "@/hooks/bantuDesa/useKegiatan";
import useThemeStore from "@/store/theme";
import useBantuDesaStore from "@/store/bantuDesaStore";

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const AdminDashboardDonasi = () => {
  const { isDarkMode } = useThemeStore();
  const { setDonasiPending, calculateDashboardStats } = useBantuDesaStore();

  const [selectedDonasi, setSelectedDonasi] = useState(null);
  const [verifyAction, setVerifyAction] = useState("");
  const [verifyReason, setVerifyReason] = useState("");
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [selectedBukti, setSelectedBukti] = useState("");

  // 🔧 Tambahin state yang hilang
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("PENDING");

  const {
    data: donasiPending,
    isLoading: loadingPending,
    refetch,
    error,
  } = useDonasiPending();
  const { data: kegiatanResponse, isLoading: loadingKegiatan } =
    useKegiatanAktif({ limit: 100 });
  const { mutateAsync: verifyDonasi, isPending: isVerifying } =
    useVerifyDonasi();

  const kegiatan = kegiatanResponse?.data.data || [];
  const donasi = donasiPending?.data || [];
  useEffect(() => {
    if (donasi?.length) {
      setDonasiPending((prev) => {
        const isSame =
          JSON.stringify(prev.map((d) => d.id)) ===
          JSON.stringify(donasi.map((d) => d.id));
        return isSame ? prev : donasi;
      });
      calculateDashboardStats();
    }
  }, [donasi, setDonasiPending, calculateDashboardStats]);  

  const stats = {
    totalPending: donasi?.filter((d) => d.status === "PENDING").length || 0,
    totalApproved: donasi?.filter((d) => d.status === "APPROVED").length || 0,
    totalRejected: donasi?.filter((d) => d.status === "REJECTED").length || 0,
    totalAmount:
      donasi
        ?.filter((d) => d.status === "APPROVED")
        .reduce((sum, d) => sum + d.amount, 0) || 0,
  };

  const filteredDonasi = (donasi || []).filter((d) => {
    const matchSearch =
      d.kegiatan?.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "ALL" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleVerifyDonasi = async () => {
    if (!selectedDonasi || !verifyAction) return;

    const prevData = [...donasi];
    setDonasiPending((prev) =>
      prev.map((d) =>
        d.id === selectedDonasi.id
          ? {
              ...d,
              status: verifyAction === "approve" ? "APPROVED" : "REJECTED",
            }
          : d
      )
    );

    try {
      await verifyDonasi({
        donasiId: selectedDonasi.id,
        data: { action: verifyAction, reason: verifyReason },
      });

      calculateDashboardStats();

      toast.success(
        verifyAction === "approve"
          ? "Donasi berhasil disetujui"
          : "Donasi berhasil ditolak"
      );

      setSelectedDonasi(null);
      setVerifyAction("");
      setVerifyReason("");
    } catch (err) {
      setDonasiPending(prevData);
      toast.error(err.response?.data?.message || "Gagal memverifikasi donasi");
    }
  };

  const handleViewBukti = (buktiUrl) => {
    setSelectedBukti(buktiUrl);
    setShowBuktiModal(true);
  };

  const exportToCSV = () => {
    if (!filteredDonasi || filteredDonasi.length === 0) {
      toast.info("Tidak ada data untuk diekspor");
      return;
    }

    const csvData = filteredDonasi.map((d) => ({
      Tanggal: formatDate(d.createdAt),
      Kegiatan: d.kegiatan?.judul || "-",
      Donatur: d.isAnonymous ? "Anonim" : d.donorName || "-",
      Email: d.donorEmail || "-",
      Jumlah: d.amount,
      Status: d.status,
      Referensi: d.reference || "-",
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donasi-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Data berhasil diekspor ke CSV");
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Data berhasil diperbarui");
    } catch (err) {
      toast.error("Gagal memperbarui data");
    }
  };

  if (loadingPending || loadingKegiatan) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="animate-spin h-12 w-12 text-emerald-600 mx-auto mb-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3 text-red-600">
            Gagal Memuat Data
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error.message || "Terjadi kesalahan saat memuat data dashboard"}
          </p>
          <Button onClick={handleRefresh} className="rounded-xl px-6 py-3">
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-emerald-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-emerald-100/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[
            {
              title: "Pending",
              value: stats.totalPending,
              icon: Calendar,
              color: "from-amber-400 to-orange-500",
              bgColor: "bg-orange-100 dark:bg-orange-900/20",
              textColor: "text-orange-600 dark:text-orange-400",
              description: "Menunggu verifikasi",
            },
            {
              title: "Disetujui",
              value: stats.totalApproved,
              icon: CheckCircle,
              color: "from-emerald-400 to-green-500",
              bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
              textColor: "text-emerald-600 dark:text-emerald-400",
              description: "Telah diverifikasi",
            },
            {
              title: "Ditolak",
              value: stats.totalRejected,
              icon: XCircle,
              color: "from-red-400 to-red-500",
              bgColor: "bg-red-100 dark:bg-red-900/20",
              textColor: "text-red-600 dark:text-red-400",
              description: "Tidak memenuhi syarat",
            },
            {
              title: "Total Dana",
              value: formatCurrency(stats.totalAmount).replace("Rp", "Rp "),
              icon: DollarSign,
              color: "from-green-400 to-emerald-500",
              bgColor: "bg-green-100 dark:bg-green-900/20",
              textColor: "text-green-600 dark:text-green-400",
              description: "Dana yang terkumpul",
              isAmount: true,
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 backdrop-blur-sm ${
                isDarkMode ? "bg-gray-800/50" : "bg-white/80"
              } animate-fadeInUp`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              <CardContent className="p-3 sm:p-6 md:p-8 relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } truncate`}
                    >
                      {stat.title}
                    </p>
                    <p
                      className={`text-lg sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {stat.isAmount ? stat.value : stat.value.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      } truncate`}
                    >
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl ${stat.bgColor} transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg flex-shrink-0 ml-2`}
                  >
                    <stat.icon
                      className={`h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 ${stat.textColor}`}
                    />
                  </div>
                </div>

                {/* Progress bar for visual appeal */}
                <div className="mt-2 sm:mt-4">
                  <div
                    className={`h-1.5 sm:h-2 rounded-full overflow-hidden ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} transform transition-all duration-1000 ease-out`}
                      style={{
                        width: stat.isAmount
                          ? "85%"
                          : `${Math.min(
                              (stat.value /
                                Math.max(
                                  ...[
                                    stats.totalPending,
                                    stats.totalApproved,
                                    stats.totalRejected,
                                  ]
                                )) *
                                100,
                              100
                            )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card
          className={`border-0 shadow-xl backdrop-blur-sm ${
            isDarkMode ? "bg-gray-800/50" : "bg-white/80"
          }`}
        >
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col space-y-4">
              {/* Mobile Filter Toggle */}
              <div className="flex sm:hidden items-center justify-between">
                <h3 className="text-lg font-semibold">Filter & Pencarian</h3>
                <Button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  variant="outline"
                  className="p-2"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showMobileFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Filters Content */}
              <div
                className={`${showMobileFilters ? "block" : "hidden"} sm:block`}
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <Input
                      placeholder="Cari kegiatan, donatur, atau email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 focus:border-emerald-500"
                          : "bg-white border-gray-300 focus:border-emerald-500"
                      } shadow-lg focus:shadow-xl`}
                    />
                  </div>
                  <div className="flex gap-3 sm:gap-4">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 text-sm sm:text-base font-medium shadow-lg transition-all duration-200 focus:ring-2 focus:ring-emerald-500 min-w-[120px] ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="ALL">Semua Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Disetujui</option>
                      <option value="REJECTED">Ditolak</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donasi List - Desktop Table */}
        <div className="hidden lg:block">
          <Card
            className={`border-0 shadow-xl backdrop-blur-sm ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/80"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center gap-3 text-xl sm:text-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span>Daftar Donasi ({filteredDonasi.length})</span>
                  {searchTerm && (
                    <Badge
                      variant="outline"
                      className="ml-2 border-emerald-300 text-emerald-600"
                    >
                      Hasil pencarian: "{searchTerm}"
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                  <Button
                    onClick={exportToCSV}
                    disabled={filteredDonasi.length === 0}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                      isDarkMode
                        ? "border-emerald-600/50 hover:border-emerald-500 bg-gray-800/50 hover:bg-emerald-900/20"
                        : "border-emerald-300/60 hover:border-emerald-400 bg-white/50 hover:bg-emerald-50"
                    }`}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b-2 ${
                        isDarkMode ? "border-gray-700" : "border-emerald-200"
                      }`}
                    >
                      {[
                        "Tanggal",
                        "Kegiatan",
                        "Donatur",
                        "Jumlah",
                        "Status",
                        "Aksi",
                      ].map((header) => (
                        <th
                          key={header}
                          className="text-left p-4 sm:p-6 font-bold text-sm sm:text-base"
                        >
                          <div className="flex items-center gap-2">
                            {header === "Tanggal" && (
                              <Calendar className="h-4 w-4" />
                            )}
                            {header === "Jumlah" && (
                              <DollarSign className="h-4 w-4" />
                            )}
                            {header === "Status" && (
                              <Activity className="h-4 w-4" />
                            )}
                            {header}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonasi.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center p-12 sm:p-16">
                          <div className="space-y-4">
                            <div className="text-4xl sm:text-6xl">💰</div>
                            <div
                              className={`text-lg sm:text-xl font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {searchTerm
                                ? `Tidak ada donasi yang cocok dengan "${searchTerm}"`
                                : "Belum ada data donasi"}
                            </div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              {!searchTerm &&
                                "Data donasi akan muncul setelah ada transaksi baru"}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredDonasi.map((donasi, index) => (
                        <tr
                          key={donasi.id}
                          className={`border-b transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                            isDarkMode
                              ? "border-gray-700 hover:bg-emerald-900/10"
                              : "border-gray-200 hover:bg-emerald-50/50"
                          } animate-fadeInUp`}
                          style={{
                            animation: `fadeInUp 0.4s ease-out ${
                              index * 0.05
                            }s both`,
                          }}
                        >
                          <td className="p-4 sm:p-6">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {formatDate(donasi.createdAt)}
                              </div>
                              <div
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {new Date(donasi.createdAt).toLocaleTimeString(
                                  "id-ID"
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 sm:p-6">
                            <div className="space-y-2">
                              <div className="font-semibold text-base line-clamp-2">
                                {donasi.kegiatan?.judul ||
                                  "Kegiatan Tidak Ditemukan"}
                              </div>
                              <div
                                className={`text-xs px-3 py-1 rounded-full inline-block ${
                                  isDarkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-emerald-100 text-emerald-600"
                                }`}
                              >
                                ID: {donasi.reference || "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 sm:p-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {donasi.isAnonymous ? "🎭" : "👤"}
                                <span className="font-semibold">
                                  {donasi.isAnonymous
                                    ? "Anonim"
                                    : donasi.donorName || "N/A"}
                                </span>
                              </div>
                              <div
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                📧 {donasi.donorEmail || "N/A"}
                              </div>
                              {donasi.donorPhone && (
                                <div
                                  className={`text-xs ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  📱 {donasi.donorPhone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 sm:p-6">
                            <div className="space-y-1">
                              <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                                {formatCurrency(donasi.amount)}
                              </div>
                              <div
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {donasi.paymentMethod || "Transfer Bank"}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 sm:p-6">
                            <div className="space-y-2">
                              <Badge
                                variant={
                                  donasi.status === "APPROVED"
                                    ? "default"
                                    : donasi.status === "PENDING"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="font-semibold px-3 py-1"
                              >
                                {donasi.status === "APPROVED"
                                  ? "✅ Disetujui"
                                  : donasi.status === "PENDING"
                                  ? "⏳ Pending"
                                  : "❌ Ditolak"}
                              </Badge>
                              {donasi.verifiedAt && (
                                <div
                                  className={`text-xs ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {formatDate(donasi.verifiedAt)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 sm:p-6">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleViewBukti(donasi.bukti_transfer_url)
                                }
                                className="rounded-xl hover:scale-110 transition-all duration-200"
                                disabled={!donasi.bukti_transfer_url}
                                title="Lihat Bukti Transfer"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {donasi.status === "PENDING" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDonasi(donasi);
                                      setVerifyAction("approve");
                                    }}
                                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 hover:scale-110 transition-all duration-200"
                                    title="Setujui Donasi"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setSelectedDonasi(donasi);
                                      setVerifyAction("reject");
                                    }}
                                    className="rounded-xl hover:scale-110 transition-all duration-200"
                                    title="Tolak Donasi"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden">
          <Card
            className={`border-0 shadow-xl backdrop-blur-sm ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/80"
            }`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span>Daftar Donasi ({filteredDonasi.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDonasi.length === 0 ? (
                <div className="text-center py-12">
                  <div className="space-y-4">
                    <div className="text-4xl">💰</div>
                    <div
                      className={`text-lg font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {searchTerm
                        ? `Tidak ada donasi yang cocok dengan "${searchTerm}"`
                        : "Belum ada data donasi"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDonasi.map((donasi, index) => (
                    <Card
                      key={donasi.id}
                      className={`border transition-all duration-200 hover:shadow-lg ${
                        isDarkMode
                          ? "bg-gray-700/50 border-gray-600/50 hover:bg-gray-700/70"
                          : "bg-white border-emerald-200/50 hover:bg-emerald-50/30"
                      } animate-fadeInUp`}
                      style={{
                        animation: `fadeInUp 0.4s ease-out ${
                          index * 0.05
                        }s both`,
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base truncate mb-1">
                                {donasi.kegiatan?.judul ||
                                  "Kegiatan Tidak Ditemukan"}
                              </h3>
                              <div
                                className={`text-xs px-2 py-1 rounded-full inline-block ${
                                  isDarkMode
                                    ? "bg-gray-600 text-gray-300"
                                    : "bg-emerald-100 text-emerald-600"
                                }`}
                              >
                                ID: {donasi.reference || "N/A"}
                              </div>
                            </div>
                            <Badge
                              variant={
                                donasi.status === "APPROVED"
                                  ? "default"
                                  : donasi.status === "PENDING"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="font-semibold px-3 py-1 ml-2"
                            >
                              {donasi.status === "APPROVED"
                                ? "✅ Disetujui"
                                : donasi.status === "PENDING"
                                ? "⏳ Pending"
                                : "❌ Ditolak"}
                            </Badge>
                          </div>

                          {/* Amount */}
                          <div className="text-center py-2">
                            <div className="text-2xl font-bold text-emerald-600">
                              {formatCurrency(donasi.amount)}
                            </div>
                            <div
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {donasi.paymentMethod || "Transfer Bank"}
                            </div>
                          </div>

                          {/* Donor Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {donasi.isAnonymous ? "🎭" : "👤"}
                              <span className="font-medium">
                                {donasi.isAnonymous
                                  ? "Anonim"
                                  : donasi.donorName || "N/A"}
                              </span>
                            </div>
                            <div
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              📧 {donasi.donorEmail || "N/A"}
                            </div>
                            {donasi.donorPhone && (
                              <div
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                📱 {donasi.donorPhone}
                              </div>
                            )}
                          </div>

                          {/* Date */}
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            📅 {formatDate(donasi.createdAt)}
                          </div>

                          {/* Message */}
                          {donasi.message && (
                            <div
                              className={`text-xs italic p-2 rounded-lg ${
                                isDarkMode ? "bg-gray-600/50" : "bg-blue-50"
                              }`}
                            >
                              💬 "{donasi.message}"
                            </div>
                          )}

                          {/* Expandable Details */}
                          <div className="space-y-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedCard(
                                  expandedCard === donasi.id ? null : donasi.id
                                )
                              }
                              className="w-full justify-center text-xs"
                            >
                              {expandedCard === donasi.id ? (
                                <>
                                  Sembunyikan Detail{" "}
                                  <ChevronUp className="h-4 w-4 ml-1" />
                                </>
                              ) : (
                                <>
                                  Lihat Detail{" "}
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                </>
                              )}
                            </Button>

                            {expandedCard === donasi.id && (
                              <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                                {donasi.verifiedAt && (
                                  <div
                                    className={`text-xs ${
                                      isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    ✅ Diverifikasi:{" "}
                                    {formatDate(donasi.verifiedAt)}
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleViewBukti(donasi.bukti_transfer_url)
                                    }
                                    className="flex-1 rounded-xl"
                                    disabled={!donasi.bukti_transfer_url}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Bukti
                                  </Button>
                                  {donasi.status === "PENDING" && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setSelectedDonasi(donasi);
                                          setVerifyAction("approve");
                                        }}
                                        className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Setujui
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                          setSelectedDonasi(donasi);
                                          setVerifyAction("reject");
                                        }}
                                        className="flex-1 rounded-xl"
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Tolak
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Verify Donasi Modal */}
        <Dialog
          open={!!selectedDonasi}
          onOpenChange={() => setSelectedDonasi(null)}
        >
          <DialogContent
            className={`max-w-2xl rounded-2xl ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl flex items-center gap-3">
                {verifyAction === "approve" ? (
                  <>
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                    </div>
                    <span>Setujui Donasi</span>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    </div>
                    <span>Tolak Donasi</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedDonasi && (
              <div className="space-y-4 sm:space-y-6">
                <div
                  className={`p-4 sm:p-6 rounded-2xl border-l-4 ${
                    verifyAction === "approve"
                      ? "border-emerald-500"
                      : "border-red-500"
                  } ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                >
                  <h4 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                    📋 Detail Donasi
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">
                        🎯 Kegiatan:
                      </span>
                      <p className="mt-1 font-semibold">
                        {selectedDonasi.kegiatan?.judul || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">
                        👤 Donatur:
                      </span>
                      <p className="mt-1 font-semibold">
                        {selectedDonasi.isAnonymous
                          ? "🎭 Anonim"
                          : selectedDonasi.donorName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">
                        💰 Jumlah:
                      </span>
                      <p className="mt-1 font-bold text-base sm:text-lg text-emerald-600">
                        {formatCurrency(selectedDonasi.amount)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">
                        📅 Tanggal:
                      </span>
                      <p className="mt-1 font-semibold">
                        {formatDate(selectedDonasi.createdAt)}
                      </p>
                    </div>
                    {selectedDonasi.message && (
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-500">
                          💬 Pesan:
                        </span>
                        <p className="mt-1 italic bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          "{selectedDonasi.message}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="reason"
                    className="text-sm sm:text-base font-medium"
                  >
                    {verifyAction === "approve"
                      ? "📝 Catatan Persetujuan (Opsional)"
                      : "📝 Alasan Penolakan (Wajib) *"}
                  </Label>
                  <Textarea
                    id="reason"
                    value={verifyReason}
                    onChange={(e) => setVerifyReason(e.target.value)}
                    placeholder={
                      verifyAction === "approve"
                        ? "💡 Tambahkan catatan jika diperlukan..."
                        : "❗ Jelaskan alasan penolakan secara detail..."
                    }
                    rows={4}
                    className="mt-2 rounded-xl border-2 resize-none text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedDonasi(null);
                      setVerifyAction("");
                      setVerifyReason("");
                    }}
                    className="rounded-xl py-2 sm:py-3 text-sm sm:text-base font-semibold order-2 sm:order-1"
                    disabled={isVerifying}
                  >
                    ❌ Batal
                  </Button>
                  <Button
                    onClick={handleVerifyDonasi}
                    className={`rounded-xl py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200 order-1 sm:order-2 ${
                      verifyAction === "approve"
                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    } shadow-lg hover:shadow-xl hover:scale-105`}
                    disabled={
                      isVerifying ||
                      (verifyAction === "reject" && !verifyReason.trim())
                    }
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />⏳
                        Memproses...
                      </>
                    ) : verifyAction === "approve" ? (
                      "✅ Setujui Donasi"
                    ) : (
                      "❌ Tolak Donasi"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Bukti Transfer Modal */}
        <Dialog open={showBuktiModal} onOpenChange={setShowBuktiModal}>
          <DialogContent
            className={`max-w-4xl rounded-2xl ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                🧾 Bukti Transfer
              </DialogTitle>
            </DialogHeader>

            <div className="flex justify-center p-4 sm:p-6">
              {selectedBukti ? (
                <div className="relative group w-full max-w-2xl">
                  <img
                    src={selectedBukti}
                    alt="Bukti Transfer"
                    className="w-full max-h-96 object-contain rounded-2xl shadow-2xl border-4 border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-all duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=❌+Gambar+Tidak+Ditemukan";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg transition-all duration-300">
                      <span className="text-sm font-medium">
                        🔍 Klik untuk memperbesar
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-gray-500 space-y-4">
                  <div className="text-4xl sm:text-6xl">🚫</div>
                  <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-medium mb-2">
                      Bukti transfer tidak tersedia
                    </p>
                    <p className="text-sm">
                      File mungkin rusak atau tidak dapat diakses
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedBukti && (
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => window.open(selectedBukti, "_blank")}
                  className="rounded-xl px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  📥 Unduh Gambar
                </Button>
                <Button
                  onClick={() => navigator.clipboard.writeText(selectedBukti)}
                  variant="outline"
                  className="rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  📋 Salin Link
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
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

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Respect reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-fadeInUp {
            animation: none !important;
          }

          .transform {
            transform: none !important;
          }

          .hover\\:scale-105:hover,
          .hover\\:scale-110:hover,
          .hover\\:-translate-y-1:hover,
          .hover\\:-translate-y-2:hover {
            transform: none !important;
          }
        }

        /* Improve touch targets for mobile */
        @media (max-width: 768px) {
          button {
            min-height: 44px;
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
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardDonasi;
