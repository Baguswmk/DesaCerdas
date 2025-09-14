import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Shield,
  ExternalLink,
} from "lucide-react";
import useThemeStore from "@/store/theme";

const InformasiKontak = ({ creator }) => {
  const { isDarkMode } = useThemeStore();

  const handleWhatsAppContact = () => {
    if (creator?.phone) {
      const phone = creator.phone.replace(/^0/, "62");
      const message = encodeURIComponent(
        "Halo, saya ingin bertanya tentang kegiatan yang sedang berlangsung."
      );
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    } else {
      toast.error("Nomor WhatsApp tidak tersedia");
    }
  };

  const handleEmailContact = () => {
    if (creator?.email) {
      const subject = encodeURIComponent("Pertanyaan tentang Kegiatan Desa");
      const body = encodeURIComponent(
        "Halo, saya ingin bertanya tentang kegiatan yang sedang berlangsung."
      );
      window.open(
        `mailto:${creator.email}?subject=${subject}&body=${body}`,
        "_blank"
      );
    } else {
      toast.error("Email tidak tersedia");
    }
  };

  const handlePhoneCall = () => {
    if (creator?.phone) {
      window.open(`tel:${creator.phone}`, "_blank");
    } else {
      toast.error("Nomor telepon tidak tersedia");
    }
  };

  return (
    <>
      <section
        className={`relative py-16 overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900/30"
            : "bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/20"
        }`}
      >
        {/* Background Elements matching Hero.jsx */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-emerald-100/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-300/25 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Informasi Kontak
              </h2>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto mb-4" />
            <p
              className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Hubungi penanggung jawab untuk informasi lebih lanjut tentang
              kegiatan ini
            </p>
          </div>

          <Card
            className={`border-0 shadow-2xl overflow-hidden backdrop-blur-sm ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/15"
                : "bg-white/80 hover:bg-white/90"
            } transition-all duration-300 hover:shadow-emerald-500/10`}
          >
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Contact Info */}
                <div className="p-6 sm:p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3
                      className={`text-2xl sm:text-3xl font-black ${
                        isDarkMode ? "text-emerald-200" : "text-emerald-800"
                      }`}
                    >
                      Penanggung Jawab
                    </h3>
                  </div>

                  {/* Contact Card */}
                  <div
                    className={`p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      isDarkMode
                        ? "bg-white/10 border-emerald-500/20 hover:bg-white/15 hover:border-emerald-500/30"
                        : "bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/80 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                          isDarkMode
                            ? "bg-emerald-600/20 border border-emerald-500/30"
                            : "bg-white border border-emerald-200"
                        }`}
                      >
                        <User
                          className={`h-6 w-6 sm:h-8 sm:w-8 ${
                            isDarkMode ? "text-emerald-300" : "text-emerald-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-lg sm:text-xl font-bold truncate ${
                            isDarkMode ? "text-emerald-200" : "text-emerald-800"
                          }`}
                        >
                          {creator?.name || "Admin Desa"}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-xs font-medium border-emerald-300 ${
                            isDarkMode
                              ? "text-emerald-300 bg-emerald-900/20"
                              : "text-emerald-600 bg-emerald-50"
                          }`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Terverifikasi
                        </Badge>

                        <p
                          className={`text-xs sm:text-sm font-medium mt-2 ${
                            isDarkMode ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          Koordinator Kegiatan Desa
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div
                    className={`p-4 rounded-xl flex items-center gap-3 border ${
                      isDarkMode
                        ? "bg-emerald-900/20 border border-emerald-800/30"
                        : "bg-emerald-50/80 border border-emerald-200"
                    }`}
                  >
                    <Clock className="h-5 w-5 text-emerald-500" />
                    <div>
                      <div
                        className={`text-sm font-bold ${
                          isDarkMode ? "text-emerald-200" : "text-emerald-800"
                        }`}
                      >
                        Waktu Respons: 1-2 Jam
                      </div>
                      <div
                        className={`text-xs ${
                          isDarkMode ? "text-emerald-300" : "text-emerald-600"
                        }`}
                      >
                        Kami akan merespons pertanyaan Anda secepatnya
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className={`p-6 sm:p-8 md:p-12 border-t lg:border-t-0 lg:border-l ${
                    isDarkMode
                      ? "bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-emerald-700/30"
                      : "bg-gradient-to-br from-emerald-50/50 to-green-50/50 border-emerald-200"
                  }`}
                >
                  <div className="space-y-4">
                    <Button
                      onClick={handleWhatsAppContact}
                      disabled={!creator?.phone}
                      className="group relative w-full px-4 sm:px-6 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span className="relative z-10 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm sm:text-base">
                              Hubungi via WhatsApp
                            </div>
                            <div className="text-xs hidden sm:block sm:text-sm font-normal opacity-90">
                              Chat langsung dengan penanggung jawab
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                      </span>
                    </Button>
                  </div>

                  {/* Contact Guidelines */}
                  <div
                    className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl ${
                      isDarkMode
                        ? "bg-gray-600/30 border border-gray-500"
                        : "bg-white/60 border border-gray-200"
                    }`}
                  >
                    <h4
                      className={`font-bold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } text-sm sm:text-base`}
                    >
                      Tips Menghubungi:
                    </h4>
                    <ul
                      className={`space-y-2 text-xs sm:text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          Sebutkan nama kegiatan yang ingin ditanyakan
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Gunakan bahasa yang sopan dan jelas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          Sertakan nomor telepon untuk komunikasi lebih lanjut
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
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
          0%,
          100% {
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

export default InformasiKontak;
