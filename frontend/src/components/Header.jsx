import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import useThemeStore from "@/store/theme";
import useAuthStore from "@/store/auth";
import usePageStore from "@/store/page";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isLoggedIn, logout } = useAuthStore();
  const { setCurrentPage } = usePageStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    navigate(`/${page}`);
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkMode
            ? "bg-gray-900/95 backdrop-blur-sm"
            : "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentPage("home")}
          >
            <i
              className={`fas fa-home text-2xl ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            ></i>
            <span
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              DesaCerdas Platform
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {["home", "about", "contact"].map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors cursor-pointer`}
              >
                {page === "home"
                  ? "Beranda"
                  : page === "about"
                  ? "Tentang Kami"
                  : "Kontak"}
              </button>
            ))}

            <div className="relative">
              <button
                onClick=  {() => setShowDropdown(!showDropdown)}
                className={`flex items-center space-x-1 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors cursor-pointer`}
              >
                <span>Fitur</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              {showDropdown && (
                <div
                  className={`absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg ${
                    isDarkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  } py-1 z-50`}
                >
                  {["tanyahukum", "farmsmart", "bantudesa"].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setCurrentPage(f);
                        setShowDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      } cursor-pointer`}
                    >
                      {f === "tanyahukum"
                        ? "TanyaHukum"
                        : f === "farmsmart"
                        ? "FarmSmart"
                        : "BantuDesa"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode
                  ? "text-yellow-400 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <i
                className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"} text-lg`}
              ></i>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Selamat datang!
                </span>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="!rounded-button whitespace-nowrap cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handlePageChange("login")}
                  variant="ghost"
                  size="sm"
                  className="!rounded-button whitespace-nowrap cursor-pointer"
                >
                  Login
                </Button>
                <Button
                  onClick={() => handlePageChange("register")}
                  size="sm"
                  className="!rounded-button whitespace-nowrap cursor-pointer"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
