import { Button } from "./ui/button";
import usePageStore from "@/store/page";
import useAuthStore from "@/store/auth";
import { useState, useEffect } from "react";

const Hero = () => {
  const { setCurrentPage } = usePageStore();
  const { isLoggedIn } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const stats = [
    { number: "1000+", label: "Desa Terdaftar", icon: "🏘️" },
    { number: "50K+", label: "Konsultasi Hukum", icon: "⚖️" },
    { number: "25K+", label: "Petani Terbantu", icon: "🌾" },
    { number: "2.5M+", label: "Dana Terkumpul", icon: "💰" }
  ];

  const features = [
    "Konsultasi Hukum AI",
    "Smart Farming",
    "Platform Donasi"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-transform duration-1000"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(99, 102, 241, 0.6) 100%), url('https://readdy.ai/api/search-image?query=beautiful%20Indonesian%20village%20landscape%20with%20modern%20technology%20integration%20showing%20traditional%20houses%20surrounded%20by%20green%20rice%20terraces%20and%20mountains%20in%20background%20with%20digital%20elements%20overlay&width=1440&height=800&seq=hero1&orientation=landscape')`,
        }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center justify-center p-1 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-fadeInDown">
          <span className="px-4 py-2 text-sm font-medium bg-white/20 rounded-full">
            🚀 Platform Digital Terdepan untuk Desa Indonesia
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight animate-fadeInUp">
          Platform Digital untuk
          <br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 animate-gradient">
              Memberdayakan Desa
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 rounded-lg blur opacity-30 animate-pulse"></div>
          </span>
        </h1>

        {/* Dynamic Subtitle */}
        <div className="mb-8 h-16 flex items-center justify-center">
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
            Solusi terpadu untuk 
            <span className="inline-block ml-2 font-bold text-yellow-300 transition-all duration-500">
              {features[currentSlide]}
            </span>
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-100 animate-fadeInUp animation-delay-600">
          Konsultasi hukum AI, pertanian cerdas, dan pemberdayaan ekonomi desa dalam satu platform terintegrasi
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fadeInUp animation-delay-900">
          <Button
            onClick={() => setCurrentPage(isLoggedIn ? "tanyahukum" : "login")}
            className="group relative px-8 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 min-w-48"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>Mulai Sekarang</span>
              <i className="fas fa-rocket transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"></i>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </Button>

          <Button
            onClick={() => setCurrentPage("about")}
            variant="outline"
            className="group px-8 py-4 text-lg font-semibold rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 min-w-48"
          >
            <span className="flex items-center gap-3">
              <i className="fas fa-play-circle transform group-hover:scale-110 transition-transform duration-300"></i>
              <span>Pelajari Lebih</span>
            </span>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fadeInUp animation-delay-1200">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group text-center transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-200 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
          <div className="text-xs text-white/70 mt-2 font-medium">Scroll</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(-5px) rotate(-5deg); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        
        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
      `}</style>
    </div>
  );
};

export default Hero;