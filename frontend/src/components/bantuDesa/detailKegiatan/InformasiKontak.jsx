import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Phone, Mail, MessageCircle, MapPin, Clock, Shield, ExternalLink } from "lucide-react";
import useThemeStore from "@/store/theme";

const InformasiKontak = ({ creator }) => {
  const { isDarkMode } = useThemeStore();
  
  const handleWhatsAppContact = () => {
    if (creator?.phone) {
      const phone = creator.phone.replace(/^0/, '62'); // Ganti 0 dengan 62
      const message = encodeURIComponent("Halo, saya ingin bertanya tentang kegiatan yang sedang berlangsung.");
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    } else {
      toast.error("Nomor WhatsApp tidak tersedia");
    }
  };

  const handleEmailContact = () => {
    if (creator?.email) {
      const subject = encodeURIComponent("Pertanyaan tentang Kegiatan Desa");
      const body = encodeURIComponent("Halo, saya ingin bertanya tentang kegiatan yang sedang berlangsung.");
      window.open(`mailto:${creator.email}?subject=${subject}&body=${body}`, '_blank');
    } else {
      toast.error("Email tidak tersedia");
    }
  };

  const handlePhoneCall = () => {
    if (creator?.phone) {
      window.open(`tel:${creator.phone}`, '_blank');
    } else {
      toast.error("Nomor telepon tidak tersedia");
    }
  };

  return (
    <section className={`py-16 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-lg">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Informasi Kontak
            </h2>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-4" />
          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Hubungi penanggung jawab untuk informasi lebih lanjut tentang kegiatan ini
          </p>
        </div>

        <Card className={`border-0 shadow-2xl overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-sm' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Contact Information Section */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-3xl font-black ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Penanggung Jawab
                  </h3>
                </div>

                {/* Contact Person Card */}
                <div className={`p-6 rounded-2xl mb-8 border transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70' 
                    : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100/80'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-600' : 'bg-white'
                      } shadow-lg`}>
                        <User className={`h-8 w-8 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`text-xl font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {creator?.name || "Admin Desa"}
                        </h4>
                        <Badge variant="outline" className="text-xs font-medium">
                          <Shield className="h-3 w-3 mr-1" />
                          Terverifikasi
                        </Badge>
                      </div>
                      <p className={`text-sm font-medium mb-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Koordinator Kegiatan Desa
                      </p>
                      
                      {/* Contact Details */}
                      <div className="space-y-3">
                        {creator?.phone && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Phone className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {creator.phone}
                              </div>
                              <div className="text-xs text-gray-500">Telepon / WhatsApp</div>
                            </div>
                          </div>
                        )}
                        
                        {creator?.email && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Mail className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {creator.email}
                              </div>
                              <div className="text-xs text-gray-500">Email resmi</div>
                            </div>
                          </div>
                        )}

                        {creator?.location && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <MapPin className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {creator.location}
                              </div>
                              <div className="text-xs text-gray-500">Lokasi</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time Info */}
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                  isDarkMode 
                    ? 'bg-blue-900/20 border border-blue-800/30' 
                    : 'bg-blue-50/80 border border-blue-200'
                }`}>
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className={`text-sm font-bold ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-800'
                    }`}>
                      Waktu Respons: 1-2 Jam
                    </div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}>
                      Kami akan merespons pertanyaan Anda secepatnya
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className={`p-8 md:p-12 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-700/30 to-gray-600/30 border-l border-gray-700' 
                  : 'bg-gradient-to-br from-blue-50/50 to-green-50/50 border-l border-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-3xl font-black ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Hubungi Kami
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* WhatsApp Button */}
                  <Button 
                    onClick={handleWhatsAppContact}
                    disabled={!creator?.phone}
                    className="w-full !rounded-2xl p-6 text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <div>Hubungi via WhatsApp</div>
                          <div className="text-sm font-normal opacity-90">Chat langsung dengan penanggung jawab</div>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5" />
                    </div>
                  </Button>
                </div>

                {/* Contact Guidelines */}
                <div className={`mt-8 p-6 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-gray-600/30 border border-gray-500' 
                    : 'bg-white/60 border border-gray-200'
                }`}>
                  <h4 className={`font-bold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Tips Menghubungi:
                  </h4>
                  <ul className={`space-y-2 text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Sebutkan nama kegiatan yang ingin ditanyakan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Gunakan bahasa yang sopan dan jelas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Sertakan nomor telepon untuk komunikasi lebih lanjut</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InformasiKontak;