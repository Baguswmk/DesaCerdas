import useThemeStore from "@/store/theme";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Headphones } from "lucide-react";
import { useState } from "react";

const Kontak = () => {  
  const { isDarkMode } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "info@desacerdas.id",
      subtitle: "Respon dalam 24 jam",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-100"
    },
    {
      icon: Phone,
      title: "Telepon",
      details: "+62 21 1234 5678",
      subtitle: "Senin - Jumat, 08:00-17:00",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-100"
    },
    {
      icon: MapPin,
      title: "Alamat",
      details: "Jl. Pembangunan Desa No. 123",
      subtitle: "Jakarta Selatan, DKI Jakarta 12345",
      color: "from-emerald-600 to-green-500",
      bgColor: "bg-emerald-100"
    }
  ];

  const workingHours = [
    { day: "Senin - Jumat", time: "08:00 - 17:00 WIB", status: "active" },
    { day: "Sabtu", time: "08:00 - 12:00 WIB", status: "active" },
    { day: "Minggu", time: "Tutup", status: "closed" }
  ];

  const supportChannels = [
    { icon: MessageCircle, name: "Live Chat", status: "Online", color: "text-emerald-500" },
    { icon: Mail, name: "Email Support", status: "24/7", color: "text-emerald-500" },
    { icon: Phone, name: "Phone Support", status: "Jam Kerja", color: "text-green-500" },
    { icon: Headphones, name: "Video Call", status: "Tersedia", color: "text-emerald-500" }
  ];

  return (
    <div className={`min-h-screen pt-20 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950' 
           : "bg-gradient-to-br from-emerald-400/50 via-emerald-500/20 to-green-200/80"
    }`}>
      <Header />
      
      {/* Enhanced Background Elements with Emerald Theme */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-300/25 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Emerald Gradient Overlays */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mb-16 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header Section with Emerald Theme */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-xl">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-5xl md:text-6xl py-4 font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2`}>
                Hubungi Kami
              </h1>
            
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto mt-3"></div>
            </div>
          </div>
          
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Kami siap membantu Anda dengan 
            <span className={`font-bold ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}> respon cepat </span>
            dan 
            <span className={`font-bold ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}> solusi terbaik</span>
          </p>
        </div>

        {/* Support Channels with Emerald Theme */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportChannels.map((channel, index) => (
            <Card
              key={channel.name}
              className={`text-center group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                isDarkMode
                  ? "bg-gray-800/50 backdrop-blur-sm"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardContent className="p-6 relative z-10">
                <channel.icon className={`h-8 w-8 mx-auto mb-3 ${channel.color} transform group-hover:scale-110 transition-transform duration-300`} />
                <div className={`text-base font-black mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {channel.name}
                </div>
                <div className={`text-sm font-medium ${channel.color}`}>
                  {channel.status}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information Side */}
          <div className="space-y-8">
            {/* Contact Info Cards with Emerald Theme */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card 
                  key={info.title}
                  className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                  }`}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
                  }}
                >
                  {/* Emerald Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${
                        isDarkMode ? info.bgColor + '/20 border border-gray-600/50' : info.bgColor + ' border border-gray-200'
                      } backdrop-blur-sm`}>
                        <info.icon className={`h-6 w-6 ${
                          info.title === 'Email' ? 'text-emerald-600' :
                          info.title === 'Telepon' ? 'text-green-600' :
                          'text-emerald-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xl font-black mb-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {info.title}
                        </h4>
                        <p className={`text-base font-medium ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {info.details}
                        </p>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {info.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Working Hours Card with Emerald Theme */}
            <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${
              isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className={`text-xl font-black ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Jam Operasional
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workingHours.map((schedule, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                      <span className={`text-base ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {schedule.day}
                      </span>
                      <span className={`text-base font-bold ${
                        schedule.status === 'closed' 
                          ? 'text-red-500' 
                          : isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
                      } group-hover:scale-105 transition-transform duration-200`}>
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Side with Emerald Theme */}
          <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${
            isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <CardTitle className={`text-2xl font-black ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Kirim Pesan
                </CardTitle>
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Isi formulir di bawah ini dan kami akan merespon dalam 24 jam
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm font-bold mb-2 block ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Nama Lengkap *
                    </label>
                    <Input
                      name="name"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`!rounded-xl text-sm transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 focus:border-emerald-500'
                          : 'bg-white border-gray-300 focus:border-emerald-500'
                      } shadow-lg focus:shadow-xl`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`text-sm font-bold mb-2 block ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`!rounded-xl text-sm transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 focus:border-emerald-500'
                          : 'bg-white border-gray-300 focus:border-emerald-500'
                      } shadow-lg focus:shadow-xl`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-bold mb-2 block ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Subjek *
                  </label>
                  <Input
                    name="subject"
                    placeholder="Topik pesan Anda"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`!rounded-xl text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 focus:border-emerald-500'
                        : 'bg-white border-gray-300 focus:border-emerald-500'
                    } shadow-lg focus:shadow-xl`}
                    required
                  />
                </div>
                <div>
                  <label className={`text-sm font-bold mb-2 block ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Pesan *
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Tuliskan pesan Anda dengan detail..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`min-h-32 !rounded-xl text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 focus:border-emerald-500'
                        : 'bg-white border-gray-300 focus:border-emerald-500'
                    } shadow-lg focus:shadow-xl resize-none`}
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full !rounded-2xl py-4 text-base font-black bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <Send className="h-5 w-5 mr-3 relative z-10" />
                  <span className="relative z-10">Kirim Pesan</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced CTA Section with Emerald Theme */}
        <div className="text-center mt-16">
          <div className={`inline-flex flex-col items-center gap-6 px-12 py-8 rounded-3xl ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white/50 border border-gray-200/50'
          } backdrop-blur-sm shadow-2xl`}>
            <Users className="h-8 w-8 text-emerald-500" />
            <div>
              <h3 className={`text-xl font-black mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Tim Support Berpengalaman
              </h3>
              <p className={`text-base ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } max-w-md`}>
                Tim kami terdiri dari profesional berpengalaman yang siap membantu menyelesaikan setiap pertanyaan dan kendala Anda
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Kontak;