import { useState } from "react";
import { Progress } from "../../ui/progress";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Checkbox } from "../../ui/checkbox";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

import { useCreateDonasi } from "@/hooks/bantuDesa/useDonasi";
import { uploadBuktiTransfer } from "@/services/apiBantuDesa";

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const DonasiProgress = ({
  terkumpul = 0,
  target = 0,
  deadline,
  jumlahDonatur = 0,
  progressPercentage = 0,
}) => {
  const { id: kegiatanId } = useParams();
  const [showDonasiModal, setShowDonasiModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    isAnonymous: false,
    message: "",
    bukti_transfer_url: "",
  });

  const { mutate: createDonasi, isPending } = useCreateDonasi();

  const daysLeft = deadline
    ? Math.max(
        0,
        Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadBuktiTransfer(file);
      handleInputChange("bukti_transfer_url", response.data.url);
    } catch (error) {
      alert("Gagal mengupload bukti transfer. Silakan coba lagi.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitDonasi = () => {
    if (!formData.amount || formData.amount < 10000) {
      alert("Minimal donasi adalah Rp 10.000");
      return;
    }

    if (!formData.bukti_transfer_url) {
      alert("Bukti transfer wajib diupload");
      return;
    }

    const donasiData = {
      ...formData,
      amount: parseInt(formData.amount),
    };

    createDonasi(
      { kegiatanId, data: donasiData },
      {
        onSuccess: () => {
          alert("Donasi berhasil dikirim! Menunggu verifikasi admin.");
          setShowDonasiModal(false);
          setFormData({
            amount: "",
            donorName: "",
            donorEmail: "",
            donorPhone: "",
            isAnonymous: false,
            message: "",
            bukti_transfer_url: "",
          });
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Gagal mengirim donasi");
        },
      }
    );
  };

  return (
    <>
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Donasi</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Terkumpul: {formatCurrency(terkumpul)}</span>
                    <span>Target: {formatCurrency(target)}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      ⏳ Sisa waktu: {daysLeft > 0 ? `${daysLeft} hari` : "Sudah berakhir"}
                    </div>
                    <div className="text-sm text-gray-600">👥 {jumlahDonatur} donatur</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {progressPercentage.toFixed(1)}% dari target tercapai
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    size="lg"
                    onClick={() => setShowDonasiModal(true)}
                    disabled={daysLeft <= 0}
                    className="!rounded-button whitespace-nowrap w-full"
                  >
                    ❤️ {daysLeft > 0 ? "Donasi Sekarang" : "Kegiatan Berakhir"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modal Donasi */}
      <Dialog open={showDonasiModal} onOpenChange={setShowDonasiModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Form Donasi</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Jumlah Donasi *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Minimal Rp 10.000"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                min="10000"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) => handleInputChange("isAnonymous", checked)}
              />
              <Label htmlFor="anonymous">Donasi sebagai anonim</Label>
            </div>

            {!formData.isAnonymous && (
              <>
                <div>
                  <Label htmlFor="donorName">Nama Donatur</Label>
                  <Input
                    id="donorName"
                    value={formData.donorName}
                    onChange={(e) => handleInputChange("donorName", e.target.value)}
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <Label htmlFor="donorEmail">Email</Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    value={formData.donorEmail}
                    onChange={(e) => handleInputChange("donorEmail", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="donorPhone">No. Telepon</Label>
                  <Input
                    id="donorPhone"
                    value={formData.donorPhone}
                    onChange={(e) => handleInputChange("donorPhone", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="message">Pesan (Opsional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Tuliskan pesan atau doa untuk kegiatan ini..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="buktiTransfer">Bukti Transfer *</Label>
              <Input
                id="buktiTransfer"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                disabled={uploading}
              />
              {uploading && (
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Mengupload...
                </div>
              )}
              {formData.bukti_transfer_url && (
                <div className="mt-2 text-sm text-green-600">✅ Bukti transfer berhasil diupload</div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDonasiModal(false)}
                className="flex-1"
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmitDonasi}
                className="flex-1"
                disabled={isPending || uploading || !formData.bukti_transfer_url}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Donasi"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonasiProgress;
