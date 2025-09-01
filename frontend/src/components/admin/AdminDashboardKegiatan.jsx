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
    AlertCircle
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
            alert("Kegiatan berhasil dibuat!");
        } catch (error) {
            console.error('Create kegiatan error:', error);
            alert(error.response?.data?.message || "Gagal membuat kegiatan");
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
            alert("Kegiatan berhasil diperbarui!");
        } catch (error) {
            console.error('Update kegiatan error:', error);
            alert(error.response?.data?.message || "Gagal memperbarui kegiatan");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) return;

        try {
            await deleteKegiatan(id);
            await refetch();
            alert("Kegiatan berhasil dihapus!");
        } catch (error) {
            console.error('Delete kegiatan error:', error);
            alert(error.response?.data?.message || "Gagal menghapus kegiatan");
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
            item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
        return matchSearch && matchStatus;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" />
                    <span className="text-lg font-medium">Memuat data kegiatan...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Gagal Memuat Data</h3>
                    <p className="text-gray-600 mb-4">{error.message || "Terjadi kesalahan"}</p>
                    <Button onClick={() => refetch()} className="!rounded-button">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Coba Lagi
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Kelola Kegiatan</h1>
                    <p className="text-gray-500 mt-1">Kelola kegiatan desa dan program bantuan</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowCreateModal(true)} className="!rounded-button">
                        <Plus className="h-4 w-4 mr-2" />
                        Buat Kegiatan
                    </Button>
                    <Button onClick={() => refetch()} variant="outline" className="!rounded-button">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari kegiatan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`px-3 py-2 rounded-md border text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}
                            >
                                <option value="ALL">Semua Status</option>
                                <option value="AKTIF">Aktif</option>
                                <option value="SELESAI">Selesai</option>
                                <option value="DIBATALKAN">Dibatalkan</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Kegiatan List */}
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Daftar Kegiatan ({filteredKegiatan.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredKegiatan.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {searchTerm ? `Tidak ada kegiatan yang cocok dengan "${searchTerm}"` : "Belum ada kegiatan"}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredKegiatan.map((item) => (
                                <Card key={item.id} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                                        <img
                                            src={item.foto_url || `https://readdy.ai/api/search-image?query=Indonesian%20village%20activity&width=400&height=200&seq=${item.id}`}
                                            alt={item.judul}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = `https://readdy.ai/api/search-image?query=Indonesian%20village%20activity&width=400&height=200&seq=${item.id}`;
                                            }}
                                        />
                                        <div className="absolute top-3 right-3">
                                            <Badge
                                                variant={
                                                    item.status === 'AKTIF' ? 'default' :
                                                        item.status === 'SELESAI' ? 'secondary' : 'destructive'
                                                }
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.judul}</h3>

                                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4" />
                                                <span>Target: {formatCurrency(item.target_dana)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span>Terkumpul: {formatCurrency(item.dana_terkumpul || 0)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEditModal(item)}
                                                className="flex-1 !rounded-button"
                                            >
                                                <Edit3 className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isDeleting}
                                                className="!rounded-button"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Buat Kegiatan Baru</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="judul">Judul Kegiatan *</Label>
                            <Input
                                id="judul"
                                value={formData.judul}
                                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                placeholder="Masukkan judul kegiatan"
                            />
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                value={formData.deskripsi}
                                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                placeholder="Deskripsi kegiatan"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="target_dana">Target Dana *</Label>
                                <Input
                                    id="target_dana"
                                    type="number"
                                    value={formData.target_dana}
                                    onChange={(e) => setFormData({ ...formData, target_dana: e.target.value })}
                                    placeholder="Target dana dalam Rupiah"
                                />
                            </div>

                            <div>
                                <Label htmlFor="kategori">Kategori</Label>
                                <select
                                    id="kategori"
                                    value={formData.kategori}
                                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                    className={`w-full px-3 py-2 rounded-md border text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                                        }`}
                                >
                                    <option value="PEMBANGUNAN">Pembangunan</option>
                                    <option value="KESEHATAN">Kesehatan</option>
                                    <option value="PENDIDIKAN">Pendidikan</option>
                                    <option value="LINGKUNGAN">Lingkungan</option>
                                    <option value="SOSIAL">Sosial</option>
                                    <option value="EKONOMI">Ekonomi</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
                                <Input
                                    id="tanggal_mulai"
                                    type="date"
                                    value={formData.tanggal_mulai}
                                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="tanggal_selesai">Tanggal Selesai *</Label>
                                <Input
                                    id="tanggal_selesai"
                                    type="date"
                                    value={formData.tanggal_selesai}
                                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="lokasi">Lokasi</Label>
                            <Input
                                id="lokasi"
                                value={formData.lokasi}
                                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                placeholder="Lokasi kegiatan"
                            />
                        </div>

                        <div>
                            <Label htmlFor="foto_url">URL Foto</Label>
                            <Input
                                id="foto_url"
                                value={formData.foto_url}
                                onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                                className="flex-1"
                                disabled={isCreating}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleCreate}
                                className="flex-1"
                                disabled={isCreating || !formData.judul || !formData.target_dana || !formData.tanggal_mulai || !formData.tanggal_selesai}
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        Membuat...
                                    </>
                                ) : (
                                    'Buat Kegiatan'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Kegiatan</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-judul">Judul Kegiatan *</Label>
                            <Input
                                id="edit-judul"
                                value={formData.judul}
                                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                placeholder="Masukkan judul kegiatan"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-deskripsi">Deskripsi</Label>
                            <Textarea
                                id="edit-deskripsi"
                                value={formData.deskripsi}
                                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                placeholder="Deskripsi kegiatan"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-target_dana">Target Dana *</Label>
                                <Input
                                    id="edit-target_dana"
                                    type="number"
                                    value={formData.target_dana}
                                    onChange={(e) => setFormData({ ...formData, target_dana: e.target.value })}
                                    placeholder="Target dana dalam Rupiah"
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-kategori">Kategori</Label>
                                <select
                                    id="edit-kategori"
                                    value={formData.kategori}
                                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                    className={`w-full px-3 py-2 rounded-md border text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                                        }`}
                                >
                                    <option value="PEMBANGUNAN">Pembangunan</option>
                                    <option value="KESEHATAN">Kesehatan</option>
                                    <option value="PENDIDIKAN">Pendidikan</option>
                                    <option value="LINGKUNGAN">Lingkungan</option>
                                    <option value="SOSIAL">Sosial</option>
                                    <option value="EKONOMI">Ekonomi</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-tanggal_mulai">Tanggal Mulai *</Label>
                                <Input
                                    id="edit-tanggal_mulai"
                                    type="date"
                                    value={formData.tanggal_mulai}
                                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-tanggal_selesai">Tanggal Selesai *</Label>
                                <Input
                                    id="edit-tanggal_selesai"
                                    type="date"
                                    value={formData.tanggal_selesai}
                                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="edit-lokasi">Lokasi</Label>
                            <Input
                                id="edit-lokasi"
                                value={formData.lokasi}
                                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                placeholder="Lokasi kegiatan"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-foto_url">URL Foto</Label>
                            <Input
                                id="edit-foto_url"
                                value={formData.foto_url}
                                onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedKegiatan(null);
                                    resetForm();
                                }}
                                className="flex-1"
                                disabled={isUpdating}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleEdit}
                                className="flex-1"
                                disabled={isUpdating || !formData.judul || !formData.target_dana || !formData.tanggal_mulai || !formData.tanggal_selesai}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Perubahan'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminDashboardKegiatan;