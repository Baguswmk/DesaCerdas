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
  };

  const navItems = [
    { page: "home", label: "Beranda", icon: "🏠" },
    { page: "about", label: "Tentang Kami", icon: "ℹ️" },
    { page: "contact", label: "Kontak", icon: "📞" },
  ];

  const featureItems = [
    {
      page: "tanyahukum",
      label: "TanyaHukum",
      icon: "⚖️",
      desc: "Konsultasi hukum gratis",
      color: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    },
    {
      page: "farmsmart",
      label: "FarmSmart",
      icon: "🌱",
      desc: "Pertanian cerdas",
      color: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    },
    {
      page: "bantudesa",
      label: "BantuDesa",
      icon: "🤝",
      desc: "Platform donasi",
      color: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? isDarkMode
              ? "bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-gray-700/50"
              : "bg-white/80 backdrop-blur-xl shadow-2xl border-b border-gray-200/50"
            : "bg-transparent"
        }`}
      >
        {/* Enhanced top accent line with gradient animation */}
        {isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 animate-gradient-x"></div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo Section with modern styling */}
            <div
              className="flex items-center space-x-4 cursor-pointer group"
              onClick={() => handlePageChange("home")}
            >
              <div
                className={`relative p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 overflow-hidden`}
              >
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <i className="fas fa-home text-white text-xl relative z-10"></i>
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-purple-600 opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-300"></div>
              </div>
              <div>
                <span
                  className={`text-2xl font-black ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:via-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}
                >
                  DesaCerdas
                </span>
                <div className="text-xs text-emerald-600 font-bold tracking-wider">
                  PLATFORM DIGITAL
                </div>
              </div>
            </div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map(({ page, label, icon }) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:outline-none transform hover:scale-105 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/50"
                  } backdrop-blur-sm border border-transparent hover:border-emerald-500/30 hover:shadow-lg`}
                >
                  <span className="flex items-center gap-2">
                    <span className="transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                      {icon}
                    </span>
                    <span>{label}</span>
                  </span>
                  {/* Enhanced animated underline */}
                  <span className="absolute inset-x-2 bottom-1 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                  {/* Enhanced hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
              ))}

              {/* Enhanced Features Dropdown with modern styling */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:outline-none transform hover:scale-105 border border-transparent hover:border-emerald-500/30 hover:shadow-lg ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/50"
                  } ${
                    showDropdown
                      ? "bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 border-emerald-500/50"
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
                  {/* Enhanced animated underline */}
                  <span className="absolute inset-x-2 bottom-1 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                </button>

                {/* Enhanced Dropdown Menu with glassmorphism */}
                {showDropdown && (
                  <div
                    className={`absolute top-full left-0 mt-4 w-80 rounded-2xl shadow-2xl backdrop-blur-xl border transform transition-all duration-500 animate-slideDown ${
                      isDarkMode
                        ? "bg-gray-800/90 border-gray-700/50 shadow-gray-900/50"
                        : "bg-white/90 border-gray-200/50 shadow-gray-500/20"
                    } py-3 z-50 overflow-hidden`}
                  >
                    {/* Enhanced gradient top accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 animate-gradient-x"></div>

                    <div className="px-4 py-3 border-b border-gray-200/20">
                      <h4
                        className={`font-bold text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } uppercase tracking-wider flex items-center gap-2`}
                      >
                        <span className="text-base">🌟</span>
                        Fitur Unggulan
                      </h4>
                    </div>

                    {featureItems.map(({ page, label, icon, desc, color }) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center w-full px-6 py-4 text-left transition-all duration-300 group ${
                          isDarkMode
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-700 hover:text-gray-900"
                        } ${color} relative overflow-hidden hover:shadow-lg transform hover:scale-102`}
                      >
                        {/* Enhanced hover background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="flex items-center gap-4 relative z-10">
                          <div className="text-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                            {icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-base group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:via-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                              {label}
                            </div>
                            <div
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              } group-hover:text-gray-600 dark:group-hover:text-gray-300`}
                            >
                              {desc}
                            </div>
                          </div>
                          <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-sm text-emerald-500"></i>
                        </div>
                      </button>
                    ))}

                    {/* Enhanced bottom accent */}
                    <div className="px-6 py-3 border-t border-gray-200/20 mt-2">
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

            {/* Enhanced Right Section */}
            <div className="flex items-center space-x-3">
              {/* Enhanced Theme Toggle with modern styling */}
              <button
                onClick={toggleTheme}
                className={`relative p-4 rounded-2xl transition-all duration-500 transform hover:scale-110 group overflow-hidden focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isDarkMode
                    ? "text-yellow-400 hover:bg-gray-800/50 bg-gray-700/50"
                    : "text-gray-600 hover:bg-gray-100/50 bg-gray-100/50"
                } shadow-xl hover:shadow-2xl backdrop-blur-sm border ${
                  isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
                } hover:border-emerald-500/50`}
              >
                {/* Enhanced animated background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    isDarkMode
                      ? "from-emerald-400/10 via-blue-500/10 to-purple-500/10"
                      : "from-emerald-200/20 via-blue-200/20 to-purple-200/20"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10 flex items-center justify-center">
                  <i
                    className={`fas ${
                      isDarkMode ? "fa-sun" : "fa-moon"
                    } text-lg transform group-hover:rotate-180 transition-transform duration-500`}
                  ></i>
                </div>

                {/* Enhanced glow effect */}
                <div
                  className={`absolute inset-0 ${
                    isDarkMode ? "bg-emerald-500" : "bg-emerald-400"
                  } opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}
                ></div>
              </button>

              {/* Enhanced Auth Section */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-sm border group transform hover:scale-105 ${
                        isDarkMode
                          ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-700/50 hover:border-gray-600/50"
                          : "bg-white/50 hover:bg-gray-50/50 text-gray-700 border-gray-200/50 hover:border-gray-300/50"
                      } hover:border-emerald-500/50`}
                    >
                      <Avatar className="h-10 w-10 mr-3 ring-2 ring-emerald-500/50 group-hover:ring-4 group-hover:ring-emerald-500/70 transition-all duration-300">
                        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 text-white font-bold">
                          {user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-bold truncate max-w-24 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:via-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {user?.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-500">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span>Online</span>
                        </div>
                      </div>
                      <i className="fas fa-chevron-down ml-2 text-xs transform group-hover:rotate-180 transition-transform duration-300"></i>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={`w-52 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                      isDarkMode
                        ? "bg-gray-800/90 border-gray-700/50"
                        : "bg-white/90 border-gray-200/50"
                    } animate-slideDown overflow-hidden`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 animate-gradient-x"></div>

                    {/* Profile */}
                    <DropdownMenuItem
                      onClick={() => toast.info("Fitur Profil belum tersedia")}
                      className="px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50/70 dark:hover:from-emerald-900/20 dark:hover:to-blue-900/20 transition-all duration-300 transform hover:scale-102"
                    >
                      <i className="fas fa-user mr-3 text-emerald-500"></i>
                      <span className="font-medium">Profil Saya</span>
                    </DropdownMenuItem>

                    {user?.role === "ADMIN" && (
                      <DropdownMenuItem
                        onClick={() => handlePageChange("admin")}
                        className="px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50/70 dark:hover:from-emerald-900/20 dark:hover:to-blue-900/20 transition-all duration-300 transform hover:scale-102"
                      >
                        <i className="fas fa-dashboard mr-3 text-emerald-500"></i>
                        <span className="font-medium">Dashboard Admin</span>
                      </DropdownMenuItem>
                    )}

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={logout}
                      className="px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 text-red-600 transition-all duration-300 transform hover:scale-102"
                    >
                      <i className="fas fa-sign-out-alt mr-3"></i>
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => handlePageChange("login")}
                    variant="ghost"
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm transform hover:scale-105 border border-transparent hover:border-emerald-500/30 hover:shadow-lg ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/50"
                    }`}
                  >
                    Masuk
                  </Button>
                  <Button
                    onClick={() => handlePageChange("register")}
                    className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-400 hover:via-blue-400 hover:to-purple-400 text-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden border border-emerald-500/30"
                  >
                    {/* Enhanced shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10">Daftar</span>
                  </Button>
                </div>
              )}

              {/* Enhanced Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`lg:hidden p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/50"
                } backdrop-blur-sm shadow-xl hover:shadow-2xl border ${
                  isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
                } hover:border-emerald-500/50`}
              >
                <i
                  className={`fas ${
                    showMobileMenu ? "fa-times" : "fa-bars"
                  } text-lg transform transition-transform duration-300 ${
                    showMobileMenu ? "rotate-180" : ""
                  }`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu with glassmorphism */}
        {showMobileMenu && (
          <div
            className={`lg:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b transition-all duration-500 ${
              isDarkMode
                ? "bg-gray-900/90 border-gray-700/50"
                : "bg-white/90 border-gray-200/50"
            } animate-slideDown shadow-2xl overflow-hidden`}
          >
            {/* Enhanced top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 animate-gradient-x"></div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-2">
              {navItems.map(({ page, label, icon }) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`flex items-center w-full px-6 py-4 rounded-2xl font-semibold transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:outline-none transform hover:scale-102 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/50"
                  } backdrop-blur-sm border border-transparent hover:border-emerald-500/30 hover:shadow-lg`}
                >
                  <span className="text-xl mr-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {icon}
                  </span>
                  <span>{label}</span>
                  <i className="fas fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-emerald-500"></i>
                </button>
              ))}

              <div
                className={`border-t pt-6 mt-6 ${
                  isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
                }`}
              >
                <div className="text-sm font-semibold text-emerald-600 mb-4 px-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-base">🚀</span>
                  Fitur Unggulan
                </div>
                {featureItems.map(({ page, label, icon, desc }) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex items-center w-full px-6 py-4 rounded-2xl font-semibold transition-all duration-300 group transform hover:scale-102 ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/50"
                    } backdrop-blur-sm hover:shadow-lg border border-transparent hover:border-emerald-500/30`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <span className="text-xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                        {icon}
                      </span>
                      <div className="flex-1 text-left">
                        <div className="font-bold">{label}</div>
                        <div
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {desc}
                        </div>
                      </div>
                      <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-emerald-500"></i>
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
      `}</style>
    </>
  );
};

export default Header;