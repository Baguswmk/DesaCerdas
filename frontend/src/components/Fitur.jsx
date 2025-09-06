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

  const features = [
    {
      id: 'tanyahukum',
      title: 'TanyaHukum',
      description: 'Konsultasi hukum gratis dengan AI yang dilengkapi referensi undang-undang terkini',
      icon: 'https://readdy.ai/api/search-image?query=legal%20consultation%20icon%20with%20scales%20of%20justice%20and%20gavel%20in%20modern%20minimalist%20style%20with%20blue%20color%20scheme%20on%20clean%20white%20background&width=80&height=80&seq=legal1&orientation=squarish',
      bgColor: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      buttonText: 'Mulai Konsultasi',
      route: 'tanyahukum'
    },
    {
      id: 'farmsmart',
      title: 'FarmSmart',
      description: 'Rekomendasi pertanian cerdas dengan data cuaca BMKG dan panduan lengkap',
      icon: 'https://readdy.ai/api/search-image?query=smart%20farming%20technology%20icon%20with%20plants%20and%20digital%20elements%20in%20modern%20minimalist%20style%20with%20green%20color%20scheme%20on%20clean%20white%20background&width=80&height=80&seq=farm1&orientation=squarish',
      bgColor: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      buttonText: 'Mulai Bertani',
      route: 'farmsmart'
    },
    {
      id: 'bantudesa',
      title: 'BantuDesa',
      description: 'Platform donasi untuk membantu pembangunan dan pemberdayaan masyarakat desa',
      icon: 'https://readdy.ai/api/search-image?query=community%20donation%20and%20village%20development%20icon%20with%20hands%20helping%20and%20heart%20symbol%20in%20modern%20minimalist%20style%20with%20orange%20color%20scheme%20on%20clean%20white%20background&width=80&height=80&seq=donation1&orientation=squarish',
      bgColor: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      buttonText: 'Mulai Donasi',
      route: 'bantu-desa'
    }
  ];

  return (
    <section className={`py-24 relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-4">
            <span className="text-sm font-medium text-green-600 bg-white px-3 py-1 rounded-full">
              ✨ Fitur Unggulan
            </span>
          </div>
          <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Platform
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Digital </span>
            untuk Desa
          </h2>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Tiga layanan utama yang dirancang khusus untuk kemajuan dan pemberdayaan desa Anda
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
              }}
            >
              <Card className={`
                relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl 
                transition-all duration-500 transform hover:-translate-y-2
                ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}
                hover:scale-105 cursor-pointer
              `}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <CardHeader className="text-center pt-12 pb-6 relative z-10">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-24 h-24 mx-auto rounded-2xl ${feature.iconBg} flex items-center justify-center overflow-hidden shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <img 
                        src={feature.icon}
                        alt={feature.title}
                        className="w-14 h-14 object-cover"
                      />
                    </div>
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                  
                  <CardTitle className={`text-2xl md:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-8 pb-10 relative z-10">
                  <p className={`text-center leading-relaxed mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-base md:text-lg`}>
                    {feature.description}
                  </p>
                  
                  <Button 
                    onClick={() => handlePageChange(feature.route)}
                    className={`
                      w-full py-4 text-lg font-semibold rounded-xl
                      bg-gradient-to-r ${feature.bgColor} hover:shadow-2xl
                      transform hover:scale-105 transition-all duration-300
                      text-white border-0 relative overflow-hidden
                      group-hover:animate-pulse
                    `}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {feature.buttonText}
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                </CardContent>
                
                {/* Card border glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Bottom Call to Action */}
        <div className="text-center mt-20">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} shadow-lg`}>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Platform terpercaya untuk kemajuan desa Indonesia</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Fitur;