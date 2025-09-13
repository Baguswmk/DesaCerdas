import useThemeStore from "@/store/theme";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Leaf, Rocket, CheckCircle, Target, Heart, Lightbulb, Shield } from "lucide-react";

const About = () => {
  const { isDarkMode } = useThemeStore();
  
  const values = [
    {
      icon: Users,
      title: "Komunitas",
      description: "Membangun komunitas yang kuat dan saling mendukung antar desa di seluruh Indonesia",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      icon: Leaf,
      title: "Berkelanjutan",
      description: "Solusi yang ramah lingkungan dan berkelanjutan untuk generasi mendatang",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Rocket,
      title: "Inovasi",
      description: "Menghadirkan teknologi terdepan yang mudah diakses dan digunakan oleh semua kalangan",
      color: "from-emerald-600 to-green-500",
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600"
    }
  ];

  const achievements = [
    { number: "1000+", label: "Desa Terdaftar", icon: "🏘️" },
    { number: "75K+", label: "Pengguna Aktif", icon: "👥" },
    { number: "150+", label: "Program Berhasil", icon: "🎯" },
    { number: "98%", label: "Kepuasan User", icon: "⭐" }
  ];

  return (
    <div className={`min-h-screen pt-20 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
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
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-5xl md:text-6xl py-4 font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2`}>
                Tentang Kami
              </h1>
             
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto mt-3"></div>
            </div>
          </div>
          
          <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Platform digital terpadu yang menghubungkan teknologi modern dengan kebutuhan masyarakat desa untuk menciptakan 
            <span className={`font-bold ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}> pemberdayaan berkelanjutan</span>
          </p>
        </div>

        {/* Enhanced Vision & Mission Section with Emerald Theme */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div>
              <h2 className={`text-4xl md:text-5xl font-black mb-8 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Visi & Misi Kami
              </h2>
            </div>
            
            <div className={`p-8 rounded-2xl shadow-xl ${
              isDarkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'
            } backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className={`text-2xl font-black ${
                  isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
                }`}>
                  Misi
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Menyediakan akses konsultasi hukum gratis untuk masyarakat desa",
                  "Membantu petani dengan teknologi pertanian cerdas dan berkelanjutan", 
                  "Memfasilitasi donasi transparan untuk pembangunan infrastruktur desa",
                  "Memberdayakan ekonomi lokal melalui digitalisasi dan inovasi"
                ].map((mission, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="p-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-1">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {mission}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div className="relative group">
            <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500">
              <img 
                src="https://readdy.ai/api/search-image?query=Indonesian%20village%20community%20meeting%20with%20diverse%20people%20discussing%20development%20plans%20in%20traditional%20meeting%20hall%20with%20modern%20technology%20integration&width=500&height=500&seq=about1&orientation=squarish"
                alt="Tentang Kami"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {/* Decorative elements with emerald colors */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-20 transform -rotate-12 group-hover:-rotate-45 transition-transform duration-500"></div>
          </div>
        </div>

        {/* Enhanced Values Section with Emerald Theme */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Nilai-Nilai Kami
            </h2>
            <p className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Prinsip yang memandu setiap langkah perjalanan kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card 
                key={value.title}
                className={`text-center group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                }`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
                }}
              >
                {/* Emerald Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <CardHeader className="pt-10 pb-6 relative z-10">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${
                      isDarkMode ? value.bgColor + '/20 border border-gray-600/50' : value.bgColor + ' border border-gray-200'
                    } backdrop-blur-sm`}>
                      <value.icon className={`h-8 w-8 ${value.iconColor}`} />
                    </div>
                    {/* Emerald Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`}></div>
                  </div>
                  
                  <CardTitle className={`text-2xl font-black mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } group-hover:${value.iconColor} transition-colors duration-300`}>
                    {value.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-6 pb-8 relative z-10">
                  <p className={`text-base leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section with Emerald Theme */}
        <div className="text-center">
          <div className={`inline-flex flex-col items-center gap-6 px-12 py-10 rounded-3xl ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white/50 border border-gray-200/50'
          } backdrop-blur-sm shadow-2xl max-w-2xl mx-auto`}>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-emerald-500" />
              <span className={`text-xl font-black ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Bergabunglah dengan Revolusi Digital Desa
              </span>
            </div>
            
            <p className={`text-base leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-lg`}>
              Bersama-sama kita wujudkan desa Indonesia yang lebih maju, mandiri, dan sejahtera melalui kekuatan teknologi digital
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-emerald-900/20 text-emerald-300 border border-emerald-800/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              } backdrop-blur-sm`}>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-bold">Terpercaya</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-green-900/20 text-green-300 border border-green-800/30' : 'bg-green-50 text-green-700 border border-green-200'
              } backdrop-blur-sm`}>
                <Shield className="h-4 w-4" />
                <span className="text-sm font-bold">Aman</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-emerald-900/20 text-emerald-300 border border-emerald-800/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              } backdrop-blur-sm`}>
                <Rocket className="h-4 w-4" />
                <span className="text-sm font-bold">Inovatif</span>
              </div>
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
  );
};

export default About;