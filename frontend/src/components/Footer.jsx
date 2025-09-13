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
  };

  const features = [
    { page: "tanyahukum", label: "TanyaHukum", icon: "⚖️" },
    { page: "farmsmart", label: "FarmSmart", icon: "🌱" },
    { page: "bantudesa", label: "BantuDesa", icon: "🤝" }
  ];

  const company = [
    { page: "about", label: "Tentang Kami", icon: "ℹ️" },
    { page: "contact", label: "Kontak", icon: "📞" },
    { page: "privacy", label: "Kebijakan Privasi", icon: "🔒" },
    { page: "terms", label: "Syarat & Ketentuan", icon: "📋" }
  ];

  const socialMedia = [
    { icon: "fab fa-facebook", color: "hover:text-emerald-600", label: "Facebook" },
    { icon: "fab fa-twitter", color: "hover:text-emerald-600", label: "Twitter" },
    { icon: "fab fa-instagram", color: "hover:text-emerald-600", label: "Instagram" },
    { icon: "fab fa-youtube", color: "hover:text-emerald-600", label: "YouTube" },
    { icon: "fab fa-linkedin", color: "hover:text-emerald-600", label: "LinkedIn" }
  ];

  return (
    <footer className={`relative overflow-hidden ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950" 
        : "bg-gradient-to-br from-emerald-50 via-white to-emerald-50"
    }`}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Subtle top border */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${isDarkMode ? 'bg-emerald-700' : 'bg-emerald-400'}`}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'} shadow-md`}>
                  <i className={`fas fa-home text-2xl ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}></i>
                </div>
                <div>
                  <span className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    DesaCerdas
                  </span>
                  <div className={`font-medium text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Platform Digital</div>
                </div>
              </div>
              
              <p className={`text-base leading-relaxed mb-6 max-w-md ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Platform digital terdepan untuk memberdayakan masyarakat desa Indonesia melalui teknologi modern dan solusi inovatif.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                  <div className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>1000+</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Desa Terdaftar</div>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                  <div className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>50K+</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pengguna Aktif</div>
                </div>
              </div>

              {/* Newsletter */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/30'} border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
                  <i className={`fas fa-envelope ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}></i>
                  Newsletter
                </h4>
                <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Dapatkan update terbaru
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className={`flex-1 px-3 py-2 text-sm rounded-md border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400`}
                  />
                  <button className={`px-4 py-2 ${isDarkMode ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-sm rounded-md transform hover:scale-105 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none`} aria-label="Daftar newsletter">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className={`font-bold text-lg mb-6 ${isDarkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
                <i className={`fas fa-rocket ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
                Fitur Unggulan
              </h4>
              <ul className={`space-y-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {features.map((feature) => (
                  <li key={feature.page}>
                    <button
                      onClick={() => handlePageChange(feature.page)}
                      className={`flex items-center group transition-all duration-200 ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'} hover:translate-x-1`}
                    >
                      <span className="text-base mr-3 transform group-hover:scale-110 transition-transform duration-200">
                        {feature.icon}
                      </span>
                      <span className="font-medium">{feature.label}</span>
                      <i className={`fas fa-arrow-right ml-2 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
                  </button>
                </li>
              ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className={`font-bold text-lg mb-6 ${isDarkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
                <i className={`fas fa-building ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
                Perusahaan
              </h4>
              <ul className={`space-y-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {company.map((item) => (
                  <li key={item.page}>
                    <button
                      onClick={() => handlePageChange(item.page)}
                      className={`flex items-center group transition-all duration-200 ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'} hover:translate-x-1`}
                    >
                      <span className="text-base mr-3 transform group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                      <i className={`fas fa-arrow-right ml-2 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
                  </button>
                </li>
              ))}
              </ul>
            </div>

            {/* Social Media & Contact */}
            <div>
              <h4 className={`font-bold text-lg mb-6 ${isDarkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
                <i className={`fas fa-share-alt ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
                Ikuti Kami
              </h4>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {socialMedia.map((social, index) => (
                  <button
                    key={index}
                    className={`p-3 rounded-lg transition-all duration-200 transform hover:scale-110 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                      isDarkMode 
                        ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300' 
                        : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600'
                    } ${social.color} shadow-md hover:shadow-lg border ${isDarkMode ? 'border-gray-700/50 hover:border-gray-600/50' : 'border-gray-200/50 hover:border-gray-300/50'}`}
                    title={social.label}
                    aria-label={social.label}
                  >
                    <i className={`${social.icon} text-lg`}></i>
                  </button>
                ))}
              </div>

              {/* Contact Info */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/30'} border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                <h5 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
                  <i className={`fas fa-map-marker-alt ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
                  Kontak
                </h5>
                <div className={`space-y-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <div className="flex items-center">
                    <i className={`fas fa-envelope mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
                    <span>info@desacerdas.id</span>
                  </div>
                  <div className="flex items-center">
                    <i className={`fas fa-phone mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
                    <span>+62 21 1234 5678</span>
                  </div>
                  <div className="flex items-center">
                    <i className={`fas fa-map-marker-alt mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
                    <span>Jakarta, Indonesia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t py-8 ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span>&copy; 2024 DesaCerdas Platform.</span>
                <div className="flex items-center gap-1">
                  <span>Dibuat dengan</span>
                  <span className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} animate-pulse`}>❤️</span>
                  <span>untuk Indonesia</span>
                </div>
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Semua hak dilindungi. Terdaftar sebagai platform resmi pemberdayaan desa.
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Quality Badges */}
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                <i className="fas fa-check-circle mr-1"></i>
                Verified
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                <i className="fas fa-shield-alt mr-1"></i>
                Secure
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                <i className="fas fa-bolt mr-1"></i>
                Fast
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 z-50 ${
            isDarkMode 
              ? 'bg-emerald-700 hover:bg-emerald-600 text-white' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
          } border ${isDarkMode ? 'border-emerald-800/50' : 'border-emerald-600'} focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none`}
        >
          <i className="fas fa-chevron-up text-lg"></i>
        </button>
      </div>
    </footer> 
  );
};

export default Footer;
