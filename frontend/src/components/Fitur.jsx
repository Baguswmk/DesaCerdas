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
        icon: '⚖️',
        bgColor: isDarkMode ? 'bg-slate-900/70' : 'bg-white',
        hoverBg: isDarkMode ? 'hover:bg-slate-900/60' : 'hover:bg-emerald-50/70',
        iconBg: isDarkMode ? 'bg-emerald-900/30 border-emerald-800/40' : 'bg-emerald-50 border-emerald-100',
        textColor: isDarkMode ? 'text-slate-200' : 'text-slate-800',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2',
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
        icon: '🌱',
        bgColor: isDarkMode ? 'bg-slate-900/70' : 'bg-white',
        hoverBg: isDarkMode ? 'hover:bg-slate-900/60' : 'hover:bg-emerald-50/70',
        iconBg: isDarkMode ? 'bg-emerald-900/30 border-emerald-800/40' : 'bg-emerald-50 border-emerald-100',
        textColor: isDarkMode ? 'text-slate-200' : 'text-slate-800',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2',
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
        icon: '🤝',
        bgColor: isDarkMode ? 'bg-slate-900/70' : 'bg-white',
        hoverBg: isDarkMode ? 'hover:bg-slate-900/60' : 'hover:bg-emerald-50/70',
        iconBg: isDarkMode ? 'bg-emerald-900/30 border-emerald-800/40' : 'bg-emerald-50 border-emerald-100',
        textColor: isDarkMode ? 'text-slate-200' : 'text-slate-800',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2',
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
      <section className={`py-24 relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50'}`}>
        {/* Subtle Background decoration */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
        </div>

        {/* Subtle geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 right-20 w-32 h-32 border ${isDarkMode ? 'border-emerald-700/20' : 'border-emerald-400/20'} rotate-45 animate-spin-very-slow`}></div>
          <div className={`absolute bottom-40 left-20 w-24 h-24 border ${isDarkMode ? 'border-emerald-800/20' : 'border-emerald-300/20'} rounded-full animate-bounce-very-slow`}></div>
          <div className={`absolute top-1/2 right-1/4 w-16 h-16 ${isDarkMode ? 'bg-emerald-800/20' : 'bg-emerald-300/20'} rotate-12 animate-pulse`}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header Section */}
          <div className="text-center mb-20">
            {/* <div className={`inline-flex items-center justify-center p-1 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100/80 border-slate-200/50'} rounded-full mb-8 backdrop-blur-sm border`}>
              <span className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-slate-300 bg-slate-700/50' : 'text-slate-700 bg-white/80'} px-6 py-3 rounded-full shadow-sm`}>
                <i className={`fas fa-star ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}></i>
                Fitur Unggulan Platform
                <i className={`fas fa-rocket ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}></i>
              </span>
            </div> */}

            <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="block">Platform Digital</span>
              <span className="block">
                <span className={`${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}> 
                  Terpadu untuk Desa
                </span>
              </span>
            </h2>

            <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-8`}>
              Tiga layanan terintegrasi yang dirancang khusus untuk 
              <span className={`font-semibold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}> kemajuan </span>
              dan 
              <span className={`font-semibold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}> pemberdayaan </span>
              desa Indonesia
            </p>

            {/* Trust indicators */}
            {/* <div className="flex flex-wrap jus    tify-center items-center gap-8 text-sm">
              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <i className="fas fa-shield-alt"></i>
                <span>Terpercaya & Aman</span>
              </div>
              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <i className="fas fa-clock"></i>
                <span>24/7 Support</span>
              </div>
              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <i className="fas fa-users"></i>
                <span>1000+ Desa Bergabung</span>
              </div>
            </div> */}
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
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
                  relative overflow-hidden shadow-lg hover:shadow-xl
                  transition-all duration-300 transform hover:-translate-y-1.5
                  ${isDarkMode ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200'} 
                  backdrop-blur-sm cursor-pointer h-full
                  hover:scale-[1.02] border rounded-xl
                `}
                aria-label={`${feature.title} card`}>
                  
                  {/* Content */}
                  <CardHeader className="text-center pt-10 pb-6 relative z-10">
                    {/* Icon Container */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 mx-auto rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-105 transition-all duration-300 border ${feature.iconBg}`}>
                        <span className="text-3xl">{feature.icon}</span>
                      </div>
                    </div>
                    
                    <CardTitle className={`text-2xl md:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-all duration-300`}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-8 relative z-10">
                    <p className={`text-center leading-relaxed mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} text-base`}>
                      {feature.description}
                    </p>

                    {/* Stats */}
                    {/* <div className="grid grid-cols-2 gap-3 mb-6">
                      {feature.stats.map((stat, idx) => (
                        <div key={idx} className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50' : 'bg-gray-100/50 border-gray-200/50'} backdrop-blur-sm border transition-all duration-300`}>
                          <div className="text-base mb-1">{stat.icon}</div>
                          <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-all duration-300`}>
                            {stat.value}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div> */}

                    {/* Features list */}
                    <div className="mb-6">
                      <div className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-500'}`}></div>
                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handlePageChange(feature.route)}
                      aria-label={`${feature.title} - ${feature.buttonText}`}
                      className={`
                        w-full py-3 text-base font-medium rounded-lg
                        ${feature.buttonBg}
                        text-white border-0 relative overflow-hidden
                        shadow-md hover:shadow-lg
                        transform hover:scale-[1.02] transition-all duration-300
                        focus:outline-none focus-visible:outline-none
                      `}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>{feature.buttonText}</span>
                        <i className="fas fa-arrow-right text-sm transform group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true"></i>
                      </span>
                    </Button>
                  </CardContent>
                  
                  {/* Hover indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-emerald-800' : 'bg-emerald-100'} flex items-center justify-center shadow-md`}>
                      <i className={`fas fa-external-link-alt ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'} text-xs`} aria-hidden="true"></i>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Bottom Call to Action */}
          {/* <div className="text-center mt-20">
            <div className={`inline-flex flex-col items-center gap-4 px-8 py-6 rounded-xl ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} backdrop-blur-sm shadow-lg border`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 ${isDarkMode ? 'bg-slate-400' : 'bg-slate-500'} rounded-full animate-pulse`}></div>
                <span className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Platform terpercaya untuk kemajuan desa Indonesia
                </span>
                <div className={`w-2 h-2 ${isDarkMode ? 'bg-slate-400' : 'bg-slate-500'} rounded-full animate-pulse delay-300`}></div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'}`}>
                  <i className="fas fa-certificate text-yellow-600"></i>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Bersertifikat</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'}`}>
                  <i className="fas fa-shield-check text-green-600"></i>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Data Aman</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'}`}>
                  <i className="fas fa-headset text-blue-600"></i>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Support 24/7</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.02); opacity: 0.8; }
          }

          @keyframes bounce-very-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes spin-very-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
          .animate-bounce-very-slow { animation: bounce-very-slow 8s ease-in-out infinite; }
          .animate-spin-very-slow { animation: spin-very-slow 30s linear infinite; }

          /* Respect reduced motion preferences */
          @media (prefers-reduced-motion: reduce) {
            .animate-pulse-slow,
            .animate-bounce-very-slow,
            .animate-spin-very-slow {
              animation: none !important;
            }
          }
        `}</style>
      </section>
    );
  };

  export default Fitur;
