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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate(`/${page}`);
  };

  const navItems = [
    { page: "home", label: "Beranda" },
    { page: "about", label: "Tentang Kami" },
    { page: "contact", label: "Kontak" }
  ];

  const featureItems = [
    { page: "tanyahukum", label: "TanyaHukum", icon: "⚖️" },
    { page: "farmsmart", label: "FarmSmart", icon: "🌱" },
    { page: "bantudesa", label: "BantuDesa", icon: "🤝" }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? isDarkMode
              ? "bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-700/50"
              : "bg-white/95 backdrop-blur-md shadow-2xl border-b border-gray-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handlePageChange("home")}
            >
              <div className={`p-2 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                <i className="fas fa-home text-white text-xl"></i>
              </div>
              <div>
                <span className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} group-hover:text-green-600 transition-colors duration-300`}>
                  DesaCerdas
                </span>
                <div className="text-xs text-green-600 font-medium">Platform</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map(({ page, label }) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  } group`}
                >
                  {label}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </button>
              ))}

              {/* Features Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  } group`}
                >
                  <span>Fitur</span>
                  <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}></i>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    className={`absolute top-full left-0 mt-3 w-64 rounded-2xl shadow-2xl backdrop-blur-md border transform transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-800/95 border-gray-700/50"
                        : "bg-white/95 border-gray-200/50"
                    } py-2 z-50 animate-slideDown`}
                  >
                    {featureItems.map(({ page, label, icon }) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                            : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
                        } group`}
                      >
                        <span className="text-lg mr-3 transform group-hover:scale-110 transition-transform duration-200">{icon}</span>
                        <span>{label}</span>
                        <i className="fas fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-xs"></i>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  isDarkMode
                    ? "text-yellow-400 hover:bg-gray-800 bg-gray-700/50"
                    : "text-gray-600 hover:bg-gray-100 bg-gray-100/50"
                } shadow-lg hover:shadow-xl`}
              >
                <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"} text-lg`}></i>
              </button>

              {/* Auth Section */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center px-3 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                        isDarkMode
                          ? "bg-gray-800/50 hover:bg-gray-700 text-gray-300 border border-gray-700"
                          : "bg-white/50 hover:bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                    >
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                        <AvatarFallback className={
                          isDarkMode
                            ? "bg-gradient-to-br from-green-400 to-blue-400 text-white"
                            : "bg-gradient-to-br from-green-400 to-blue-400 text-white"
                        }>
                          {user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium truncate max-w-24">
                          {user?.name}
                        </div>
                        <div className="text-xs text-green-500">Online</div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => alert("Fitur Profil belum tersedia")}>
                      <i className="fas fa-user mr-2"></i>
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => handlePageChange("login")}
                    variant="ghost"
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handlePageChange("register")}
                    className="px-6 py-2 rounded-xl font-medium bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Register
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'} text-lg`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className={`lg:hidden absolute top-full left-0 right-0 backdrop-blur-md border-b transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-900/95 border-gray-700/50"
              : "bg-white/95 border-gray-200/50"
          } animate-slideDown`}>
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {navItems.map(({ page, label }) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
              
              <div className="border-t border-gray-300 dark:border-gray-700 pt-4 mt-4">
                <div className="text-sm font-medium text-gray-500 mb-3 px-4">Fitur</div>
                {featureItems.map(({ page, label, icon }) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg mr-3">{icon}</span>
                    {label}
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
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;