import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import useThemeStore from "@/store/theme";
import usePageStore from "@/store/page";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Fitur = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  const features = [
    {
      id: 'tanyahukum',
      title: 'TanyaHukum',
      description: 'Konsultasi hukum gratis dengan AI yang dilengkapi referensi undang-undang terkini dan panduan lengkap',
      icon: 'https://readdy.ai/api/search-image?query=legal%20consultation%20icon%20with%20scales%20of%20justice%20and%20gavel%20in%20modern%20minimalist%20style%20with%20blue%20color%20scheme%20on%20clean%20white%20background&width=80&height=80&seq=legal1&orientation=squarish',
      bgGradient: 'from-blue-400 via-blue-500 to-blue-600',
      iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
      buttonGradient: 'from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500',
      glowColor: 'blue',
      buttonText: 'Mulai Konsultasi',
      route: 'tanyahukum',
      stats: [
        { label: 'Konsultasi', value: '50K+', icon: '⚖️' },
        { label: 'Rating', value: '4.9/5', icon: '⭐' }
      ],
      features: ['AI Legal Assistant', 'Database UU Terkini', 'Konsultasi 24/7']
    },
    {
      id: 'farmsmart',
      title: 'FarmSmart',
      description: 'Rekomendasi pertanian cerdas dengan data cuaca BMKG, analisis tanah, dan panduan lengkap budidaya',
      icon: 'https://readdy.ai/api/search-image?query=smart%20farming%20technology%20icon%20with%20plants%20and%20digital%20elements%20in%20modern%20minimalist%20style%20with%20green%20color%20scheme%20on%20clean%20white%20background&width=80&height=80&seq=farm1&orientation=squarish',
      bgGradient: 'from-emerald-400 via-green-500 to-green-600',
      iconBg: 'bg-gradient-to-br from-green-100 to-emerald-200',
      buttonGradient: 'from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500',
      glowColor: 'emerald',
      buttonText: 'Mulai Bertani',
      route: 'farmsmart',
      stats: [
        { label: 'Petani', value: '25K+', icon: '👨‍🌾' },
        { label: 'Hasil', value: '+40%', icon: '📈' }
      ],
      features: ['Data Cuaca Real-time', 'Analisis Tanah', 'Panduan Budidaya']
    },
    {
      id: 'bantudesa',
      title: 'BantuDesa',
      description: 'Platform donasi transparan untuk membantu pembangunan infrastruktur dan pemberdayaan masyarakat desa',
      icon: 'https://readdy.ai/api/search-image?query=community%20donation%20and%20village%20development%20icon%20with%20hands%20helping%20and%20heart%20symbol%20in%20modern%20minimalist%20style%20with%20orange%20color%20scheme%20on%20clean%20white%20background&width=80&height=80&seq=donation1&orientation=squarish',
      bgGradient: 'from-orange-400 via-orange-500 to-red-500',
      iconBg: 'bg-gradient-to-br from-orange-100 to-red-200',
      buttonGradient: 'from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500',
      glowColor: 'orange',
      buttonText: 'Mulai Donasi',
      route: 'bantu-desa',
      stats: [
        { label: 'Dana', value: '2.5M+', icon: '💰' },
        { label: 'Project', value: '150+', icon: '🏗️' }
      ],
      features: ['Donasi Transparan', 'Progress Real-time', 'Impact Report']
    }
  ];

  return (
    <section className={`py-32 relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-cyan-400/30 rotate-45 animate-spin-very-slow"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 border border-emerald-400/30 rounded-full animate-bounce-very-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rotate-12 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center justify-center p-1 bg-gradient-to-r from-cyan-100 via-emerald-100 to-blue-100 dark:from-cyan-900/30 dark:via-emerald-900/30 dark:to-blue-900/30 rounded-full mb-8 backdrop-blur-sm border border-white/20">
            <span className="flex items-center gap-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600 px-6 py-3 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg">
              <span className="animate-pulse">✨</span>
              Fitur Unggulan Platform
              <span className="animate-pulse">🚀</span>
            </span>
          </div>

          <h2 className={`text-6xl md:text-7xl font-black mb-8 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="block">Platform</span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-500 animate-gradient-x"> 
                Digital Terpadu
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 rounded-2xl blur opacity-20 animate-pulse"></div>
            </span>
            <span className="block mt-2">untuk Desa</span>
          </h2>

          <p className={`text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            Tiga layanan revolusioner yang dirancang khusus untuk 
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600"> kemajuan </span>
            dan 
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600"> pemberdayaan </span>
            desa Indonesia
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <i className="fas fa-shield-alt"></i>
              <span>Terpercaya & Aman</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <i className="fas fa-clock"></i>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <i className="fas fa-users"></i>
              <span>1000+ Desa Bergabung</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative"
              style={{
                animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
              }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className={`
                relative overflow-hidden border-0 shadow-2xl hover:shadow-4xl
                transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1
                ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} 
                backdrop-blur-xl cursor-pointer h-full
                hover:scale-105
              `}>
                {/* Animated Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.bgGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700`}></div>
                
                {/* Content */}
                <CardHeader className="text-center pt-12 pb-8 relative z-10">
                  {/* Enhanced Icon Container */}
                  <div className="relative mb-8">
                    <div className={`w-32 h-32 mx-auto rounded-3xl ${feature.iconBg} flex items-center justify-center overflow-hidden shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-4 border-white/50`}>
                      <img 
                        src={feature.icon}
                        alt={feature.title}
                        className="w-16 h-16 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Enhanced floating particles effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute -top-4 -right-4 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse delay-300"></div>
                      <div className="absolute top-1/2 -right-6 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce delay-500"></div>
                    </div>
                  </div>
                  
                  <CardTitle className={`text-3xl md:text-4xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${feature.bgGradient} transition-all duration-500`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-8 pb-12 relative z-10">
                  <p className={`text-center leading-relaxed mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {feature.stats.map((stat, idx) => (
                      <div key={idx} className={`text-center p-4 rounded-2xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/50'} backdrop-blur-sm border border-white/20 group-hover:border-cyan-300/50 transition-all duration-500`}>
                        <div className="text-lg mb-1">{stat.icon}</div>
                        <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${feature.bgGradient} transition-all duration-500`}>
                          {stat.value}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features list */}
                  <div className="mb-8">
                    <div className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.bgGradient} animate-pulse`} style={{ animationDelay: `${idx * 200}ms` }}></div>
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handlePageChange(feature.route)}
                    className={`
                      w-full py-6 text-lg font-bold rounded-2xl
                      bg-gradient-to-r ${feature.buttonGradient} 
                      text-white border-0 relative overflow-hidden
                      shadow-2xl hover:shadow-3xl
                      transform hover:scale-105 transition-all duration-500
                      group-hover:animate-pulse
                    `}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <span>{feature.buttonText}</span>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300">
                        <i className="fas fa-arrow-right text-sm"></i>
                      </div>
                    </span>
                    
                    {/* Enhanced button effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} opacity-0 hover:opacity-100 transition-opacity duration-300`}></div>
                  </Button>
                </CardContent>
                
                {/* Enhanced hover indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.bgGradient} flex items-center justify-center shadow-lg`}>
                    <i className="fas fa-external-link-alt text-white text-sm"></i>
                  </div>
                </div>
              </Card>

              {/* Enhanced card border glow effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.bgGradient} opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 -z-10`}></div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Bottom Call to Action */}
        <div className="text-center mt-24">
          <div className={`inline-flex flex-col items-center gap-6 px-12 py-8 rounded-3xl ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/30'} backdrop-blur-xl shadow-2xl border ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'}`}>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
              <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Platform terpercaya untuk kemajuan desa Indonesia
              </span>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse delay-300"></div>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} backdrop-blur-sm`}>
                <i className="fas fa-certificate text-yellow-500"></i>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Bersertifikat</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} backdrop-blur-sm`}>
                <i className="fas fa-shield-check text-green-500"></i>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Data Aman</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} backdrop-blur-sm`}>
                <i className="fas fa-headset text-blue-500"></i>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(80px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes bounce-very-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-gradient-x { 
          background-size: 200% 200%; 
          animation: gradient-x 4s ease infinite; 
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-bounce-very-slow { animation: bounce-very-slow 8s ease-in-out infinite; }
        .animate-spin-very-slow { animation: spin-very-slow 30s linear infinite; }
        
        .shadow-4xl {
          box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
};

export default Fitur;