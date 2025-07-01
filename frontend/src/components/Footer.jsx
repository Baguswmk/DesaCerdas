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
  }
  return (
    <footer className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"} border-t`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <i className={`fas fa-home text-2xl ${isDarkMode ? "text-green-400" : "text-green-600"}`}></i>
              <span className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                DesaCerdas
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Platform digital untuk memberdayakan masyarakat desa Indonesia
            </p>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Fitur
            </h4>
            <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              <li>
                <button onClick={() => handlePageChange("tanyahukum")} className="hover:text-green-600 cursor-pointer">
                  TanyaHukum
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange("farmsmart")} className="hover:text-green-600 cursor-pointer">
                  FarmSmart
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange("bantudesa")} className="hover:text-green-600 cursor-pointer">
                  BantuDesa
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Perusahaan
            </h4>
            <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              <li>
                <button onClick={() => handlePageChange("about")} className="hover:text-green-600 cursor-pointer">
                  Tentang Kami
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange("contact")} className="hover:text-green-600 cursor-pointer">
                  Kontak
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Ikuti Kami
            </h4>
            <div className="flex space-x-4">
              <i className={`fab fa-facebook text-xl cursor-pointer hover:text-blue-600 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}></i>
              <i className={`fab fa-twitter text-xl cursor-pointer hover:text-blue-400 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}></i>
              <i className={`fab fa-instagram text-xl cursor-pointer hover:text-pink-600 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}></i>
              <i className={`fab fa-youtube text-xl cursor-pointer hover:text-red-600 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}></i>
            </div>
          </div>
        </div>

        <div className={`border-t mt-8 pt-8 text-center text-sm ${isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}>
          <p>&copy; 2024 DesaCerdas Platform. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
