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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const features = [
    {
      page: "bantu-desa",
      label: "BantuDesa",
      icon: "🤝",
      desc: "Platform donasi",
    },
    {
      page: "tanyahukum",
      label: "TanyaHukum",
      icon: "⚖️",
      desc: "Konsultasi hukum gratis",
    },
    {
      page: "farmsmart",
      label: "FarmSmart",
      icon: "🌱",
      desc: "Pertanian cerdas",
    },
  ];

  const company = [
    { page: "about", label: "Tentang Kami", icon: "ℹ️" },
    { page: "contact", label: "Kontak", icon: "📞" },
  ];

  const socialMedia = [
    {
      icon: "fab fa-facebook",
      color: "hover:text-emerald-500",
      label: "Facebook",
      hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
    },
    {
      icon: "fab fa-twitter",
      color: "hover:text-emerald-600",
      label: "Twitter",
      hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
    },
    {
      icon: "fab fa-instagram",
      color: "hover:text-green-500",
      label: "Instagram",
      hoverBg: "hover:bg-green-50 dark:hover:bg-green-900/30",
    },
    {
      icon: "fab fa-youtube",
      color: "hover:text-emerald-500",
      label: "YouTube",
      hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
    },
    {
      icon: "fab fa-linkedin",
      color: "hover:text-green-600",
      label: "LinkedIn",
      hoverBg: "hover:bg-green-50 dark:hover:bg-green-900/30",
    },
  ];

  return (
    <footer
      className={`relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${
              isDarkMode ? "bg-emerald-300/15" : "bg-emerald-400/20"
            } rounded-full animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Enhanced emerald gradient overlays */}
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-emerald-300/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-100/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Enhanced top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Enhanced Brand Section */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                <div
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 shadow-lg sm:shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500 group overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <i className="fas fa-home text-xl sm:text-2xl text-white relative z-10"></i>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-300"></div>
                </div>
                <div>
                  <span
                    className={`text-2xl sm:text-3xl font-black ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } hover:bg-gradient-to-r hover:from-emerald-600 hover:via-green-600 hover:to-emerald-600 hover:bg-clip-text hover:text-transparent transition-all duration-500 cursor-pointer`}
                    onClick={() => handlePageChange("home")}
                  >
                    DesaCerdas
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-emerald-600 tracking-wider">
                    PLATFORM DIGITAL
                  </div>
                </div>
              </div>

              <p
                className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Platform digital terpadu yang memberdayakan masyarakat desa
                Indonesia melalui teknologi modern dan solusi inovatif untuk
                kemajuan bersama.
              </p>
            </div>

            {/* Enhanced Features Section */}
            <div>
              <h4
                className={`font-black text-lg sm:text-xl mb-6 sm:mb-8 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } flex items-center gap-3`}
              >
                <div className="p-2 items-center flex bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                  <i className="fas fa-rocket text-white text-sm"></i>
                </div>
                <span className="hidden sm:inline">Fitur Unggulan</span>
                <span className="sm:hidden">Fitur</span>
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                {features.map((feature, index) => {
                  const isDisabled = ["tanyahukum", "farmsmart"].includes(
                    feature.page
                  );

                  return (
                    <li key={feature.page}>
                      <button
                        onClick={() =>
                          !isDisabled && handlePageChange(feature.page)
                        }
                        disabled={isDisabled}
                        className={`cursor-pointer flex items-center group transition-all duration-300 p-3 sm:p-4 rounded-xl sm:rounded-2xl w-full text-left backdrop-blur-sm
            ${
              isDisabled
                ? "opacity-50 cursor-not-allowed bg-gray-200/40 dark:bg-gray-800/40 text-gray-400"
                : isDarkMode
                ? "hover:bg-gray-800/60 text-gray-300 hover:text-white border border-transparent hover:border-gray-700/60"
                : "hover:bg-gray-100/70 text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200/60"
            }`}
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${
                            index * 0.1
                          }s both`,
                        }}
                      >
                        <span className="text-lg sm:text-xl mr-3 sm:mr-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                          {feature.icon}
                        </span>
                        <div className="flex-1">
                          <div
                            className={`font-bold text-sm sm:text-base ${
                              isDisabled
                                ? "text-gray-400"
                                : "group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-green-600 group-hover:bg-clip-text group-hover:text-transparent"
                            } transition-all duration-300`}
                          >
                            {feature.label}
                          </div>
                          {isDisabled && (
                            <span className="text-[10px] font-medium uppercase bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
                              Coming Soon
                            </span>
                          )}
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            } ${
                              isDisabled
                                ? "opacity-70"
                                : "group-hover:text-gray-600 dark:group-hover:text-gray-300"
                            } transition-colors duration-300 hidden sm:block`}
                          >
                            {feature.desc}
                          </div>
                        </div>
                        {!isDisabled && (
                          <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-emerald-500"></i>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Enhanced Company Section */}
            <div>
              <h4
                className={`font-black text-lg sm:text-xl mb-6 sm:mb-8 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } flex items-center gap-3`}
              >
                <div className="p-2 items-center flex bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                  <i className="fas fa-building text-white text-sm"></i>
                </div>
                <span className="hidden sm:inline">Perusahaan</span>
                <span className="sm:hidden">Info</span>
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                {company.map((item, index) => (
                  <li key={item.page}>
                    <button
                      onClick={() => handlePageChange(item.page)}
                      className={` cursor-pointer  flex items-center group transition-all duration-300 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:shadow-lg sm:hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 ${
                        isDarkMode
                          ? "hover:bg-gray-800/60 text-gray-300 hover:text-white border border-transparent hover:border-gray-700/60"
                          : "hover:bg-gray-100/70 text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200/60"
                      } backdrop-blur-sm w-full text-left`}
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      <span className="text-lg mr-3 sm:mr-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {item.icon}
                      </span>
                      <span className="font-bold flex-1 text-sm sm:text-base group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-green-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {item.label}
                      </span>
                      <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-emerald-500"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Enhanced Social Media */}
            <div className="mb-6 sm:mb-8">
              <h4
                className={`group text-lg font-bold mb-4 sm:mb-6 flex items-center gap-3 transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } group-hover:text-emerald-400`}
              >
                <div className="p-2 items-center flex bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl transition-colors duration-300">
                  <i
                    className={`fas fa-share-alt text-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "text-white group-hover:text-emerald-400"
                        : "text-white group-hover:text-emerald-600"
                    }`}
                  ></i>
                </div>
                Ikuti Kami
              </h4>

              <div className="flex flex-wrap gap-3">
                {socialMedia.map((social, index) => (
                  <button
                    key={index}
                    className={` cursor-pointer p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 group shadow-lg hover:shadow-xl ${
                      isDarkMode
                        ? "bg-gray-800/60 hover:bg-gray-700/70 border border-gray-700/60"
                        : "bg-white/70 hover:bg-gray-50/80 border border-gray-200/60"
                    } backdrop-blur-sm ${social.color} ${
                      social.hoverBg
                    } hover:border-current/50`}
                    title={social.label}
                    aria-label={social.label}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <i
                      className={`${
                        social.icon
                      } text-base sm:text-lg transition-colors duration-300 group-hover:scale-125 ${
                        isDarkMode
                          ? "text-white group-hover:text-emerald-400"
                          : "text-gray-800 group-hover:text-emerald-600"
                      }`}
                    ></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div
          className={`border-t py-6 sm:py-8 ${
            isDarkMode ? "border-gray-700/60" : "border-gray-200/60"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div
              className={`text-xs sm:text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } text-center md:text-left`}
            >
              <div className="flex flex-col md:flex-row items-center gap-1 sm:gap-2 mb-2">
                <span>&copy; 2024 DesaCerdas Platform.</span>
                <div className="flex items-center gap-1">
                  <span>Dibuat dengan</span>
                  <span
                    className={`${
                      isDarkMode ? "text-red-400" : "text-red-500"
                    } animate-pulse text-sm sm:text-lg`}
                  >
                    ❤️
                  </span>
                  <span>untuk Indonesia</span>
                </div>
              </div>
              <div
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Semua hak dilindungi. Terdaftar sebagai platform resmi
                pemberdayaan desa.
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium backdrop-blur-sm border shadow-md ${
                    isDarkMode
                      ? "bg-emerald-900/50 text-emerald-300 border-emerald-800/60"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  } transform hover:scale-105 transition-all duration-200`}
                >
                  <i className="fas fa-check-circle mr-1"></i>
                  Terpercaya
                </div>
                <div
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium backdrop-blur-sm border shadow-md ${
                    isDarkMode
                      ? "bg-green-900/50 text-green-300 border-green-800/60"
                      : "bg-green-50 text-green-700 border-green-200"
                  } transform hover:scale-105 transition-all duration-200`}
                >
                  <i className="fas fa-shield-alt mr-1"></i>
                  Aman
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-4 sm:bottom-8 right-4 sm:right-8 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 z-50 group ${
            isDarkMode
              ? "bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 text-white"
              : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
          } border ${
            isDarkMode ? "border-emerald-800/60" : "border-emerald-600"
          } focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none backdrop-blur-sm`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl"></div>
          <i className="fas fa-chevron-up text-base sm:text-lg relative z-10 transform group-hover:-translate-y-1 transition-transform duration-200"></i>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
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
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%,
          100% {
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

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-gradient-x,
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
