import { useState } from "react";
import { Progress } from "../../ui/progress";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Checkbox } from "../../ui/checkbox";
import {
  Loader2,
  Heart,
  Users,
  Target,
  Clock,
  TrendingUp,
  Gift,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { useCreateDonasi } from "@/hooks/bantuDesa/useDonasi";
import { uploadBuktiTransfer } from "@/services/apiBantuDesa";
import useThemeStore from "@/store/theme";

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
  const { isDarkMode } = useThemeStore();
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
        Math.ceil(
          (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
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

    // Validasi file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Hanya file gambar (JPG, PNG) yang diizinkan");
      return;
    }

    // Validasi file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadBuktiTransfer(file);

      // Handle different response structures
      const imageUrl = response.data?.url || response.data?.data?.url;

      if (imageUrl) {
        handleInputChange("bukti_transfer_url", imageUrl);
        toast.success("Bukti transfer berhasil diupload");
      } else {
        throw new Error("URL tidak ditemukan dalam response");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal mengupload bukti transfer";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    if (!formData.amount || parseInt(formData.amount) < 10000) {
      toast.error("Minimal donasi adalah Rp 10.000");
      return false;
    }

    if (!formData.bukti_transfer_url) {
      toast.error("Bukti transfer wajib diupload");
      return false;
    }

    if (!formData.isAnonymous) {
      if (!formData.donorName.trim()) {
        toast.error("Nama donatur wajib diisi");
        return false;
      }
      if (!formData.donorEmail.trim()) {
        toast.error("Email donatur wajib diisi");
        return false;
      }
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      donorName: "",
      donorEmail: "",
      donorPhone: "",
      isAnonymous: false,
      message: "",
      bukti_transfer_url: "",
    });
  };

  const handleSubmitDonasi = () => {
    if (!validateForm()) return;

    const donasiData = {
      ...formData,
      amount: parseInt(formData.amount),
    };

    createDonasi(
      { kegiatanId, data: donasiData },
      {
        onSuccess: (response) => {
          toast.success("Donasi berhasil dikirim! Menunggu verifikasi admin.");
          setShowDonasiModal(false);
          resetForm();
          // Refresh halaman atau invalidate query jika perlu
          window.location.reload();
        },
        onError: (error) => {
          console.error("Donasi error:", error);
          const errorMessage =
            error.response?.data?.message || "Gagal mengirim donasi";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleCloseModal = () => {
    if (!isPending && !uploading) {
      setShowDonasiModal(false);
      resetForm();
    }
  };

  // Quick donation amounts
  const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  return (
    <>
      <section
        className={`py-12 relative ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20"
        }`}
      >
        {/* Enhanced floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-400/5 via-green-500/5 to-emerald-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-green-400/5 via-emerald-500/5 to-green-600/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/20 rounded-full animate-float"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Card
            className={`border-0 shadow-2xl overflow-hidden ${
              isDarkMode
                ? "bg-gray-800/50 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm"
            }`}
          >
            <CardContent className="p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                    Progress Donasi
                  </h3>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Target Dana",
                        value: formatCurrency(target),
                        icon: Target,
                        color: "from-emerald-400 to-emerald-500",
                        bgColor: "bg-emerald-100",
                        textColor: "text-emerald-600",
                      },
                      {
                        label: "Terkumpul",
                        value: formatCurrency(terkumpul),
                        icon: TrendingUp,
                        color: "from-green-400 to-green-500",
                        bgColor: "bg-green-100",
                        textColor: "text-green-600",
                      },
                      {
                        label: "Donatur",
                        value: `${jumlahDonatur} orang`,
                        icon: Users,
                        color: "from-emerald-400 to-green-500",
                        bgColor: "bg-emerald-100",
                        textColor: "text-emerald-600",
                      },
                      {
                        label: "Sisa Waktu",
                        value: daysLeft > 0 ? `${daysLeft} hari` : "Berakhir",
                        icon: Clock,
                        color:
                          daysLeft <= 7
                            ? "from-orange-400 to-red-400"
                            : "from-emerald-400 to-green-500",
                        bgColor:
                          daysLeft <= 7 ? "bg-orange-100" : "bg-emerald-100",
                        textColor:
                          daysLeft <= 7 ? "text-orange-600" : "text-emerald-600",
                      },
                    ].map((stat, index) => (
                      <div
                        key={stat.label}
                        className={`p-4 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                          isDarkMode
                            ? "bg-gray-700/50 border border-gray-600"
                            : "bg-gray-50/80 border border-gray-200"
                        }`}
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${
                            index * 0.1
                          }s both`,
                        }}
                      >
                        <div
                          className={`p-2 mx-auto mb-2 w-fit rounded-xl ${stat.bgColor}`}
                        >
                          <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                        </div>
                        <div
                          className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {stat.label}
                        </div>
                        <div
                          className={`text-sm md:text-base font-black ${stat.textColor}`}
                        >
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-lg font-bold ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Progress Pencapaian
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            progressPercentage >= 100 ? "default" : "outline"
                          }
                          className={`font-bold px-3 py-1 ${
                            progressPercentage >= 100
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white animate-pulse"
                              : ""
                          }`}
                        >
                          {progressPercentage.toFixed(1)}% tercapai
                        </Badge>
                      </div>
                    </div>

                    <div className="relative">
                      <Progress
                        value={Math.min(progressPercentage, 100)}
                        className="h-4 md:h-6"
                      />
                      {progressPercentage >= 100 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 rounded-full animate-pulse opacity-75"></div>
                      )}
                    </div>

                    {progressPercentage >= 100 && (
                      <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                        <span className="text-emerald-800 dark:text-emerald-300 font-bold text-lg">
                          Target donasi telah tercapai!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Achievement Milestones */}
                  <div className="space-y-2">
                    <h4
                      className={`text-lg font-bold ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Pencapaian Milestone
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[25, 50, 75, 100].map((milestone) => (
                        <Badge
                          key={milestone}
                          variant={
                            progressPercentage >= milestone
                              ? "default"
                              : "outline"
                          }
                          className={`px-3 py-1 ${
                            progressPercentage >= milestone
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                              : ""
                          }`}
                        >
                          {milestone}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Donation Button Section */}
                <div className="flex flex-col justify-center">
                  <div
                    className={`p-8 rounded-2xl text-center ${
                      isDarkMode
                        ? "bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-emerald-600/20"
                        : "bg-gradient-to-br from-emerald-50/80 to-green-50/80 border border-emerald-200/50"
                    }`}
                  >
                    <div className="mb-6">
                      <Gift
                        className={`h-16 w-16 mx-auto mb-4 ${
                          daysLeft <= 0 ? "text-gray-400" : "text-emerald-500"
                        }`}
                      />
                      <h4
                        className={`text-2xl font-black mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Bantu Wujudkan Mimpi Bersama
                      </h4>
                      <p
                        className={`text-sm leading-relaxed ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Setiap kontribusi Anda sangat berarti untuk kesuksesan
                        kegiatan ini
                      </p>
                    </div>

                    {daysLeft > 0 && (
                      <div
                        className={`mb-6 p-4 rounded-xl ${
                          daysLeft <= 7
                            ? "bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800/20"
                            : isDarkMode
                            ? "bg-emerald-600/20"
                            : "bg-emerald-100/50"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Clock
                            className={`h-5 w-5 ${
                              daysLeft <= 7
                                ? "text-orange-600"
                                : "text-emerald-500"
                            }`}
                          />
                          <span
                            className={`font-bold ${
                              daysLeft <= 7
                                ? "text-orange-800 dark:text-orange-300"
                                : isDarkMode
                                ? "text-emerald-300"
                                : "text-emerald-700"
                            }`}
                          >
                            {daysLeft <= 7
                              ? "Segera Berakhir!"
                              : `Masih ${daysLeft} hari lagi`}
                          </span>
                        </div>
                       
                        <Button
                          size="lg"
                          onClick={() => setShowDonasiModal(true)}
                          disabled={daysLeft <= 0}
                          className={`w-full !rounded-2xl px-8 py-4 text-lg font-bold shadow-xl transform transition-all duration-300 ${
                            daysLeft <= 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:scale-105 hover:shadow-emerald-500/25"
                          }`}
                        >
                          <Heart className="h-5 w-5 mr-3" />
                          {daysLeft > 0
                            ? "Donasi Sekarang"
                            : "Kegiatan Berakhir"}
                        </Button>
                        {daysLeft <= 0 && (
                          <p
                            className={`mt-4 text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Periode donasi telah berakhir
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Modal Donasi */}
      <Dialog open={showDonasiModal} onOpenChange={handleCloseModal}>
        <DialogContent
          className={`max-w-2xl max-h-[90vh] overflow-y-auto !rounded-2xl ${
            isDarkMode
              ? "bg-gray-800 border-emerald-700/30"
              : "bg-white border-emerald-200/50"
          }`}
        >
          <DialogHeader className="pb-6 border-b border-emerald-200/20 dark:border-emerald-700/20">
            <DialogTitle className="text-3xl flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span>Form Donasi</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-6">
            {/* Quick Amount Selection */}
            <div>
              <Label className="text-base font-bold mb-4 block">
                Pilih Jumlah Donasi Cepat
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={
                      formData.amount === amount.toString()
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleInputChange("amount", amount.toString())
                    }
                    className={`!rounded-xl py-3 font-bold transition-all duration-200 ${
                      formData.amount === amount.toString()
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 transform scale-105"
                        : "hover:scale-105"
                    }`}
                    disabled={isPending}
                  >
                    {formatCurrency(amount).replace("Rp", "").trim()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <Label htmlFor="amount" className="text-base font-bold">
                Atau Masukkan Jumlah Custom *
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Minimal Rp 10.000"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                min="10000"
                step="1000"
                disabled={isPending}
                className="mt-2 !rounded-xl border-2 py-3 text-lg"
              />
              <p
                className={`text-sm mt-2 font-medium ${
                  formData.amount ? "text-emerald-600" : "text-gray-500"
                }`}
              >
                Jumlah:{" "}
                {formData.amount
                  ? formatCurrency(parseInt(formData.amount) || 0)
                  : "Rp 0"}
              </p>
            </div>

            {/* Anonymous Checkbox */}
            <div
              className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${
                isDarkMode
                  ? "bg-gray-700/30 border-emerald-600/20"
                  : "bg-emerald-50/50 border-emerald-200/50"
              }`}
            >
              <Checkbox
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) =>
                  handleInputChange("isAnonymous", checked)
                }
                disabled={isPending}
                className="!rounded-lg"
              />
              <div>
                <Label htmlFor="anonymous" className="font-bold cursor-pointer">
                  Donasi sebagai anonim
                </Label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Nama Anda tidak akan ditampilkan secara publik
                </p>
              </div>
            </div>

            {/* Donor Information */}
            {!formData.isAnonymous && (
              <div
                className={`grid gap-4 p-6 rounded-2xl border ${
                  isDarkMode
                    ? "bg-gray-700/30 border-emerald-600/20"
                    : "bg-emerald-50/50 border-emerald-200/50"
                }`}
              >
                <h4
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Informasi Donatur
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="donorName" className="font-bold">
                      Nama Donatur *
                    </Label>
                    <Input
                      id="donorName"
                      value={formData.donorName}
                      onChange={(e) =>
                        handleInputChange("donorName", e.target.value)
                      }
                      placeholder="Nama lengkap"
                      disabled={isPending}
                      className="mt-2 !rounded-xl border-2 py-3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="donorEmail" className="font-bold">
                      Email *
                    </Label>
                    <Input
                      id="donorEmail"
                      type="email"
                      value={formData.donorEmail}
                      onChange={(e) =>
                        handleInputChange("donorEmail", e.target.value)
                      }
                      placeholder="email@example.com"
                      disabled={isPending}
                      className="mt-2 !rounded-xl border-2 py-3"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="donorPhone" className="font-bold">
                    No. Telepon (Opsional)
                  </Label>
                  <Input
                    id="donorPhone"
                    value={formData.donorPhone}
                    onChange={(e) =>
                      handleInputChange("donorPhone", e.target.value)
                    }
                    placeholder="08xxxxxxxxxx"
                    disabled={isPending}
                    className="mt-2 !rounded-xl border-2 py-3"
                  />
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <Label htmlFor="message" className="font-bold">
                Pesan Dukungan (Opsional)
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Tuliskan pesan atau doa untuk kegiatan ini..."
                rows={4}
                disabled={isPending}
                className="mt-2 !rounded-xl border-2 resize-none"
              />
            </div>

            {/* File Upload */}
            <div
              className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                formData.bukti_transfer_url
                  ? isDarkMode
                    ? "border-emerald-500 bg-emerald-900/20"
                    : "border-emerald-500 bg-emerald-50"
                  : uploading
                  ? isDarkMode
                    ? "border-emerald-500 bg-emerald-900/20"
                    : "border-emerald-500 bg-emerald-50"
                  : isDarkMode
                  ? "border-gray-600 bg-gray-700/30 hover:border-emerald-500"
                  : "border-gray-300 bg-gray-50 hover:border-emerald-400"
              }`}
            >
              <div className="text-center">
                {formData.bukti_transfer_url ? (
                  <div>
                    <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                    <p className="text-emerald-600 font-bold mb-4">
                      Bukti transfer berhasil diupload!
                    </p>
                    <img
                      src={formData.bukti_transfer_url}
                      alt="Preview bukti transfer"
                      className="w-40 h-40 object-cover rounded-xl mx-auto border-4 border-emerald-200 shadow-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                ) : uploading ? (
                  <div>
                    <Loader2 className="h-12 w-12 text-emerald-500 mx-auto mb-4 animate-spin" />
                    <p className="text-emerald-600 font-bold">
                      Mengupload bukti transfer...
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload
                      className={`h-12 w-12 mx-auto mb-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <Label
                      htmlFor="buktiTransfer"
                      className="font-bold cursor-pointer"
                    >
                      Upload Bukti Transfer *
                    </Label>
                    <p
                      className={`text-sm mt-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Format: JPG, PNG. Maksimal 5MB
                    </p>
                  </div>
                )}

                <Input
                  id="buktiTransfer"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  disabled={uploading || isPending}
                  className="mt-4 !rounded-xl border-2"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-emerald-200/20 dark:border-emerald-700/20">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1 !rounded-xl py-3 text-base font-bold border-2"
                disabled={isPending || uploading}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmitDonasi}
                className="flex-1 !rounded-xl py-3 text-base font-bold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-200"
                disabled={
                  isPending ||
                  uploading ||
                  !formData.bukti_transfer_url ||
                  !formData.amount
                }
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Mengirim Donasi...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Kirim Donasi
                  </>
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
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6; 
          }
          33% { 
            transform: translateY(-10px) rotate(5deg); 
            opacity: 1; 
          }
          66% { 
            transform: translateY(-5px) rotate(-5deg); 
            opacity: 0.8; 
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.6; 
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.8; 
          }
        }
        
        .animate-float { 
          animation: float linear infinite; 
        }
        
        .animate-pulse-slow { 
          animation: pulse-slow 4s ease-in-out infinite; 
        }
      `}</style>
    </>
  );
};

export default DonasiProgress;