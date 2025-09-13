import useThemeStore from "@/store/theme";
import usePageStore from "@/store/page";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    { page: "tanyahukum", label: "TanyaHukum", icon: "⚖️", desc: "Konsultasi hukum gratis" },
    { page: "farmsmart", label: "FarmSmart", icon: "🌱", desc: "Pertanian cerdas" },
    { page: "bantu-desa", label: "BantuDesa", icon: "🤝", desc: "Platform donasi" }
  ];

  const company = [
    { page: "about", label: "Tentang Kami", icon: "ℹ️" },
    { page: "contact", label: "Kontak", icon: "📞" },
  ];

  const socialMedia = [
    { icon: "fab fa-facebook", color: "hover:text-blue-500", label: "Facebook", hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/20" },
    { icon: "fab fa-twitter", color: "hover:text-sky-400", label: "Twitter", hoverBg: "hover:bg-sky-50 dark:hover:bg-sky-900/20" },
    { icon: "fab fa-instagram", color: "hover:text-pink-500", label: "Instagram", hoverBg: "hover:bg-pink-50 dark:hover:bg-pink-900/20" },
    { icon: "fab fa-youtube", color: "hover:text-red-500", label: "YouTube", hoverBg: "hover:bg-red-50 dark:hover:bg-red-900/20" },
    { icon: "fab fa-linkedin", color: "hover:text-blue-600", label: "LinkedIn", hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/20" }
  ];

  return (
    <footer className={`relative overflow-hidden ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles with better animation */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${
              isDarkMode ? "bg-white/10" : "bg-gray-400/20"
            } rounded-full animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Enhanced gradient overlays */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 animate-gradient-x"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content with enhanced styling */}
        <div className="py-20">
          <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-12">
            {/* Enhanced Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500 group overflow-hidden`}>
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <i className="fas fa-home text-2xl text-white relative z-10"></i>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className={`text-3xl font-black ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } hover:bg-gradient-to-r hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent transition-all duration-500 cursor-pointer`}
                  onClick={() => handlePageChange("home")}>
                    DesaCerdas
                  </span>
                  <div className="text-sm font-bold text-emerald-600 tracking-wider">PLATFORM DIGITAL</div>
                </div>
              </div>
              
              <p className={`text-lg leading-relaxed mb-8 max-w-md ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Platform digital terpadu yang memberdayakan masyarakat desa Indonesia melalui teknologi modern dan solusi inovatif untuk kemajuan bersama.
              </p>

              {/* Enhanced Social Media with modern styling */}
              <div className="mb-8">
                <h4 className={`text-lg font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } flex items-center gap-3`}>
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl">
                    <i className="fas fa-share-alt text-white text-sm"></i>
                  </div>
                  Ikuti Kami
                </h4>
                
                <div className="flex gap-3">
                  {socialMedia.map((social, index) => (
                    <button
                      key={index}
                      className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 group shadow-xl hover:shadow-2xl ${
                        isDarkMode 
                          ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50' 
                          : 'bg-white/50 hover:bg-gray-50/50 border border-gray-200/50'
                      } backdrop-blur-sm ${social.color} ${social.hoverBg} hover:border-current/50`}
                      title={social.label}
                      aria-label={social.label}
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <i className={`${social.icon} text-lg transition-transform duration-300 group-hover:scale-125`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Features Section */}
            <div>
              <h4 className={`font-black text-xl mb-8 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } flex items-center gap-3`}>
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl">
                  <i className="fas fa-rocket text-white text-sm"></i>
                </div>
                Fitur Unggulan
              </h4>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={feature.page}>
                    <button
                      onClick={() => handlePageChange(feature.page)}
                      className={`flex items-center group transition-all duration-300 p-4 rounded-2xl hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 ${
                        isDarkMode 
                          ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white border border-transparent hover:border-gray-700/50' 
                          : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200/50'
                      } backdrop-blur-sm w-full text-left`}
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <span className="text-xl mr-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                        {feature.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-base group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {feature.label}
                        </div>
                        <div className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300`}>
                          {feature.desc}
                        </div>
                      </div>
                      <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-emerald-500"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Company Section */}
            <div>
              <h4 className={`font-black text-xl mb-8 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } flex items-center gap-3`}>
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <i className="fas fa-building text-white text-sm"></i>
                </div>
                Perusahaan
              </h4>
              <ul className="space-y-4">
                {company.map((item, index) => (
                  <li key={item.page}>
                    <button
                      onClick={() => handlePageChange(item.page)}
                      className={`flex items-center group transition-all duration-300 p-4 rounded-2xl hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 ${
                        isDarkMode 
                          ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white border border-transparent hover:border-gray-700/50' 
                          : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200/50'
                      } backdrop-blur-sm w-full text-left`}
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <span className="text-lg mr-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {item.icon}
                      </span>
                      <span className="font-bold flex-1 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{item.label}</span>
                      <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-blue-500"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Contact & Stats Section */}
            <div className="space-y-6">
              {/* Contact Info with modern card styling */}
              <div className={`p-6 rounded-2xl backdrop-blur-sm border shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700/50' 
                  : 'bg-white/50 border-gray-200/50'
              } overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h5 className={`font-bold text-base mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } flex items-center gap-3 relative z-10`}>
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-xl">
                    <i className="fas fa-map-marker-alt text-white text-xs"></i>
                  </div>
                  Kontak
                </h5>
                <div className={`space-y-3 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } relative z-10`}>
                  <div className="flex items-center group/item">
                    <i className="fas fa-envelope mr-3 text-emerald-500 transform group-hover/item:scale-110 transition-transform duration-200"></i>
                    <span className="group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors duration-200">info@desacerdas.id</span>
                  </div>
                  <div className="flex items-center group/item">
                    <i className="fas fa-phone mr-3 text-blue-500 transform group-hover/item:scale-110 transition-transform duration-200"></i>
                    <span className="group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-200">+62 21 1234 5678</span>
                  </div>
                  <div className="flex items-center group/item">
                    <i className="fas fa-map-marker-alt mr-3 text-purple-500 transform group-hover/item:scale-110 transition-transform duration-200"></i>
                    <span className="group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors duration-200">Jakarta, Indonesia</span>
                  </div>
                </div>
              </div>

              {/* Quality badges with enhanced styling */}
              <div className="space-y-3">
                {[
                  { icon: "fas fa-check-circle", label: "Verified", color: "emerald" },
                  { icon: "fas fa-shield-alt", label: "Secure", color: "blue" },
                  { icon: "fas fa-bolt", label: "Fast", color: "purple" }
                ].map((badge, index) => (
                  <div key={badge.label} 
                    className={`px-4 py-3 rounded-xl text-sm font-medium backdrop-blur-sm border shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group ${
                      isDarkMode 
                        ? `bg-${badge.color}-900/30 text-${badge.color}-300 border-${badge.color}-800/50 hover:bg-${badge.color}-900/40` 
                        : `bg-${badge.color}-50 text-${badge.color}-700 border-${badge.color}-200 hover:bg-${badge.color}-100`
                    }`}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <i className={`${badge.icon} transform group-hover:scale-110 transition-transform duration-200`}></i>
                      <span>{badge.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className={`border-t py-8 ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"} text-center md:text-left`}>
              <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                <span>&copy; 2024 DesaCerdas Platform.</span>
                <div className="flex items-center gap-1">
                  <span>Dibuat dengan</span>
                  <span className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} animate-pulse text-lg`}>❤️</span>
                  <span>untuk Indonesia</span>
                </div>
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Semua hak dilindungi. Terdaftar sebagai platform resmi pemberdayaan desa.
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm border shadow-lg ${
                  isDarkMode 
                    ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800/50' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                } transform hover:scale-105 transition-all duration-200`}>
                  <i className="fas fa-check-circle mr-1"></i>
                  Terpercaya
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm border shadow-lg ${
                  isDarkMode 
                    ? 'bg-blue-900/40 text-blue-300 border-blue-800/50' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                } transform hover:scale-105 transition-all duration-200`}>
                  <i className="fas fa-shield-alt mr-1"></i>
                  Aman
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-8 right-8 p-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 z-50 group ${
            isDarkMode 
              ? 'bg-gradient-to-r from-emerald-700 to-blue-700 hover:from-emerald-600 hover:to-blue-600 text-white' 
              : 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white'
          } border ${isDarkMode ? 'border-emerald-800/50' : 'border-emerald-600'} focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none backdrop-blur-sm`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <i className="fas fa-chevron-up text-lg relative z-10 transform group-hover:-translate-y-1 transition-transform duration-200"></i>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
        </button>
      </div>

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

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </footer> 
  );
};

export default Footer;
