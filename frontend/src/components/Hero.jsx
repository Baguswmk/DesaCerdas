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
    <div className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden">
      {/* Background with softer colors */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-transform duration-1000"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(6, 95, 70, 0.85) 0%, rgba(5, 122, 85, 0.75) 50%, rgba(16, 185, 129, 0.6) 100%), url('https://readdy.ai/api/search-image?query=beautiful%20Indonesian%20village%20landscape%20with%20modern%20technology%20integration%20showing%20traditional%20houses%20surrounded%20by%20green%20rice%20terraces%20and%20mountains%20in%20background%20with%20digital%20elements%20overlay&width=1440&height=800&seq=hero1&orientation=landscape')`,
        }}
      />

      {/* Softer Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-emerald-100/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/25 rounded-full animate-float"
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
        {/* Main Heading */}
        <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight animate-fadeInUp">
          Platform Digital untuk
          <br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-emerald-200">
              Memberdayakan Desa
            </span>
          </span>
        </h1>

        {/* Dynamic Subtitle */}
        <div className="mb-8 h-16 flex items-center justify-center">
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
            Solusi terpadu untuk 
            <span className="inline-block ml-2 font-bold text-emerald-200 transition-all duration-500">
              {features[currentSlide]}
            </span>
            <span className="animate-pulse text-emerald-300">|</span>
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
            className="group relative px-8 py-4 text-lg font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-48 border border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>Mulai Sekarang</span>
              <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform duration-300"></i>
            </span>
          </Button>

          <Button
            onClick={() => setCurrentPage("about")}
            variant="outline"
            className="group px-8 py-4 text-lg font-semibold rounded-xl bg-emerald-50/10 backdrop-blur-sm border-2 border-emerald-300/40 text-white hover:bg-emerald-100/20 hover:border-emerald-300/60 transition-all duration-300 min-w-48 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="flex items-center gap-3">
              <i className="fas fa-info-circle transform group-hover:scale-110 transition-transform duration-300"></i>
              <span>Pelajari Lebih</span>
            </span>
          </Button>
        </div>

        {/* Statistics */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fadeInUp animation-delay-1200">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group text-center transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/20 hover:border-white/30">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-slate-200 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-200 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Scroll Indicator */}
          {/* <div className="absolute bottom-0  left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
            <div className="text-xs text-white/60 mt-2 font-medium">Scroll</div>
          </div> */}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(-5px) rotate(-2deg); }
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
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
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

        /* Respect reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-fadeInDown,
          .animate-fadeInUp,
          .animation-delay-300,
          .animation-delay-600,
          .animation-delay-900,
          .animation-delay-1200 {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
