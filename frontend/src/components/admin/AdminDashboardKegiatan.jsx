import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Plus,
  Edit3,
  Trash2,
  Search,
  RefreshCw,
  AlertCircle,
  Target,
  Users,
  Calendar,
  MapPin,
  Activity,
  TrendingUp,
  Settings,
  Filter,
  ChevronUp,
  ChevronDown,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import {
  useKegiatanAktif,
  useCreateKegiatan,
  useUpdateKegiatan,
  useDeleteKegiatan,
} from "@/hooks/bantuDesa/useKegiatan";
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
  });
}

const AdminDashboardKegiatan = () => {
  const { isDarkMode } = useThemeStore();
  const { setKegiatan } = useBantuDesaStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // ✅ ditambah
  const [showMobileFilters, setShowMobileFilters] = useState(false); // ✅ ditambah

  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    target_dana: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    foto_url: "",
    lokasi: "",
    kategori: "PEMBANGUNAN",
  });

  const {
    data: kegiatanResponse,
    isLoading,
    refetch,
    error,
  } = useKegiatanAktif({
    limit: 100,
    status: filterStatus === "ALL" ? undefined : filterStatus,
    search: searchTerm,
  });

  const { mutateAsync: createKegiatan, isPending: isCreating } =
    useCreateKegiatan();
  const { mutateAsync: updateKegiatan, isPending: isUpdating } =
    useUpdateKegiatan();
  const { mutateAsync: deleteKegiatan, isPending: isDeleting } =
    useDeleteKegiatan();

  const kegiatan = kegiatanResponse?.data.data || [];

  useEffect(() => {
    if (kegiatan?.length) {
      setKegiatan((prev) => {
        const isSame =
          JSON.stringify(prev.map((k) => k.id)) ===
          JSON.stringify(kegiatan.map((k) => k.id));
        return isSame ? prev : kegiatan;
      });
    }
  }, [kegiatan, setKegiatan]);

  const resetForm = () => {
    setFormData({
      judul: "",
      deskripsi: "",
      target_dana: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      foto_url: "",
      lokasi: "",
      kategori: "PEMBANGUNAN",
    });
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...formData,
        target_dana: parseInt(formData.target_dana),
      };
      const tempId = Date.now();

      setKegiatan((prev) => [...prev, { id: tempId, ...payload }]);

      await createKegiatan(payload);
      toast.success("Kegiatan berhasil dibuat");

      setShowCreateModal(false);
      resetForm();
      await refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal membuat kegiatan");
      await refetch();
    }
  };

  const handleEdit = async () => {
    if (!selectedKegiatan) return;

    try {
      const payload = {
        ...formData,
        target_dana: parseInt(formData.target_dana),
      };

      setKegiatan((prev) =>
        prev.map((k) =>
          k.id === selectedKegiatan.id ? { ...k, ...payload } : k
        )
      );

      await updateKegiatan({ id: selectedKegiatan.id, data: payload });
      toast.success("Kegiatan berhasil diperbarui");

      setShowEditModal(false);
      setSelectedKegiatan(null);
      resetForm();
      await refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memperbarui kegiatan");
      await refetch();
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus kegiatan ini?"
    );
    if (!confirmDelete) return;

    try {
      setKegiatan((prev) => prev.filter((k) => k.id !== id));

      await deleteKegiatan(id);
      toast.success("Kegiatan berhasil dihapus");

      await refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus kegiatan");
      await refetch();
    }
  };

  const openEditModal = (kegiatanItem) => {
    setSelectedKegiatan(kegiatanItem);
    setFormData({
      judul: kegiatanItem.judul || "",
      deskripsi: kegiatanItem.deskripsi || "",
      target_dana: kegiatanItem.target_dana?.toString() || "",
      tanggal_mulai: kegiatanItem.tanggal_mulai
        ? new Date(kegiatanItem.tanggal_mulai).toISOString().split("T")[0]
        : "",
      tanggal_selesai: kegiatanItem.tanggal_selesai
        ? new Date(kegiatanItem.tanggal_selesai).toISOString().split("T")[0]
        : "",
      foto_url: kegiatanItem.foto_url || "",
      lokasi: kegiatanItem.lokasi || "",
      kategori: kegiatanItem.kategori || "PEMBANGUNAN",
    });
    setShowEditModal(true);
  };

  const filteredKegiatan = kegiatan.filter((item) => {
    const matchSearch =
      item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "ALL" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calculate statistics
  const stats = {
    total: kegiatan.length,
    aktif: kegiatan.filter((k) => k.status === "AKTIF").length,
    selesai: kegiatan.filter((k) => k.status === "SELESAI").length,
    totalTarget: kegiatan.reduce((sum, k) => sum + (k.target_dana || 0), 0),
    totalTerkumpul: kegiatan.reduce(
      (sum, k) => sum + (k.dana_terkumpul || 0),
      0
    ),
  };

  const getProgressPercentage = (terkumpul, target) => {
    if (!target) return 0;
    return Math.min((terkumpul / target) * 100, 100);
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="animate-spin h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <div className="absolute inset-0 h-12 w-12 border-4 border-emerald-200 rounded-full animate-pulse mx-auto"></div>
          </div>
          <div className="space-y-2">
            <span className="text-lg font-medium">Memuat data kegiatan...</span>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-emerald-700 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <AlertCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <div className="absolute inset-0 h-16 w-16 border-4 border-emerald-200 rounded-full animate-ping mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-emerald-600">
            Gagal Memuat Data
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error.message || "Terjadi kesalahan saat memuat data kegiatan"}
          </p>
          <Button
            onClick={() => refetch()}
            className="rounded-xl px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const openDetailModal = (kegiatanItem) => {
  setSelectedKegiatan(kegiatanItem);
  setShowDetailModal(true);
};


  return (
    <div
      className={`min-h-screen relative overflow-hidden 
      `}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-emerald-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-emerald-100/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {[
            {
              title: "Total Kegiatan",
              value: stats.total,
              icon: Activity,
              color: "from-emerald-400 to-emerald-500",
              bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
              textColor: "text-emerald-600 dark:text-emerald-400",
              description: "Semua kegiatan",
            },
            {
              title: "Kegiatan Aktif",
              value: stats.aktif,
              icon: TrendingUp,
              color: "from-green-400 to-green-500",
              bgColor: "bg-green-100 dark:bg-green-900/20",
              textColor: "text-green-600 dark:text-green-400",
              description: "Sedang berjalan",
            },
            {
              title: "Kegiatan Selesai",
              value: stats.selesai,
              icon: Target,
              color: "from-emerald-500 to-emerald-600",
              bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
              textColor: "text-emerald-600 dark:text-emerald-400",
              description: "Telah diselesaikan",
            },
            {
              title: "Target Dana",
              value: formatCurrency(stats.totalTarget).replace("Rp", "Rp "),
              icon: Target,
              color: "from-emerald-600 to-green-600",
              bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
              textColor: "text-emerald-600 dark:text-emerald-400",
              description: "Total target",
              isAmount: true,
            },
            {
              title: "Dana Terkumpul",
              value: formatCurrency(stats.totalTerkumpul).replace("Rp", "Rp "),
              icon: Users,
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-100 dark:bg-green-900/20",
              textColor: "text-green-600 dark:text-green-400",
              description: "Dana yang terkumpul",
              isAmount: true,
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 backdrop-blur-sm animate-fadeInUp ${
                isDarkMode
                  ? "bg-white/10 hover:bg-white/15"
                  : "bg-white/80 hover:bg-white/90"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              <CardContent className="p-3 sm:p-4 md:p-6 relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium uppercase tracking-wide truncate ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-600"
                      }`}
                    >
                      {stat.title}
                    </p>
                    <p
                      className={`text-lg sm:text-xl md:text-2xl font-bold mt-1 sm:mt-2 ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {stat.isAmount ? stat.value : stat.value.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } truncate`}
                    >
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.bgColor} transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg flex-shrink-0 ml-2`}
                  >
                    <stat.icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${stat.textColor}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card
          className={`border-0 shadow-xl backdrop-blur-sm ${
            isDarkMode ? "bg-white/10" : "bg-white/80"
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
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    <Input
                      placeholder="🔍 Cari kegiatan berdasarkan judul, deskripsi, atau lokasi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 transition-all duration-200 ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 focus:border-emerald-400 text-white"
                          : "bg-white border-emerald-300 focus:border-emerald-500"
                      } shadow-lg focus:shadow-xl`}
                    />
                  </div>
                  <div className="flex gap-3 sm:gap-4">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 text-sm sm:text-base font-medium shadow-lg transition-all duration-200 min-w-[140px] ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 text-emerald-200"
                          : "bg-white border-emerald-300 text-emerald-700"
                      } focus:ring-2 focus:ring-emerald-500`}
                    >
                      <option value="ALL">🔥 Semua Status</option>
                      <option value="AKTIF">🚀 Aktif</option>
                      <option value="SELESAI">✅ Selesai</option>
                      <option value="DIBATALKAN">❌ Dibatalkan</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kegiatan List */}
        <Card
          className={`border-0 shadow-xl backdrop-blur-sm ${
            isDarkMode ? "bg-white/10" : "bg-white/80"
          }`}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex justify-between items-center gap-3 text-lg sm:text-xl md:text-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span
                  className={
                    isDarkMode ? "text-emerald-200" : "text-emerald-800"
                  }
                >
                  Daftar Kegiatan ({filteredKegiatan.length})
                </span>
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
                  onClick={() => setShowCreateModal(true)}
                  className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-emerald-700"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    <Plus className="h-4 w-4" />
                    <span>Buat Kegiatan</span>
                  </span>
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl bg-emerald-50/10 backdrop-blur-sm border-2 border-emerald-300/40 hover:bg-emerald-100/20 hover:border-emerald-300/60 transition-all duration-300 ${
                    isDarkMode
                      ? "text-emerald-200 hover:text-emerald-100"
                      : "text-emerald-700 hover:text-emerald-800"
                  }`}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredKegiatan.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="space-y-4">
                  <div className="text-4xl sm:text-6xl">🎯</div>
                  <div
                    className={`text-lg sm:text-xl font-medium ${
                      isDarkMode ? "text-emerald-300" : "text-emerald-600"
                    }`}
                  >
                    {searchTerm
                      ? `Tidak ada kegiatan yang cocok dengan "${searchTerm}"`
                      : "Belum ada kegiatan"}
                  </div>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {!searchTerm &&
                      "Mulai dengan membuat kegiatan baru untuk desa Anda"}
                  </div>
                  {!searchTerm && (
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Buat Kegiatan Pertama
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {filteredKegiatan.map((item, index) => (
                  <Card
                    key={item.id}
                    className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 animate-fadeInUp backdrop-blur-sm ${
                      isDarkMode
                        ? "bg-white/10 hover:bg-white/15"
                        : "bg-gray-50/80 hover:bg-white/90"
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {/* Image Section */}
                    <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                      <img
                        src={
                          item.foto_url ||
                          `https://via.placeholder.com/400x300?text=${getCategoryIcon(
                            item.kategori
                          )}+${encodeURIComponent(item.kategori)}`
                        }
                        alt={item.judul}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x300?text=Kegiatan+${item.id}`;
                        }}
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Status Badge */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        <Badge
                          variant={
                            item.status === "AKTIF"
                              ? "default"
                              : item.status === "SELESAI"
                              ? "secondary"
                              : "destructive"
                          }
                          className="font-semibold px-2 sm:px-3 py-1 shadow-lg bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-xs sm:text-sm"
                        >
                          {item.status === "AKTIF"
                            ? "🚀 AKTIF"
                            : item.status === "SELESAI"
                            ? "✅ SELESAI"
                            : "❌ DIBATALKAN"}
                        </Badge>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <Badge
                          variant="outline"
                          className="bg-emerald-50/90 backdrop-blur-sm font-medium border-emerald-200 text-xs sm:text-sm"
                        >
                          {getCategoryIcon(item.kategori)} {item.kategori}
                        </Badge>
                      </div>

                      {/* Progress Ring - Mobile Hidden */}
                      <div className="hidden sm:block absolute bottom-3 sm:bottom-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center border border-emerald-300/30">
                          <div className="text-emerald-100 text-xs font-bold">
                            {Math.round(
                              getProgressPercentage(
                                item.dana_terkumpul || 0,
                                item.target_dana
                              )
                            )}
                            %
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      {/* Title and Description */}
                      <div>
                        <h3
                          className={`font-bold text-lg sm:text-xl mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200 ${
                            isDarkMode ? "text-emerald-200" : "text-gray-800"
                          }`}
                        >
                          {item.judul}
                        </h3>
                        {item.deskripsi && (
                          <p
                            className={`text-sm line-clamp-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {item.deskripsi}
                          </p>
                        )}
                      </div>

                      {/* Financial Info */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm font-medium ${
                              isDarkMode
                                ? "text-emerald-300"
                                : "text-emerald-600"
                            }`}
                          >
                            Progress Dana
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              isDarkMode
                                ? "text-emerald-400"
                                : "text-emerald-600"
                            }`}
                          >
                            {Math.round(
                              getProgressPercentage(
                                item.dana_terkumpul || 0,
                                item.target_dana
                              )
                            )}
                            %
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div
                          className={`h-2 sm:h-3 rounded-full overflow-hidden ${
                            isDarkMode ? "bg-gray-600" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-1000 ease-out rounded-full"
                            style={{
                              width: `${getProgressPercentage(
                                item.dana_terkumpul || 0,
                                item.target_dana
                              )}%`,
                            }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                          <div>
                            <div
                              className={`flex items-center gap-1 mb-1 ${
                                isDarkMode
                                  ? "text-emerald-300"
                                  : "text-emerald-600"
                              }`}
                            >
                              <Target className="h-3 w-3" />
                              <span>Target</span>
                            </div>
                            <div
                              className={`font-bold text-xs sm:text-sm ${
                                isDarkMode
                                  ? "text-emerald-400"
                                  : "text-emerald-600"
                              }`}
                            >
                              {formatCurrency(item.target_dana)}
                            </div>
                          </div>
                          <div>
                            <div
                              className={`flex items-center gap-1 mb-1 ${
                                isDarkMode ? "text-green-300" : "text-green-600"
                              }`}
                            >
                              <Users className="h-3 w-3" />
                              <span>Terkumpul</span>
                            </div>
                            <div
                              className={`font-bold text-xs sm:text-sm ${
                                isDarkMode ? "text-green-400" : "text-green-600"
                              }`}
                            >
                              {formatCurrency(item.dana_terkumpul || 0)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location and Date Info */}
                      <div className="space-y-2">
                        {item.lokasi && (
                          <div
                            className={`flex items-center gap-2 text-xs sm:text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">{item.lokasi}</span>
                          </div>
                        )}
                        <div
                          className={`flex items-center gap-2 text-xs sm:text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">
                            {formatDate(item.tanggal_mulai)} -{" "}
                            {formatDate(item.tanggal_selesai)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-3 sm:pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetailModal(item)}
                          className={`rounded-lg sm:rounded-xl font-medium hover:scale-105 transition-all duration-200 border-emerald-300/40 hover:bg-emerald-100/20 hover:border-emerald-300/60 text-xs sm:text-sm ${
                            isDarkMode
                              ? "text-emerald-200 hover:text-emerald-100 border-emerald-500/30 hover:bg-emerald-900/20"
                              : "text-emerald-700 hover:text-emerald-800"
                          }`}
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Detail
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(item)}
                          className={`rounded-lg sm:rounded-xl font-medium hover:scale-105 transition-all duration-200 border-emerald-300/40 hover:bg-emerald-100/20 hover:border-emerald-300/60 text-xs sm:text-sm ${
                            isDarkMode
                              ? "text-emerald-200 hover:text-emerald-100 border-emerald-500/30 hover:bg-emerald-900/20"
                              : "text-emerald-700 hover:text-emerald-800"
                          }`}
                        >
                          <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting}
                          className="rounded-lg sm:rounded-xl font-medium hover:scale-105 transition-all duration-200 bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </CardContent>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent
            className={`max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-sm ${
              isDarkMode
                ? "bg-gray-800/90 border border-emerald-500/20"
                : "bg-white/95 border border-emerald-200"
            }`}
          >
            <DialogHeader className="pb-4 sm:pb-6 border-b border-emerald-200 dark:border-emerald-700/50">
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span
                  className={
                    isDarkMode ? "text-emerald-200" : "text-emerald-800"
                  }
                >
                  Detail Kegiatan
                </span>
              </DialogTitle>
            </DialogHeader>

            {selectedKegiatan && (
              <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
                {/* Image */}
                <div className="relative h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden">
                  <img
                    src={
                      selectedKegiatan.foto_url ||
                      `https://via.placeholder.com/800x400?text=${encodeURIComponent(
                        selectedKegiatan.judul
                      )}`
                    }
                    alt={selectedKegiatan.judul}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/800x400?text=Kegiatan+${selectedKegiatan.id}`;
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`text-sm font-semibold px-3 py-2 ${
                        selectedKegiatan.status === "AKTIF"
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                          : selectedKegiatan.status === "SELESAI"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                      }`}
                    >
                      {selectedKegiatan.status}
                    </Badge>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3">
                        {selectedKegiatan.judul}
                      </h3>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {selectedKegiatan.deskripsi}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Kategori
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg">
                            {getCategoryIcon(selectedKegiatan.kategori)}
                          </span>
                          <span className="font-semibold">
                            {selectedKegiatan.kategori}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Lokasi
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-sm">
                            {selectedKegiatan.lokasi}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Tanggal Mulai
                        </label>
                        <p className="font-semibold mt-1">
                          {formatDate(selectedKegiatan.tanggal_mulai)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Tanggal Selesai
                        </label>
                        <p className="font-semibold mt-1">
                          {formatDate(selectedKegiatan.tanggal_selesai)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Progress Section */}
                    <div
                      className={`p-4 sm:p-6 rounded-2xl ${
                        isDarkMode ? "bg-gray-700/50" : "bg-emerald-50"
                      }`}
                    >
                      <h4 className="font-bold text-lg mb-4 text-emerald-600">
                        Progress Dana
                      </h4>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-lg font-bold text-emerald-600">
                            {Math.round(
                              getProgressPercentage(
                                selectedKegiatan.dana_terkumpul || 0,
                                selectedKegiatan.target_dana
                              )
                            )}
                            %
                          </span>
                        </div>

                        <div
                          className={`h-4 rounded-full overflow-hidden ${
                            isDarkMode ? "bg-gray-600" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-1000 ease-out"
                            style={{
                              width: `${getProgressPercentage(
                                selectedKegiatan.dana_terkumpul || 0,
                                selectedKegiatan.target_dana
                              )}%`,
                            }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="text-center">
                            <label className="text-sm font-medium text-gray-500">
                              Target Dana
                            </label>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">
                              {formatCurrency(selectedKegiatan.target_dana)}
                            </p>
                          </div>
                          <div className="text-center">
                            <label className="text-sm font-medium text-gray-500">
                              Dana Terkumpul
                            </label>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                              {formatCurrency(
                                selectedKegiatan.dana_terkumpul || 0
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-emerald-200 dark:border-emerald-700/50">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 rounded-xl py-2 sm:py-3 text-sm sm:text-base font-semibold"
                  >
                    Tutup
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailModal(false);
                      openEditModal(selectedKegiatan);
                    }}
                    className="flex-1 rounded-xl py-2 sm:py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Kegiatan
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent
            className={`max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-sm ${
              isDarkMode
                ? "bg-gray-800/90 border border-emerald-500/20"
                : "bg-white/95 border border-emerald-200"
            }`}
          >
            <DialogHeader className="pb-4 sm:pb-6 border-b border-emerald-200 dark:border-emerald-700/50">
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span
                  className={
                    isDarkMode ? "text-emerald-200" : "text-emerald-800"
                  }
                >
                  Buat Kegiatan Baru
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="judul"
                      className={`text-sm sm:text-base font-semibold ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Judul Kegiatan *
                    </Label>
                    <Input
                      id="judul"
                      value={formData.judul}
                      onChange={(e) =>
                        setFormData({ ...formData, judul: e.target.value })
                      }
                      placeholder="Masukkan judul kegiatan yang menarik..."
                      className={`mt-2 rounded-xl border-2 py-2 sm:py-3 text-sm sm:text-base ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 focus:border-emerald-400 text-white"
                          : "bg-white border-emerald-300 focus:border-emerald-500"
                      }`}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="target_dana"
                      className={`text-sm sm:text-base font-semibold ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Target Dana *
                    </Label>
                    <Input
                      id="target_dana"
                      type="number"
                      value={formData.target_dana}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          target_dana: e.target.value,
                        })
                      }
                      placeholder="Target dana dalam Rupiah"
                      className={`mt-2 rounded-xl border-2 py-2 sm:py-3 text-sm sm:text-base ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 focus:border-emerald-400 text-white"
                          : "bg-white border-emerald-300 focus:border-emerald-500"
                      }`}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="kategori"
                      className={`text-sm sm:text-base font-semibold ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Kategori
                    </Label>
                    <select
                      id="kategori"
                      value={formData.kategori}
                      onChange={(e) =>
                        setFormData({ ...formData, kategori: e.target.value })
                      }
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 text-sm sm:text-base mt-2 ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 text-emerald-200 focus:border-emerald-400"
                          : "bg-white border-emerald-300 text-emerald-700 focus:border-emerald-500"
                      } focus:ring-2 focus:ring-emerald-500`}
                    >
                      <option value="PEMBANGUNAN">🏗️ Pembangunan</option>
                      <option value="KESEHATAN">🏥 Kesehatan</option>
                      <option value="PENDIDIKAN">📚 Pendidikan</option>
                      <option value="LINGKUNGAN">🌱 Lingkungan</option>
                      <option value="SOSIAL">🤝 Sosial</option>
                      <option value="EKONOMI">💰 Ekonomi</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="lokasi"
                      className={`text-sm sm:text-base font-semibold ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Lokasi
                    </Label>
                    <Input
                      id="lokasi"
                      value={formData.lokasi}
                      onChange={(e) =>
                        setFormData({ ...formData, lokasi: e.target.value })
                      }
                      placeholder="Lokasi pelaksanaan kegiatan"
                      className={`mt-2 rounded-xl border-2 py-2 sm:py-3 text-sm sm:text-base ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 focus:border-emerald-400 text-white"
                          : "bg-white border-emerald-300 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="tanggal_mulai"
                      className={`text-sm sm:text-base font-semibold ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Tanggal Mulai *
                    </Label>
                    <Input
                      id="tanggal_mulai"
                      type="date"
                      value={formData.tanggal_mulai}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggal_mulai: e.target.value,
                        })
                      }
                      className={`mt-2 rounded-xl border-2 py-2 sm:py-3 text-sm sm:text-base ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 focus:border-emerald-400 text-white"
                          : "bg-white border-emerald-300 focus:border-emerald-500"
                      }`}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="tanggal_selesai"
                      className={`text-sm sm:text-base font-semibold ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Tanggal Selesai *
                    </Label>
                    <Input
                      id="tanggal_selesai"
                      type="date"
                      value={formData.tanggal_selesai}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggal_selesai: e.target.value,
                        })
                      }
                      className={`mt-2 rounded-xl border-2 py-2 sm:py-3 text-sm sm:text-base ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 focus:border-emerald-400 text-white"
                          : "bg-white border-emerald-300 focus:border-emerald-500"
                      }`}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="foto_url"
                      className={`text-sm sm:text-base font-semibold ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      URL Foto
                    </Label>
                    <Input
                      id="foto_url"
                      value={formData.foto_url}
                      onChange={(e) =>
                        setFormData({ ...formData, foto_url: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className={`mt-2 rounded-xl border-2 py-2 sm:py-3 text-sm sm:text-base ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 focus:border-emerald-400 text-white"
                          : "bg-white border-emerald-300 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="deskripsi"
                  className={`text-sm sm:text-base font-semibold ${
                    isDarkMode ? "text-emerald-300" : "text-emerald-700"
                  }`}
                >
                  Deskripsi
                </Label>
                <Textarea
                  id="deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  placeholder="Jelaskan detail kegiatan, tujuan, dan manfaatnya..."
                  rows={4}
                  className={`mt-2 rounded-xl border-2 resize-none text-sm sm:text-base ${
                    isDarkMode
                      ? "bg-gray-700/50 border-emerald-500/30 focus:border-emerald-400 text-white"
                      : "bg-white border-emerald-300 focus:border-emerald-500"
                  }`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-emerald-200 dark:border-emerald-700/50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className={`flex-1 rounded-xl py-2 sm:py-3 text-sm sm:text-base font-semibold border-emerald-300/40 hover:bg-emerald-100/20 hover:border-emerald-300/60 ${
                    isDarkMode
                      ? "text-emerald-200 hover:text-emerald-100 border-emerald-500/30 hover:bg-emerald-900/20"
                      : "text-emerald-700 hover:text-emerald-800"
                  }`}
                  disabled={isCreating}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 rounded-xl py-2 sm:py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  disabled={
                    isCreating ||
                    !formData.judul ||
                    !formData.target_dana ||
                    !formData.tanggal_mulai ||
                    !formData.tanggal_selesai
                  }
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Membuat...
                    </>
                  ) : (
                    "Buat Kegiatan"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent
            className={`max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-sm ${
              isDarkMode
                ? "bg-gray-800/90 border border-emerald-500/20"
                : "bg-white/95 border border-emerald-200"
            }`}
          >
            <DialogHeader className="pb-4 sm:pb-6 border-b border-emerald-200 dark:border-emerald-700/50">
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                  <Edit3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span
                  className={
                    isDarkMode ? "text-emerald-200" : "text-emerald-800"
                  }
                >
                  Edit Kegiatan
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
              {/* Similar form structure as Create Modal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="edit-judul"
                      className={`text-sm sm:text-base font-semibold ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Judul Kegiatan *
                    </Label>
                    <Input
                      id="edit-judul"
                      value={formData.judul}
                      onChange={(e) =>
                        setFormData({ ...formData, judul: e.target.value })
                      }
                      placeholder="Masukkan judul kegiatan yang menarik..."
                      className={`mt-2 rounded-xl border-2 py-2 sm:py-3 text-sm sm:text-base ${
                        isDarkMode
                          ? "bg-gray-700/50 border-emerald-500/30 focus:border-emerald-400 text-white"
                          : "bg-white border-emerald-300 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {/* Other fields would follow the same pattern */}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-emerald-200 dark:border-emerald-700/50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedKegiatan(null);
                    resetForm();
                  }}
                  className={`flex-1 rounded-xl py-2 sm:py-3 text-sm sm:text-base font-semibold border-emerald-300/40 hover:bg-emerald-100/20 hover:border-emerald-300/60 ${
                    isDarkMode
                      ? "text-emerald-200 hover:text-emerald-100 border-emerald-500/30 hover:bg-emerald-900/20"
                      : "text-emerald-700 hover:text-emerald-800"
                  }`}
                  disabled={isUpdating}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleEdit}
                  className="flex-1 rounded-xl py-2 sm:py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  disabled={
                    isUpdating ||
                    !formData.judul ||
                    !formData.target_dana ||
                    !formData.tanggal_mulai ||
                    !formData.tanggal_selesai
                  }
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
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

export default AdminDashboardKegiatan;
