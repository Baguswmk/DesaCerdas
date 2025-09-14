import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useThemeStore from "@/store/theme";
import useAuthStore from "@/store/auth";
import usePageStore from "@/store/page";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Header = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isLoggedIn, user, logout } = useAuthStore();
  const { setCurrentPage } = usePageStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

 const handlePageChange = (page) => {
  setCurrentPage(page);
  setShowDropdown(false);
  setShowMobileMenu(false);
  navigate(`/${page}`);

  // kalau beranda, langsung scroll ke atas
  if (page === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};


  const navItems = [
    { page: "home", label: "Beranda", icon: "🏠" },
    { page: "about", label: "Tentang Kami", icon: "ℹ️" },
    { page: "contact", label: "Kontak", icon: "📞" },
  ];

  const featureItems = [
    {
      page: "bantudesa",
      label: "BantuDesa",
      icon: "🤝",
      desc: "Platform donasi",
      disabled: false,
    },
    {
      page: "tanyahukum",
      label: "TanyaHukum",
      icon: "⚖️",
      desc: "Konsultasi hukum gratis",
      disabled: true,
    },
    {
      page: "farmsmart",
      label: "FarmSmart",
      icon: "🌱",
      desc: "Pertanian cerdas",
      disabled: true,
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? isDarkMode
              ? "backdrop-blur-xl  bg-gray-900/95 shadow-2xl border-b border-emerald-700/30"
              : "backdrop-blur-xl bg-white/95 shadow-2xl border-b border-emerald-200/50"
            : "bg-transparent"
        }`}
      >
        {/* Enhanced top accent line with emerald gradient animation */}
        {isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-1 text-white bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 animate-gradient-x"></div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Enhanced Logo Section */}
            <div
              className="flex items-center space-x-2 sm:space-x-4 cursor-pointer group"
              onClick={() => handlePageChange("home")}
            >
              <div
                className={`hidden sm:block sm:relative p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 shadow-lg sm:shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <i className="fas fa-home text-white text-lg sm:text-xl relative z-10"></i>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <span
                  className={`text-xl sm:text-2xl font-black transition-colors duration-300
    ${isScrolled ? (isDarkMode ? "text-white" : "text-gray-900") : "text-white"}
  `}
                >
                  DesaCerdas
                </span>

                <div
                  className={`text-xs font-bold tracking-wider transition-colors duration-300
    ${
      isScrolled
        ? isDarkMode
          ? "text-emerald-600"
          : "text-emerald-600"
        : "text-emerald-400"
    }
    group-hover:text-emerald-400
  `}
                >
                  PLATFORM DIGITAL
                </div>
              </div>
              {/* Mobile only text */}
              <span
                className={`sm:hidden text-lg font-black transition-colors duration-300
    ${isScrolled ? (isDarkMode ? "text-white" : "text-gray-900") : "text-white"}
    group-hover:text-emerald-500
  `}
              >
                DesaCerdas
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map(({ page, label, icon }) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`cursor-pointer relative px-4 xl:px-6 py-3 rounded-xl font-semibold transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:outline-none transform hover:scale-105
      ${
        isScrolled
          ? isDarkMode
            ? "text-white hover:text-emerald-300 hover:bg-emerald-800/30"
            : "text-gray-900 hover:text-gray-700 hover:bg-emerald-100/70"
          : "text-white hover:text-emerald-300"
      }
      backdrop-blur-sm border border-transparent hover:border-emerald-500/30 hover:shadow-lg`}
                >
                  <span className="flex items-center gap-2">
                    <span className="transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                      {icon}
                    </span>
                    <span>{label}</span>
                  </span>
                  <span className="absolute inset-x-2 bottom-1 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-emerald-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
              ))}

              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`cursor-pointer flex items-center space-x-2 px-4 xl:px-6 py-3 rounded-xl font-semibold transition-all duration-300 group backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:outline-none transform hover:scale-105 border border-transparent hover:border-emerald-500/30 hover:shadow-lg
    ${
      isScrolled
        ? isDarkMode
          ? "text-white hover:text-emerald-300 hover:bg-emerald-800/30"
          : "text-gray-900 hover:text-gray-700 hover:bg-emerald-100/70"
        : "text-white hover:text-emerald-300"
    }
    ${
      showDropdown
        ? isDarkMode
          ? "bg-emerald-800/50 border-emerald-600/50 text-white"
          : "bg-emerald-100/80 border-emerald-400/50 text-emerald-800"
        : ""
    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                      🚀
                    </span>
                    <span>Fitur</span>
                  </span>
                  <i
                    className={`fas fa-chevron-down text-xs transition-all duration-300 ${
                      showDropdown
                        ? "rotate-180 text-emerald-500"
                        : "group-hover:text-emerald-500"
                    }`}
                  ></i>
                  <span className="absolute inset-x-2 bottom-1 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                </button>

                {showDropdown && (
                  <div
                    className={`absolute top-full left-0 mt-4 w-80 rounded-2xl shadow-2xl backdrop-blur-xl border transform transition-all duration-500 animate-slideDown ${
                      isDarkMode
                        ? "bg-gray-800/95 border-emerald-700/50 shadow-emerald-900/20"
                        : "bg-white/95 border-emerald-200/50 shadow-emerald-500/10"
                    } py-3 z-50 overflow-hidden`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 animate-gradient-x"></div>

                    <div
                      className={`px-4 py-3 border-b ${
                        isDarkMode
                          ? "border-emerald-700/30"
                          : "border-emerald-200/50"
                      }`}
                    >
                      <h4
                        className={`font-bold text-sm ${
                          isDarkMode ? "text-emerald-300" : "text-emerald-700"
                        } uppercase tracking-wider flex items-center gap-2`}
                      >
                        <span className="text-base">🌟</span>
                        Fitur Unggulan
                      </h4>
                    </div>

                    {featureItems.map(
                      ({ page, label, icon, desc, disabled }) => (
                        <button
                          key={page}
                          onClick={() => !disabled && handlePageChange(page)}
                          disabled={disabled}
                          className={`cursor-pointer flex items-center w-full px-6 py-4 text-left transition-all duration-300 rounded-xl sm:rounded-2xl 
      ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isDarkMode
          ? "text-gray-300 hover:text-white hover:bg-emerald-800/30"
          : "text-gray-700 hover:text-gray-900 hover:bg-emerald-50/80"
      }`}
                        >
                          <div className="flex items-center gap-4 relative z-10 w-full">
                            <div className="text-2xl">{icon}</div>
                            <div className="flex-1">
                              <div
                                className={`font-bold text-base ${
                                  disabled
                                    ? "text-gray-400 dark:text-gray-500"
                                    : ""
                                }`}
                              >
                                {label}{" "}
                                {disabled && (
                                  <span className="text-xs ml-2">
                                    (Segera Hadir)
                                  </span>
                                )}
                              </div>
                              <div
                                className={`text-xs ${
                                  disabled
                                    ? "text-gray-400"
                                    : isDarkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {desc}
                              </div>
                            </div>
                            {!disabled && (
                              <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-sm text-emerald-500"></i>
                            )}
                          </div>
                        </button>
                      )
                    )}

                    <div
                      className={`px-6 py-3 border-t ${
                        isDarkMode
                          ? "border-emerald-700/30"
                          : "border-emerald-200/50"
                      } mt-2`}
                    >
                      <div
                        className={`text-xs text-center ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } flex items-center justify-center gap-2`}
                      >
                        <span>✨</span>
                        <span>Platform terpercaya untuk kemajuan desa</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`cursor-pointer relative p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-500 transform hover:scale-110 group overflow-hidden focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isDarkMode
                    ? "text-yellow-400 hover:bg-emerald-800/40 bg-emerald-700/30"
                    : "text-emerald-600 hover:bg-emerald-100/70 bg-emerald-100/50"
                } shadow-lg hover:shadow-xl backdrop-blur-sm border ${
                  isDarkMode ? "border-emerald-700/50" : "border-emerald-200/50"
                } hover:border-emerald-500/50`}
              >
                <div
                  className={`absolute inset-0 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-emerald-400/10 via-emerald-500/10 to-emerald-600/10"
                      : "bg-gradient-to-r from-emerald-200/30 via-emerald-300/30 to-emerald-200/30"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10 flex items-center justify-center">
                  <i
                    className={`fas ${
                      isDarkMode ? "fa-sun" : "fa-moon"
                    } text-base sm:text-lg transform group-hover:rotate-180 transition-transform duration-500`}
                  ></i>
                </div>

                <div
                  className={`absolute inset-0 ${
                    isDarkMode ? "bg-emerald-500" : "bg-emerald-400"
                  } opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}
                ></div>
              </button>

              {/* Auth Section */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`cursor-pointer flex items-center px-3 sm:px-4 py-6 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border group transform hover:scale-105 ${
                        isDarkMode
                          ? "bg-emerald-800/30 hover:bg-emerald-700/50 text-gray-300 border-emerald-700/50 hover:border-emerald-600/70"
                          : "bg-emerald-50/70 hover:bg-emerald-100/70 text-gray-700 border-emerald-200/50 hover:border-emerald-300/70"
                      } hover:border-emerald-500/50`}
                    >
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 sm:mr-3 ring-2 ring-emerald-500/50 group-hover:ring-4 group-hover:ring-emerald-500/70 transition-all duration-300">
                        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white font-bold text-xs sm:text-sm">
                          {user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left hidden sm:block">
                        <div className="text-sm font-bold truncate max-w-20 xl:max-w-24 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:via-emerald-500 group-hover:to-emerald-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {user?.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-500">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span>Online</span>
                        </div>
                      </div>
                      <i className="fas fa-chevron-down ml-1 sm:ml-2 text-xs transform group-hover:rotate-180 transition-transform duration-300"></i>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={`w-52 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                      isDarkMode
                        ? "bg-gray-800/95 border-emerald-700/50"
                        : "bg-white/95 border-emerald-200/50"
                    } animate-slideDown overflow-hidden`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 animate-gradient-x"></div>

                    {/* <DropdownMenuItem
                      onClick={() => toast.info("Fitur Profil belum tersedia")}
                      className={`px-4 py-3 cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                        isDarkMode
                          ? "hover:bg-emerald-800/30 text-gray-300 hover:text-white"
                          : "hover:bg-emerald-50/80 text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <i className="fas fa-user mr-3 text-emerald-500"></i>
                      <span className="font-medium">Profil Saya</span>
                    </DropdownMenuItem> */}

                    {user?.role === "ADMIN" && (
                      <DropdownMenuItem
                        onClick={() => handlePageChange("admin")}
                        className={`px-4 py-3 cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                          isDarkMode
                            ? "hover:bg-emerald-800/30 text-gray-300 hover:text-white"
                            : "hover:bg-emerald-50/80 text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <i className="fas fa-dashboard mr-3 text-emerald-500"></i>
                        <span className="font-medium">Dashboard Admin</span>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={logout}
                      className={`px-4 py-3 cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                        isDarkMode
                          ? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
                          : "hover:bg-red-50/80 text-red-600 hover:text-red-700"
                      }`}
                    >
                      <i className="fas fa-sign-out-alt mr-3"></i>
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Button
                    onClick={() => handlePageChange("login")}
                    variant="ghost"
                    className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm transform hover:scale-105 border border-transparent hover:border-emerald-500/30 hover:shadow-lg text-sm ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-emerald-800/30"
                        : "text-gray-700 hover:text-gray-900 hover:bg-emerald-100/70"
                    }`}
                  >
                    Masuk
                  </Button>
                  <Button
                    onClick={() => handlePageChange("register")}
                    className="px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-green-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden border border-emerald-500/30 text-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10">Daftar</span>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`lg:hidden p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-emerald-800/30"
                    : "text-gray-700 hover:text-gray-900 hover:bg-emerald-100/70"
                } backdrop-blur-sm shadow-lg hover:shadow-xl border ${
                  isDarkMode ? "border-emerald-700/50" : "border-emerald-200/50"
                } hover:border-emerald-500/50`}
              >
                <i
                  className={`fas ${
                    showMobileMenu ? "fa-times" : "fa-bars"
                  } text-base sm:text-lg transform transition-transform duration-300 ${
                    showMobileMenu ? "rotate-180" : ""
                  }`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div
            className={`lg:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b transition-all duration-500 ${
              isDarkMode
                ? "bg-gray-900/95 border-emerald-700/50"
                : "bg-white/95 border-emerald-200/50"
            } animate-slideDown shadow-2xl overflow-hidden`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 animate-gradient-x"></div>

            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-2">
              {navItems.map(({ page, label, icon }) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:outline-none transform hover:scale-102 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-emerald-800/30"
                      : "text-gray-700 hover:text-gray-900 hover:bg-emerald-100/70"
                  } backdrop-blur-sm border border-transparent hover:border-emerald-500/30 hover:shadow-lg`}
                >
                  <span className="text-lg sm:text-xl mr-3 sm:mr-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {icon}
                  </span>
                  <span className="text-sm sm:text-base">{label}</span>
                  <i className="fas fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-emerald-500"></i>
                </button>
              ))}

              <div
                className={`border-t pt-4 sm:pt-6 mt-4 sm:mt-6 ${
                  isDarkMode ? "border-emerald-700/50" : "border-emerald-200/50"
                }`}
              >
                <div className="text-sm font-semibold text-emerald-600 mb-3 sm:mb-4 px-4 sm:px-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-base">🚀</span>
                  Fitur Unggulan
                </div>
                {featureItems.map(({ page, label, icon, desc, disabled }) => (
                  <button
                    key={page}
                    onClick={() => !disabled && handlePageChange(page)}
                    disabled={disabled}
                    className={`flex items-center w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 
      ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isDarkMode
          ? "text-gray-300 hover:text-white hover:bg-emerald-800/30"
          : "text-gray-700 hover:text-gray-900 hover:bg-emerald-100/70"
      }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      <span className="text-lg sm:text-xl">{icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-sm sm:text-base">
                          {label}{" "}
                          {disabled && (
                            <span className="text-xs ml-2">(Segera Hadir)</span>
                          )}
                        </div>
                        <div
                          className={`text-xs ${
                            disabled
                              ? "text-gray-400"
                              : isDarkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {desc}
                        </div>
                      </div>
                      {!disabled && (
                        <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-emerald-500"></i>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
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

        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        /* Responsive font sizes */
        @media (max-width: 640px) {
          .max-w-20 {
            max-width: 4rem;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
