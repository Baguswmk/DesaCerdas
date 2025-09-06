import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    TrendingUp,
    Download,
    Search,
    Filter,
    RefreshCw,
    AlertCircle,
    BarChart3,
    PieChart,
    Activity
} from "lucide-react";
import { useDonasiPending, useVerifyDonasi } from "@/hooks/bantuDesa/useDonasi";
import { useKegiatanAktif } from "@/hooks/bantuDesa/useKegiatan";
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
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

const AdminDashboardDonasi = () => {
    const { isDarkMode } = useThemeStore();
    const {
        setDonasiPending,
        calculateDashboardStats,
        dashboardStats
    } = useBantuDesaStore();

    const [selectedDonasi, setSelectedDonasi] = useState(null);
    const [verifyAction, setVerifyAction] = useState("");
    const [verifyReason, setVerifyReason] = useState("");
    const [showBuktiModal, setShowBuktiModal] = useState(false);
    const [selectedBukti, setSelectedBukti] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("PENDING");

    const { data: donasiPending, isLoading: loadingPending, refetch, error } = useDonasiPending();
    const { data: kegiatanResponse, isLoading: loadingKegiatan } = useKegiatanAktif({ limit: 100 });
    const { mutate: verifyDonasi, isPending: isVerifying } = useVerifyDonasi();

    const kegiatan = kegiatanResponse?.data.data || [];
    const donasi = donasiPending?.data || [];

    useEffect(() => {
        if (donasi) {
            setDonasiPending(donasi);
            calculateDashboardStats();
        }
    }, [donasi, setDonasiPending, calculateDashboardStats]);

    const stats = {
        totalPending: donasi?.filter(d => d.status === 'PENDING').length || 0,
        totalApproved: donasi?.filter(d => d.status === 'APPROVED').length || 0,
        totalRejected: donasi?.filter(d => d.status === 'REJECTED').length || 0,
        totalAmount: donasi?.filter(d => d.status === 'APPROVED').reduce((sum, d) => sum + d.amount, 0) || 0
    };

    const filteredDonasi = (donasi || []).filter(donasi => {
        const matchSearch = donasi.kegiatan?.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donasi.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donasi.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || donasi.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleVerifyDonasi = async () => {
        if (!selectedDonasi || !verifyAction) return;

        try {
            await verifyDonasi(
                {
                    donasiId: selectedDonasi.id,
                    data: {
                        action: verifyAction,
                        reason: verifyReason
                    }
                }
            );

            setSelectedDonasi(null);
            setVerifyAction("");
            setVerifyReason("");
            await refetch();
            
            // Success notification with better UX
            const successMessage = verifyAction === 'approve' ? 'Donasi berhasil disetujui! ✅' : 'Donasi berhasil ditolak! ❌';
            alert(successMessage);
        } catch (error) {
            console.error('Verify donasi error:', error);
            alert("❌ " + (error.response?.data?.message || "Gagal memverifikasi donasi"));
        }
    };

    const handleViewBukti = (buktiUrl) => {
        setSelectedBukti(buktiUrl);
        setShowBuktiModal(true);
    };

    const exportToCSV = () => {
        if (!filteredDonasi || filteredDonasi.length === 0) {
            alert("⚠️ Tidak ada data untuk diekspor");
            return;
        }

        const csvData = filteredDonasi.map(donasi => ({
            'Tanggal': formatDate(donasi.createdAt),
            'Kegiatan': donasi.kegiatan?.judul || '-',
            'Donatur': donasi.isAnonymous ? 'Anonim' : (donasi.donorName || '-'),
            'Email': donasi.donorEmail || '-',
            'Jumlah': donasi.amount,
            'Status': donasi.status,
            'Referensi': donasi.reference || '-'
        }));

        const csvContent = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donasi-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleRefresh = async () => {
        try {
            await refetch();
            alert("✅ Data berhasil diperbarui");
        } catch (error) {
            console.error('Refresh error:', error);
            alert("❌ Gagal memperbarui data");
        }
    };

    if (loadingPending || loadingKegiatan) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="relative">
                        <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
                        <div className="absolute inset-0 h-12 w-12 border-4 border-green-200 rounded-full animate-pulse mx-auto"></div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-lg font-medium">Memuat dashboard donasi...</span>
                        <div className="flex items-center justify-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
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
                    <p className="text-gray-600 mb-6 leading-relaxed">{error.message || "Terjadi kesalahan saat memuat data dashboard"}</p>
                    <Button onClick={handleRefresh} className="!rounded-xl px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
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
                        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent`}>
                                Dashboard Donasi
                            </h1>
                            <p className="text-gray-500 mt-1 font-medium">Kelola dan verifikasi donasi masyarakat dengan mudah</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={exportToCSV} 
                        disabled={filteredDonasi.length === 0}
                        className="!rounded-xl px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button 
                        onClick={handleRefresh} 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        title: "Pending", 
                        value: stats.totalPending, 
                        icon: Calendar, 
                        color: "from-orange-400 to-orange-500", 
                        bgColor: "bg-orange-100", 
                        textColor: "text-orange-600",
                        description: "Menunggu verifikasi"
                    },
                    { 
                        title: "Disetujui", 
                        value: stats.totalApproved, 
                        icon: CheckCircle, 
                        color: "from-green-400 to-green-500", 
                        bgColor: "bg-green-100", 
                        textColor: "text-green-600",
                        description: "Telah diverifikasi"
                    },
                    { 
                        title: "Ditolak", 
                        value: stats.totalRejected, 
                        icon: XCircle, 
                        color: "from-red-400 to-red-500", 
                        bgColor: "bg-red-100", 
                        textColor: "text-red-600",
                        description: "Tidak memenuhi syarat"
                    },
                    { 
                        title: "Total Dana", 
                        value: formatCurrency(stats.totalAmount).replace('Rp', 'Rp '), 
                        icon: DollarSign, 
                        color: "from-blue-400 to-blue-500", 
                        bgColor: "bg-blue-100", 
                        textColor: "text-blue-600",
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
                        
                        <CardContent className="p-8 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {stat.title}
                                    </p>
                                    <p className={`text-3xl font-bold mt-2 ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                                        {stat.isAmount ? stat.value : stat.value.toLocaleString()}
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {stat.description}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-2xl ${stat.bgColor} transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                                    <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
                                </div>
                            </div>
                            
                            {/* Progress bar for visual appeal */}
                            <div className="mt-4">
                                <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div 
                                        className={`h-full bg-gradient-to-r ${stat.color} transform transition-all duration-1000 ease-out`}
                                        style={{ 
                                            width: stat.isAmount ? '85%' : `${Math.min((stat.value / Math.max(...[stats.totalPending, stats.totalApproved, stats.totalRejected])) * 100, 100)}%` 
                                        }}
                                    ></div>
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
                                placeholder="🔍 Cari kegiatan, donatur, atau email..."
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
                                <option value="PENDING">⏳ Pending</option>
                                <option value="APPROVED">✅ Disetujui</option>
                                <option value="REJECTED">❌ Ditolak</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Donasi Table */}
            <Card className={`border-0 shadow-xl ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <span>Daftar Donasi ({filteredDonasi.length})</span>
                        {searchTerm && (
                            <Badge variant="outline" className="ml-2">
                                Hasil pencarian: "{searchTerm}"
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    {['Tanggal', 'Kegiatan', 'Donatur', 'Jumlah', 'Status', 'Aksi'].map((header, index) => (
                                        <th key={header} className="text-left p-6 font-bold text-base">
                                            <div className="flex items-center gap-2">
                                                {header === 'Tanggal' && <Calendar className="h-4 w-4" />}
                                                {header === 'Jumlah' && <DollarSign className="h-4 w-4" />}
                                                {header === 'Status' && <Activity className="h-4 w-4" />}
                                                {header}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDonasi.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-16">
                                            <div className="space-y-4">
                                                <div className="text-6xl">🔍</div>
                                                <div className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {searchTerm ? `Tidak ada donasi yang cocok dengan "${searchTerm}"` : "Belum ada data donasi"}
                                                </div>
                                                <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {!searchTerm && "Data donasi akan muncul setelah ada transaksi baru"}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDonasi.map((donasi, index) => (
                                        <tr
                                            key={donasi.id}
                                            className={`border-b transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                                                isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                            style={{
                                                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                                            }}
                                        >
                                            <td className="p-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium">
                                                        {formatDate(donasi.createdAt)}
                                                    </div>
                                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {new Date(donasi.createdAt).toLocaleTimeString('id-ID')}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="space-y-2">
                                                    <div className="font-semibold text-base line-clamp-2">
                                                        {donasi.kegiatan?.judul || '⚠️ Kegiatan Tidak Ditemukan'}
                                                    </div>
                                                    <div className={`text-xs px-3 py-1 rounded-full inline-block ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                        ID: {donasi.reference || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        {donasi.isAnonymous ? '🎭' : '👤'}
                                                        <span className="font-semibold">
                                                            {donasi.isAnonymous ? 'Anonim' : (donasi.donorName || donasi.donor?.name || 'N/A')}
                                                        </span>
                                                    </div>
                                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        📧 {donasi.donorEmail || 'N/A'}
                                                    </div>
                                                    {donasi.donorPhone && (
                                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            📱 {donasi.donorPhone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="space-y-1">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {formatCurrency(donasi.amount)}
                                                    </div>
                                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {donasi.paymentMethod || 'Transfer Bank'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="space-y-2">
                                                    <Badge
                                                        variant={
                                                            donasi.status === 'APPROVED'
                                                                ? 'default'
                                                                : donasi.status === 'PENDING'
                                                                    ? 'secondary'
                                                                    : 'destructive'
                                                        }
                                                        className="font-semibold px-3 py-1"
                                                    >
                                                        {donasi.status === 'APPROVED' ? '✅ Disetujui' :
                                                         donasi.status === 'PENDING' ? '⏳ Pending' : '❌ Ditolak'}
                                                    </Badge>
                                                    {donasi.verifiedAt && (
                                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {formatDate(donasi.verifiedAt)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewBukti(donasi.bukti_transfer_url)}
                                                        className="!rounded-xl hover:scale-110 transition-all duration-200"
                                                        disabled={!donasi.bukti_transfer_url}
                                                        title="Lihat Bukti Transfer"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {donasi.status === 'PENDING' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedDonasi(donasi);
                                                                    setVerifyAction('approve');
                                                                }}
                                                                className="!rounded-xl bg-green-600 hover:bg-green-700 hover:scale-110 transition-all duration-200"
                                                                title="Setujui Donasi"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    setSelectedDonasi(donasi);
                                                                    setVerifyAction('reject');
                                                                }}
                                                                className="!rounded-xl hover:scale-110 transition-all duration-200"
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

            {/* Verify Donasi Modal */}
            <Dialog open={!!selectedDonasi} onOpenChange={() => setSelectedDonasi(null)}>
                <DialogContent className={`max-w-2xl rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-3">
                            {verifyAction === 'approve' ? (
                                <>
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <span>✅ Setujui Donasi</span>
                                </>
                            ) : (
                                <>
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <span>❌ Tolak Donasi</span>
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedDonasi && (
                        <div className="space-y-6">
                            <div className={`p-6 rounded-2xl ${
                                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                            } border-l-4 ${
                                verifyAction === 'approve' ? 'border-green-500' : 'border-red-500'
                            }`}>
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    📋 Detail Donasi
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-500">🎯 Kegiatan:</span>
                                        <p className="mt-1 font-semibold">{selectedDonasi.kegiatan?.judul || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">👤 Donatur:</span>
                                        <p className="mt-1 font-semibold">
                                            {selectedDonasi.isAnonymous ? '🎭 Anonim' : (selectedDonasi.donorName || 'N/A')}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">💰 Jumlah:</span>
                                        <p className="mt-1 font-bold text-lg text-green-600">{formatCurrency(selectedDonasi.amount)}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">📅 Tanggal:</span>
                                        <p className="mt-1 font-semibold">{formatDate(selectedDonasi.createdAt)}</p>
                                    </div>
                                    {selectedDonasi.message && (
                                        <div className="md:col-span-2">
                                            <span className="font-medium text-gray-500">💬 Pesan:</span>
                                            <p className="mt-1 italic bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                                "{selectedDonasi.message}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="reason" className="text-base font-medium">
                                    {verifyAction === 'approve' ? 
                                        '📝 Catatan Persetujuan (Opsional)' : 
                                        '📝 Alasan Penolakan (Wajib) *'
                                    }
                                </Label>
                                <Textarea
                                    id="reason"
                                    value={verifyReason}
                                    onChange={(e) => setVerifyReason(e.target.value)}
                                    placeholder={
                                        verifyAction === 'approve'
                                            ? '💡 Tambahkan catatan jika diperlukan...'
                                            : '❓ Jelaskan alasan penolakan secara detail...'
                                    }
                                    rows={4}
                                    className="mt-2 rounded-xl border-2 resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedDonasi(null);
                                        setVerifyAction("");
                                        setVerifyReason("");
                                    }}
                                    className="flex-1 !rounded-xl py-3 text-base font-semibold"
                                    disabled={isVerifying}
                                >
                                    ❌ Batal
                                </Button>
                                <Button
                                    onClick={handleVerifyDonasi}
                                    className={`flex-1 !rounded-xl py-3 text-base font-semibold transition-all duration-200 ${
                                        verifyAction === 'approve'
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                                    } shadow-lg hover:shadow-xl hover:scale-105`}
                                    disabled={isVerifying || (verifyAction === 'reject' && !verifyReason.trim())}
                                >
                                    {isVerifying ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            ⏳ Memproses...
                                        </>
                                    ) : (
                                        verifyAction === 'approve' ? '✅ Setujui Donasi' : '❌ Tolak Donasi'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Bukti Transfer Modal */}
            <Dialog open={showBuktiModal} onOpenChange={setShowBuktiModal}>
                <DialogContent className={`max-w-4xl rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Eye className="h-6 w-6 text-blue-600" />
                            </div>
                            🧾 Bukti Transfer
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-center p-6">
                        {selectedBukti ? (
                            <div className="relative group">
                                <img
                                    src={selectedBukti}
                                    alt="Bukti Transfer"
                                    className="max-w-full max-h-96 object-contain rounded-2xl shadow-2xl border-4 border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-all duration-300"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/400x300?text=❌+Gambar+Tidak+Ditemukan";
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg transition-all duration-300">
                                        <span className="text-sm font-medium">🔍 Klik untuk memperbesar</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-gray-500 space-y-4">
                                <div className="text-6xl">🚫</div>
                                <AlertCircle className="h-12 w-12 text-gray-400" />
                                <div className="text-center">
                                    <p className="text-lg font-medium mb-2">Bukti transfer tidak tersedia</p>
                                    <p className="text-sm">File mungkin rusak atau tidak dapat diakses</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedBukti && (
                        <div className="flex justify-center space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                onClick={() => window.open(selectedBukti, '_blank')}
                                className="!rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                📥 Unduh Gambar
                            </Button>
                            <Button
                                onClick={() => navigator.clipboard.writeText(selectedBukti)}
                                variant="outline"
                                className="!rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <i className="fas fa-copy mr-2"></i>
                                📋 Salin Link
                            </Button>
                        </div>
                    )}
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

export default AdminDashboardDonasi;