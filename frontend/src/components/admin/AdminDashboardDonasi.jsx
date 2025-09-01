import { useState } from "react";
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
  Filter
} from "lucide-react";
import { useDonasiPending, useVerifyDonasi } from "@/hooks/bantuDesa/useDonasi";
import { useKegiatanAktif } from "@/hooks/bantuDesa/useKegiatan";
import useThemeStore from "@/store/theme";

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
  const [selectedDonasi, setSelectedDonasi] = useState(null);
  const [verifyAction, setVerifyAction] = useState("");
  const [verifyReason, setVerifyReason] = useState("");
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [selectedBukti, setSelectedBukti] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("PENDING");

  const { data: donasiPending, isLoading: loadingPending, refetch } = useDonasiPending();
  const { data: kegiatanResponse, isLoading: loadingKegiatan } = useKegiatanAktif({ limit: 100 });
  const { mutate: verifyDonasi, isPending: isVerifying } = useVerifyDonasi();

  const kegiatan = kegiatanResponse?.data || [];

  // Calculate statistics
  const stats = {
    totalPending: donasiPending?.filter(d => d.status === 'PENDING').length || 0,
    totalApproved: donasiPending?.filter(d => d.status === 'APPROVED').length || 0,
    totalRejected: donasiPending?.filter(d => d.status === 'REJECTED').length || 0,
    totalAmount: donasiPending?.filter(d => d.status === 'APPROVED').reduce((sum, d) => sum + d.amount, 0) || 0
  };

  // Filter donasi based on search and status
  const filteredDonasi = (donasiPending || []).filter(donasi => {
    const matchSearch = donasi.kegiatan.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       donasi.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       donasi.donorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || donasi.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleVerifyDonasi = () => {
    if (!selectedDonasi || !verifyAction) return;

    verifyDonasi(
      { 
        donasiId: selectedDonasi.id, 
        data: { 
          action: verifyAction, 
          reason: verifyReason 
        }
      },
      {
        onSuccess: () => {
          setSelectedDonasi(null);
          setVerifyAction("");
          setVerifyReason("");
          refetch();
          alert(`Donasi berhasil ${verifyAction === 'approve' ? 'disetujui' : 'ditolak'}`);
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Gagal memverifikasi donasi");
        }
      }
    );
  };

  const handleViewBukti = (buktiUrl) => {
    setSelectedBukti(buktiUrl);
    setShowBuktiModal(true);
  };

  const exportToCSV = () => {
    const csvData = filteredDonasi.map(donasi => ({
      'Tanggal': formatDate(donasi.createdAt),
      'Kegiatan': donasi.kegiatan.judul,
      'Donatur': donasi.isAnonymous ? 'Anonim' : donasi.donorName,
      'Email': donasi.donorEmail,
      'Jumlah': donasi.amount,
      'Status': donasi.status,
      'Referensi': donasi.reference
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
    a.click();
  };

  if (loadingPending || loadingKegiatan) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" />
          <span className="text-lg font-medium">Memuat data dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Donasi</h1>
          <p className="text-gray-500 mt-1">Kelola dan verifikasi donasi masyarakat</p>
        </div>
        <Button onClick={exportToCSV} className="!rounded-button">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalPending}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Disetujui</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalApproved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalRejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Dana</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalAmount).replace('Rp', 'Rp ')}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari kegiatan, donatur, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-3 py-2 rounded-md border text-sm ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Disetujui</option>
                <option value="REJECTED">Ditolak</option>
              </select>
              <Button onClick={() => refetch()} variant="outline" className="!rounded-button">
                <Filter className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donasi Table */}
      <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar Donasi ({filteredDonasi.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left p-4 font-medium">Tanggal</th>
                  <th className="text-left p-4 font-medium">Kegiatan</th>
                  <th className="text-left p-4 font-medium">Donatur</th>
                  <th className="text-left p-4 font-medium">Jumlah</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonasi.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-500">
                      Tidak ada data donasi
                    </td>
                  </tr>
                ) : (
                  filteredDonasi.map((donasi) => (
                    <tr 
                      key={donasi.id} 
                      className={`border-b hover:bg-gray-50 ${
                        isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <td className="p-4 text-sm">
                        {formatDate(donasi.createdAt)}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{donasi.kegiatan.judul}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Ref: {donasi.reference}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">
                            {donasi.isAnonymous ? 'Anonim' : donasi.donorName || donasi.donor?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {donasi.donorEmail}
                          </p>
                          {donasi.donorPhone && (
                            <p className="text-xs text-gray-500">
                              {donasi.donorPhone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-lg text-green-600">
                          {formatCurrency(donasi.amount)}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            donasi.status === 'APPROVED'
                              ? 'default'
                              : donasi.status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {donasi.status === 'APPROVED' 
                            ? 'Disetujui' 
                            : donasi.status === 'PENDING'
                            ? 'Pending'
                            : 'Ditolak'
                          }
                        </Badge>
                        {donasi.verifiedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(donasi.verifiedAt)}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewBukti(donasi.bukti_transfer_url)}
                            className="!rounded-button"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {donasi.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => {
                                  setSelectedDonasi(donasi);
                                  setVerifyAction('approve');
                                }}
                                className="!rounded-button bg-green-600 hover:bg-green-700"
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
                                className="!rounded-button"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {verifyAction === 'approve' ? 'Setujui' : 'Tolak'} Donasi
            </DialogTitle>
          </DialogHeader>
          
          {selectedDonasi && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <h4 className="font-medium mb-2">Detail Donasi</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Kegiatan:</strong> {selectedDonasi.kegiatan.judul}</p>
                  <p><strong>Donatur:</strong> {selectedDonasi.isAnonymous ? 'Anonim' : selectedDonasi.donorName}</p>
                  <p><strong>Jumlah:</strong> {formatCurrency(selectedDonasi.amount)}</p>
                  <p><strong>Tanggal:</strong> {formatDate(selectedDonasi.createdAt)}</p>
                  {selectedDonasi.message && (
                    <p><strong>Pesan:</strong> {selectedDonasi.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="reason">
                  {verifyAction === 'approve' ? 'Catatan Persetujuan (Opsional)' : 'Alasan Penolakan *'}
                </Label>
                <Textarea
                  id="reason"
                  value={verifyReason}
                  onChange={(e) => setVerifyReason(e.target.value)}
                  placeholder={
                    verifyAction === 'approve' 
                      ? 'Tambahkan catatan jika diperlukan...'
                      : 'Jelaskan alasan penolakan...'
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDonasi(null)}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleVerifyDonasi}
                  className={`flex-1 ${
                    verifyAction === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={isVerifying || (verifyAction === 'reject' && !verifyReason.trim())}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Memproses...
                    </>
                  ) : (
                    verifyAction === 'approve' ? 'Setujui' : 'Tolak'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bukti Transfer Modal */}
      <Dialog open={showBuktiModal} onOpenChange={setShowBuktiModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bukti Transfer</DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-center">
            <img
              src={selectedBukti}
              alt="Bukti Transfer"
              className="max-w-full max-h-96 object-contain rounded-lg"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x300?text=Gambar+Tidak+Ditemukan";
              }}
            />
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => window.open(selectedBukti, '_blank')}
              className="!rounded-button"
            >
              <Download className="h-4 w-4 mr-2" />
              Unduh Gambar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
    export default AdminDashboardDonasi;