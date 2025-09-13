import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import useThemeStore from "@/store/theme";
import usePageStore from "@/store/page";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Activity, TrendingUp, Users, Target, Sparkles, ArrowRight, ExternalLink, CheckCircle, Zap } from "lucide-react";

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
      icon: '⚖️',
      bgGradient: 'from-emerald-600 to-green-600',
      hoverGradient: 'from-emerald-700 to-green-700',
      features: ['AI Legal Assistant', 'Database UU Terkini', 'Konsultasi 24/7'],
      route: 'tanyahukum'
    },
    {
      id: 'farmsmart',
      title: 'FarmSmart',
      description: 'Rekomendasi pertanian cerdas dengan data cuaca BMKG, analisis tanah, dan panduan lengkap budidaya',
      icon: '🌱',
      bgGradient: 'from-green-600 to-emerald-600',
      hoverGradient: 'from-green-700 to-emerald-700',
      features: ['Data Cuaca Real-time', 'Analisis Tanah', 'Panduan Budidaya'],
      route: 'farmsmart'
    },
    {
      id: 'bantudesa',
      title: 'BantuDesa',
      description: 'Platform donasi transparan untuk membantu pembangunan infrastruktur dan pemberdayaan masyarakat desa',
      icon: '🤝',
      bgGradient: 'from-emerald-500 to-green-500',
      hoverGradient: 'from-emerald-600 to-green-600',
      features: ['Donasi Transparan', 'Progress Real-time', 'Impact Report'],
      route: 'bantudesa'
    }
  ];

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Enhanced Background Elements with Emerald Theme */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-300/25 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Emerald Gradient Overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header with Emerald Theme */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className={`text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2`}>
                Platform Digital
              </h2>
              <div className={`text-2xl md:text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Terpadu untuk Desa
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto mt-3"></div>
            </div>
          </div>

          <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } mb-8`}>
            Tiga layanan terintegrasi yang dirancang khusus untuk 
            <span className={`font-bold ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}> kemajuan </span>
            dan 
            <span className={`font-bold ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}> pemberdayaan </span>
            desa Indonesia
          </p>

          {/* Trust Indicators with Emerald Colors */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white/50 border border-gray-200/50'
            } backdrop-blur-sm`}>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Terpercaya & Aman
              </span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white/50 border border-gray-200/50'
            } backdrop-blur-sm`}>
              <Zap className="h-4 w-4 text-emerald-500" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                24/7 Support
              </span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white/50 border border-gray-200/50'
            } backdrop-blur-sm`}>
              <Users className="h-4 w-4 text-emerald-500" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                1000+ Desa Bergabung
              </span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Features Grid with Emerald Theme */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
              }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className={`
                relative overflow-hidden shadow-xl hover:shadow-2xl
                transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]
                ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} 
                backdrop-blur-sm cursor-pointer h-full group-hover:border-emerald-300/50
              `}>
                
                {/* Emerald Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <CardHeader className="text-center pt-10 pb-6 relative z-10">
                  {/* Enhanced Icon */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${
                      isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50 border border-gray-200'
                    } backdrop-blur-sm`}>
                      <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </span>
                    </div>
                    {/* Emerald Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`}></div>
                  </div>
                  
                  <CardTitle className={`text-2xl md:text-3xl font-black mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } group-hover:bg-gradient-to-r group-hover:${feature.bgGradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-8 pb-10 relative z-10">
                  <p className={`text-center leading-relaxed mb-8 text-base ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feature.description}
                  </p>

                  {/* Features List with Emerald Bullets */}
                  <div className="mb-8">
                    <div className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.bgGradient}`}></div>
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handlePageChange(feature.route)}
                    className={`
                      w-full py-4 text-base font-bold rounded-2xl
                      bg-gradient-to-r ${feature.bgGradient}
                      hover:${feature.hoverGradient}
                      text-white border-0 relative overflow-hidden
                      shadow-xl hover:shadow-2xl
                      transform hover:scale-105 transition-all duration-300
                      focus:outline-none focus-visible:outline-none
                      group/btn
                    `}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>Mulai Sekarang</span>
                      <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </CardContent>
                
                {/* Hover Indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className={`w-10 h-10 rounded-full ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                  } flex items-center justify-center shadow-lg backdrop-blur-sm border ${
                    isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'
                  }`}>
                    <ExternalLink className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section with Emerald Theme */}
        <div className="text-center">
          <div className={`inline-flex flex-col items-center gap-6 px-12 py-8 rounded-3xl ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white/50 border border-gray-200/50'
          } backdrop-blur-sm shadow-2xl`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${
                    isDarkMode ? 'bg-emerald-300' : 'bg-emerald-500'
                  } rounded-full animate-pulse`} 
                  style={{ animationDelay: `${i * 200}ms` }}></div>
                ))}
              </div>
              <span className={`text-lg font-bold ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Platform terpercaya untuk kemajuan desa Indonesia
              </span>
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${
                    isDarkMode ? 'bg-emerald-300' : 'bg-emerald-500'
                  } rounded-full animate-pulse`}
                  style={{ animationDelay: `${(i + 3) * 200}ms` }}></div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-100/50 border border-gray-200/50'
              } backdrop-blur-sm shadow-lg`}>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Bersertifikat
                </span>
              </div>
              <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-100/50 border border-gray-200/50'
              } backdrop-blur-sm shadow-lg`}>
                <Zap className="h-4 w-4 text-emerald-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Data Aman
                </span>
              </div>
              <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-100/50 border border-gray-200/50'
              } backdrop-blur-sm shadow-lg`}>
                <Users className="h-4 w-4 text-emerald-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Support 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            transform: translateY(-15px) rotate(180deg);
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Fitur;