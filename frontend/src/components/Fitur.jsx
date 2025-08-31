import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import useThemeStore from "@/store/theme";
import usePageStore from "@/store/page";
import { useNavigate } from "react-router-dom";

const Fitur = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  return (
    <div className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Fitur Unggulan Platform
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Tiga layanan utama untuk kemajuan desa Anda
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card TanyaHukum */}
          <Card className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} hover:shadow-xl transition-shadow cursor-pointer`}>
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=legal%20consultation%20icon%20with%20scales%20of%20justice%20and%20gavel%20in%20modern%20minimalist%20style%20with%20blue%20color%20scheme%20on%20clean%20white%20background&width=80&height=80&seq=legal1&orientation=squarish"
                  alt="TanyaHukum"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <CardTitle className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                TanyaHukum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Konsultasi hukum gratis dengan AI yang dilengkapi referensi undang-undang terkini
              </p>
              <Button 
                onClick={() => handlePageChange('tanyahukum')}
                className="w-full !rounded-button whitespace-nowrap cursor-pointer"
              >
                Mulai Konsultasi
              </Button>
            </CardContent>
          </Card>

          {/* Card FarmSmart */}
          <Card className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} hover:shadow-xl transition-shadow cursor-pointer`}>
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=smart%20farming%20technology%20icon%20with%20plants%20and%20digital%20elements%20in%20modern%20minimalist%20style%20with%20green%20color%20scheme%20on%20clean%20white%20background&width=80&height=80&seq=farm1&orientation=squarish"
                  alt="FarmSmart"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <CardTitle className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                FarmSmart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Rekomendasi pertanian cerdas dengan data cuaca BMKG dan panduan lengkap
              </p>
              <Button 
                onClick={() => handlePageChange('farmsmart')}
                className="w-full !rounded-button whitespace-nowrap cursor-pointer"
              >
                Mulai Bertani
              </Button>
            </CardContent>
          </Card>

          {/* Card BantuDesa */}
          <Card className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} hover:shadow-xl transition-shadow cursor-pointer`}>
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=community%20donation%20and%20village%20development%20icon%20with%20hands%20helping%20and%20heart%20symbol%20in%20modern%20minimalist%20style%20with%20orange%20color%20scheme%20on%20clean%20white%20background&width=80&height=80&seq=donation1&orientation=squarish"
                  alt="BantuDesa"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <CardTitle className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                BantuDesa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Platform donasi untuk pembangunan dan pemberdayaan masyarakat desa
              </p>
              <Button 
                onClick={() => handlePageChange('bantu-desa')}
                className="w-full !rounded-button whitespace-nowrap cursor-pointer"
              >
                Mulai Donasi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Fitur;