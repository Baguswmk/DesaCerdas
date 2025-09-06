import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Loader2,
    Plus,
    Edit3,
    Trash2,
    Eye,
    Calendar,
    Target,
    Users,
    Search,
    Filter,
    RefreshCw,
    AlertCircle,
    MapPin,
    Clock,
    TrendingUp,
    Activity,
    Settings
} from "lucide-react";
import { useKegiatanAktif, useCreateKegiatan, useUpdateKegiatan, useDeleteKegiatan } from "@/hooks/bantuDesa/useKegiatan";
import useThemeStore from "@/store/theme";
import useBantuDesaStore from "@/store/bantuDesaStore";

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

const AdminDashboardKegiatan = () => {
    const { isDarkMode } = useThemeStore();
    const { setKegiatan } = useBantuDesaStore();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
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
        kategori: "PEMBANGUNAN"
    });

    const { data: kegiatanResponse, isLoading, refetch, error } = useKegiatanAktif({
        limit: 100,
        status: filterStatus === "ALL" ? undefined : filterStatus,
        search: searchTerm
    });
    const { mutate: createKegiatan, isPending: isCreating } = useCreateKegiatan();
    const { mutate: updateKegiatan, isPending: isUpdating } = useUpdateKegiatan();
    const { mutate: deleteKegiatan, isPending: isDeleting } = useDeleteKegiatan();

    const kegiatan = kegiatanResponse?.data.data || [];

    useEffect(() => {
        if (kegiatan) {
            setKegiatan(kegiatan);
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
            kategori: "PEMBANGUNAN"
        });
    };

    const handleCreate = async () => {
        try {
            const payload = {
                ...formData,
                target_dana: parseInt(formData.target_dana)
            };

            await createKegiatan(payload);
            setShowCreateModal(false);
            resetForm();
            await refetch();
            alert("✅ Kegiatan berhasil dibuat!");
        } catch (error) {
            console.error('Create kegiatan error:', error);
            alert("❌ " + (error.response?.data?.message || "Gagal membuat kegiatan"));
        }
    };

    const handleEdit = async () => {
        if (!selectedKegiatan) return;

        try {
            const payload = {
                ...formData,
                target_dana: parseInt(formData.target_dana)
            };

            await updateKegiatan({ id: selectedKegiatan.id, data: payload });
            setShowEditModal(false);
            setSelectedKegiatan(null);
            resetForm();
            await refetch();
            alert("✅ Kegiatan berhasil diperbarui!");
        } catch (error) {
            console.error('Update kegiatan error:', error);
            alert("❌ " + (error.response?.data?.message || "Gagal memperbarui kegiatan"));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("⚠️ Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.")) return;

        try {
            await deleteKegiatan(id);
            await refetch();
            alert("✅ Kegiatan berhasil dihapus!");
        } catch (error) {
            console.error('Delete kegiatan error:', error);
            alert("❌ " + (error.response?.data?.message || "Gagal menghapus kegiatan"));
        }
    };

    const openEditModal = (kegiatanItem) => {
        setSelectedKegiatan(kegiatanItem);
        setFormData({
            judul: kegiatanItem.judul || "",
            deskripsi: kegiatanItem.deskripsi || "",
            target_dana: kegiatanItem.target_dana?.toString() || "",
            tanggal_mulai: kegiatanItem.tanggal_mulai ? new Date(kegiatanItem.tanggal_mulai).toISOString().split('T')[0] : "",
            tanggal_selesai: kegiatanItem.tanggal_selesai ? new Date(kegiatanItem.tanggal_selesai).toISOString().split('T')[0] : "",
            foto_url: kegiatanItem.foto_url || "",
            lokasi: kegiatanItem.lokasi || "",
            kategori: kegiatanItem.kategori || "PEMBANGUNAN"
        });
        setShowEditModal(true);
    };

    const filteredKegiatan = kegiatan.filter(item => {
        const matchSearch = item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lokasi?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // Calculate statistics
    const stats = {
        total: kegiatan.length,
        aktif: kegiatan.filter(k => k.status === 'AKTIF').length,
        selesai: kegiatan.filter(k => k.status === 'SELESAI').length,
        totalTarget: kegiatan.reduce((sum, k) => sum + (k.target_dana || 0), 0),
        totalTerkumpul: kegiatan.reduce((sum, k) => sum + (k.dana_terkumpul || 0), 0)
    };

    const getProgressPercentage = (terkumpul, target) => {
        if (!target) return 0;
        return Math.min((terkumpul / target) * 100, 100);
    };

    const getCategoryIcon = (kategori) => {
        const icons = {
            'PEMBANGUNAN': '🏗️',
            'KESEHATAN': '🏥',
            'PENDIDIKAN': '📚',
            'LINGKUNGAN': '🌱',
            'SOSIAL': '🤝',
            'EKONOMI': '💰'
        };
        return icons[kategori] || '📋';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="relative">
                        <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
                        <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full animate-pulse mx-auto"></div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-lg font-medium">Memuat data kegiatan...</span>
                        <div className="flex items-center justify-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
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
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <div className="absolute inset-0 h-16 w-16 border-4 border-red-200 rounded-full animate-ping mx-auto"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-red-600">Gagal Memuat Data</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{error.message || "Terjadi kesalahan saat memuat data kegiatan"}</p>
                    <Button onClick={() => refetch()} className="!rounded-xl px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Coba Lagi
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-6 space-y-8 min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                            <Settings className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                                Kelola Kegiatan
                            </h1>
                            <p className="text-gray-500 mt-1 font-medium">Kelola kegiatan desa dan program bantuan dengan mudah</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => setShowCreateModal(true)} 
                        className="!rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Buat Kegiatan
                    </Button>
                    <Button 
                        onClick={() => refetch()} 
                        variant="outline" 
                        className={`!rounded-xl px-6 py-3 border-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                            isDarkMode 
                                ? 'border-gray-600 hover:border-gray-500 bg-gray-800/50' 
                                : 'border-gray-300 hover:border-gray-400 bg-white/50'
                        }`}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { 
                        title: "Total Kegiatan", 
                        value: stats.total, 
                        icon: Activity, 
                        color: "from-gray-400 to-gray-500", 
                        bgColor: "bg-gray-100", 
                        textColor: "text-gray-600",
                        description: "Semua kegiatan"
                    },
                    { 
                        title: "Kegiatan Aktif", 
                        value: stats.aktif, 
                        icon: TrendingUp, 
                        color: "from-green-400 to-green-500", 
                        bgColor: "bg-green-100", 
                        textColor: "text-green-600",
                        description: "Sedang berjalan"
                    },
                    { 
                        title: "Kegiatan Selesai", 
                        value: stats.selesai, 
                        icon: Target, 
                        color: "from-blue-400 to-blue-500", 
                        bgColor: "bg-blue-100", 
                        textColor: "text-blue-600",
                        description: "Telah diselesaikan"
                    },
                    { 
                        title: "Target Dana", 
                        value: formatCurrency(stats.totalTarget).replace('Rp', 'Rp '), 
                        icon: Target, 
                        color: "from-purple-400 to-purple-500", 
                        bgColor: "bg-purple-100", 
                        textColor: "text-purple-600",
                        description: "Total target",
                        isAmount: true
                    },
                    { 
                        title: "Dana Terkumpul", 
                        value: formatCurrency(stats.totalTerkumpul).replace('Rp', 'Rp '), 
                        icon: Users, 
                        color: "from-orange-400 to-orange-500", 
                        bgColor: "bg-orange-100", 
                        textColor: "text-orange-600",
                        description: "Dana yang terkumpul",
                        isAmount: true
                    }
                ].map((stat, index) => (
                    <Card 
                        key={stat.title}
                        className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                            isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                        }`}
                        style={{
                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                        }}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {stat.title}
                                    </p>
                                    <p className={`text-2xl font-bold mt-2 ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                                        {stat.isAmount ? stat.value : stat.value.toLocaleString()}
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {stat.description}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.bgColor} transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className={`border-0 shadow-xl ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
                <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="🔍 Cari kegiatan berdasarkan judul, deskripsi, atau lokasi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-12 pr-4 py-3 text-base rounded-xl border-2 transition-all duration-200 ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                        : 'bg-white border-gray-300 focus:border-blue-500'
                                } shadow-lg focus:shadow-xl`}
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`px-6 py-3 rounded-xl border-2 text-base font-medium shadow-lg transition-all duration-200 ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                        : 'bg-white border-gray-300 text-gray-900'
                                } focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="ALL">🔥 Semua Status</option>
                                <option value="AKTIF">🚀 Aktif</option>
                                <option value="SELESAI">✅ Selesai</option>
                                <option value="DIBATALKAN">❌ Dibatalkan</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Kegiatan List */}
            <Card className={`border-0 shadow-xl ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <span>Daftar Kegiatan ({filteredKegiatan.length})</span>
                        {searchTerm && (
                            <Badge variant="outline" className="ml-2">
                                Hasil pencarian: "{searchTerm}"
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredKegiatan.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="space-y-4">
                                <div className="text-6xl">🎯</div>
                                <div className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {searchTerm ? `Tidak ada kegiatan yang cocok dengan "${searchTerm}"` : "Belum ada kegiatan"}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {!searchTerm && "Mulai dengan membuat kegiatan baru untuk desa Anda"}
                                </div>
                                {!searchTerm && (
                                    <Button 
                                        onClick={() => setShowCreateModal(true)}
                                        className="mt-4 !rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Buat Kegiatan Pertama
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredKegiatan.map((item, index) => (
                                <Card 
                                    key={item.id} 
                                    className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                                        isDarkMode ? 'bg-gray-700/50 backdrop-blur-sm' : 'bg-gray-50/80 backdrop-blur-sm'
                                    }`}
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {/* Image Section */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={item.foto_url || `https://readdy.ai/api/search-image?query=Indonesian%20village%20activity%20${item.kategori}&width=400&height=300&seq=${item.id}`}
                                            alt={item.judul}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.src = `https://readdy.ai/api/search-image?query=Indonesian%20village%20activity&width=400&height=300&seq=${item.id}`;
                                            }}
                                        />
                                        
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            <Badge
                                                variant={
                                                    item.status === 'AKTIF' ? 'default' :
                                                        item.status === 'SELESAI' ? 'secondary' : 'destructive'
                                                }
                                                className="font-semibold px-3 py-1 shadow-lg"
                                            >
                                                {item.status === 'AKTIF' ? '🚀 AKTIF' :
                                                 item.status === 'SELESAI' ? '✅ SELESAI' : '❌ DIBATALKAN'}
                                            </Badge>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm font-medium">
                                                {getCategoryIcon(item.kategori)} {item.kategori}
                                            </Badge>
                                        </div>

                                        {/* Progress Ring */}
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <div className="text-white text-xs font-bold">
                                                    {Math.round(getProgressPercentage(item.dana_terkumpul || 0, item.target_dana))}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-6 space-y-4">
                                        {/* Title and Description */}
                                        <div>
                                            <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                                {item.judul}
                                            </h3>
                                            {item.deskripsi && (
                                                <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {item.deskripsi}
                                                </p>
                                            )}
                                        </div>

                                        {/* Financial Info */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-500">Progress Dana</span>
                                                <span className="text-sm font-bold text-blue-600">
                                                    {Math.round(getProgressPercentage(item.dana_terkumpul || 0, item.target_dana))}%
                                                </span>
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div className={`h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                                <div 
                                                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-out rounded-full"
                                                    style={{ 
                                                        width: `${getProgressPercentage(item.dana_terkumpul || 0, item.target_dana)}%` 
                                                    }}
                                                ></div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <div className="flex items-center gap-1 text-gray-500 mb-1">
                                                        <Target className="h-3 w-3" />
                                                        <span>Target</span>
                                                    </div>
                                                    <div className="font-bold text-purple-600">
                                                        {formatCurrency(item.target_dana)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1 text-gray-500 mb-1">
                                                        <Users className="h-3 w-3" />
                                                        <span>Terkumpul</span>
                                                    </div>
                                                    <div className="font-bold text-green-600">
                                                        {formatCurrency(item.dana_terkumpul || 0)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location and Date Info */}
                                        <div className="space-y-2">
                                            {item.lokasi && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{item.lokasi}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEditModal(item)}
                                                className="flex-1 !rounded-xl font-medium hover:scale-105 transition-all duration-200"
                                            >
                                                <Edit3 className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isDeleting}
                                                className="!rounded-xl font-medium hover:scale-105 transition-all duration-200"
                                                title="Hapus Kegiatan"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>

                                    {/* Hover effect overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <DialogHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
                        <DialogTitle className="text-3xl flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <span>✨ Buat Kegiatan Baru</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="judul" className="text-base font-semibold">📝 Judul Kegiatan *</Label>
                                    <Input
                                        id="judul"
                                        value={formData.judul}
                                        onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                        placeholder="Masukkan judul kegiatan yang menarik..."
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="target_dana" className="text-base font-semibold">💰 Target Dana *</Label>
                                    <Input
                                        id="target_dana"
                                        type="number"
                                        value={formData.target_dana}
                                        onChange={(e) => setFormData({ ...formData, target_dana: e.target.value })}
                                        placeholder="Target dana dalam Rupiah"
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="kategori" className="text-base font-semibold">📂 Kategori</Label>
                                    <select
                                        id="kategori"
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 text-base mt-2 ${
                                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        } focus:ring-2 focus:ring-blue-500`}
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
                                    <Label htmlFor="lokasi" className="text-base font-semibold">📍 Lokasi</Label>
                                    <Input
                                        id="lokasi"
                                        value={formData.lokasi}
                                        onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                        placeholder="Lokasi pelaksanaan kegiatan"
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="tanggal_mulai" className="text-base font-semibold">📅 Tanggal Mulai *</Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={formData.tanggal_mulai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="tanggal_selesai" className="text-base font-semibold">📅 Tanggal Selesai *</Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={formData.tanggal_selesai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="foto_url" className="text-base font-semibold">🖼️ URL Foto</Label>
                                    <Input
                                        id="foto_url"
                                        value={formData.foto_url}
                                        onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="deskripsi" className="text-base font-semibold">📄 Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                value={formData.deskripsi}
                                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                placeholder="Jelaskan detail kegiatan, tujuan, dan manfaatnya..."
                                rows={5}
                                className="mt-2 !rounded-xl border-2 resize-none"
                            />
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                                className="flex-1 !rounded-xl py-3 text-base font-semibold"
                                disabled={isCreating}
                            >
                                ❌ Batal
                            </Button>
                            <Button
                                onClick={handleCreate}
                                className="flex-1 !rounded-xl py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                                disabled={isCreating || !formData.judul || !formData.target_dana || !formData.tanggal_mulai || !formData.tanggal_selesai}
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        ⏳ Membuat...
                                    </>
                                ) : (
                                    '✨ Buat Kegiatan'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <DialogHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
                        <DialogTitle className="text-3xl flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                                <Edit3 className="h-6 w-6 text-white" />
                            </div>
                            <span>✏️ Edit Kegiatan</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-judul" className="text-base font-semibold">📝 Judul Kegiatan *</Label>
                                    <Input
                                        id="edit-judul"
                                        value={formData.judul}
                                        onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                        placeholder="Masukkan judul kegiatan yang menarik..."
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-target_dana" className="text-base font-semibold">💰 Target Dana *</Label>
                                    <Input
                                        id="edit-target_dana"
                                        type="number"
                                        value={formData.target_dana}
                                        onChange={(e) => setFormData({ ...formData, target_dana: e.target.value })}
                                        placeholder="Target dana dalam Rupiah"
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-kategori" className="text-base font-semibold">📂 Kategori</Label>
                                    <select
                                        id="edit-kategori"
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 text-base mt-2 ${
                                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        } focus:ring-2 focus:ring-blue-500`}
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
                                    <Label htmlFor="edit-lokasi" className="text-base font-semibold">📍 Lokasi</Label>
                                    <Input
                                        id="edit-lokasi"
                                        value={formData.lokasi}
                                        onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                        placeholder="Lokasi pelaksanaan kegiatan"
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-tanggal_mulai" className="text-base font-semibold">📅 Tanggal Mulai *</Label>
                                    <Input
                                        id="edit-tanggal_mulai"
                                        type="date"
                                        value={formData.tanggal_mulai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-tanggal_selesai" className="text-base font-semibold">📅 Tanggal Selesai *</Label>
                                    <Input
                                        id="edit-tanggal_selesai"
                                        type="date"
                                        value={formData.tanggal_selesai}
                                        onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-foto_url" className="text-base font-semibold">🖼️ URL Foto</Label>
                                    <Input
                                        id="edit-foto_url"
                                        value={formData.foto_url}
                                        onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="mt-2 !rounded-xl border-2 py-3"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="edit-deskripsi" className="text-base font-semibold">📄 Deskripsi</Label>
                            <Textarea
                                id="edit-deskripsi"
                                value={formData.deskripsi}
                                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                placeholder="Jelaskan detail kegiatan, tujuan, dan manfaatnya..."
                                rows={5}
                                className="mt-2 !rounded-xl border-2 resize-none"
                            />
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedKegiatan(null);
                                    resetForm();
                                }}
                                className="flex-1 !rounded-xl py-3 text-base font-semibold"
                                disabled={isUpdating}
                            >
                                ❌ Batal
                            </Button>
                            <Button
                                onClick={handleEdit}
                                className="flex-1 !rounded-xl py-3 text-base font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                                disabled={isUpdating || !formData.judul || !formData.target_dana || !formData.tanggal_mulai || !formData.tanggal_selesai}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        ⏳ Menyimpan...
                                    </>
                                ) : (
                                    '✅ Simpan Perubahan'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

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

export default AdminDashboardKegiatan;