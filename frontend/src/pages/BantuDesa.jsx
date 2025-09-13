import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useThemeStore from "@/store/theme";
import BantuDesaHero from "@/components/bantuDesa/BantuDesaHero";
import BantuDesaKegiatan from "@/components/bantuDesa/BantuDesaKegiatan";

const BantuDesaPage = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20"
    } relative overflow-hidden`}>
      {/* Enhanced background elements with emerald theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs with emerald colors */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-400/10 via-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-green-400/10 via-emerald-500/10 to-green-600/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        
        {/* Floating particles with emerald colors */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Enhanced grid pattern with emerald colors */}
        <div className={`absolute inset-0 opacity-20 ${
          isDarkMode ? 'bg-gray-800' : 'bg-emerald-50'
        }`} style={{
          backgroundImage: `
            linear-gradient(${isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-emerald-300/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/5 w-48 h-48 bg-green-400/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced header with glassmorphism */}
      <div className="relative z-20">
        <Header />
      </div>
      
      {/* Enhanced hero section */}
      <div className="relative z-10">
        <BantuDesaHero />
      </div>
      
      {/* Enhanced kegiatan section */}
      <div className="relative z-10">
        <BantuDesaKegiatan />
      </div>
      
      {/* Enhanced footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6; 
          }
          33% { 
            transform: translateY(-10px) rotate(5deg); 
            opacity: 1; 
          }
          66% { 
            transform: translateY(-5px) rotate(-5deg); 
            opacity: 0.8; 
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.6; 
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.8; 
          }
        }
        
        @keyframes gradient-x {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        .animate-float { 
          animation: float linear infinite; 
        }
        
        .animate-pulse-slow { 
          animation: pulse-slow 4s ease-in-out infinite; 
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        /* Enhanced glassmorphism effects */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }

        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
        }

        /* Enhanced shadow effects with emerald colors */
        .shadow-emerald-500\/25 {
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25);
        }

        .shadow-emerald-500\/10 {
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.1);
        }

        /* Enhanced hover effects */
        .hover\:shadow-emerald-500\/25:hover {
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25);
        }

        /* Enhanced border effects */
        .border-emerald-500\/30 {
          border-color: rgba(16, 185, 129, 0.3);
        }

        .border-emerald-500\/50 {
          border-color: rgba(16, 185, 129, 0.5);
        }

        /* Enhanced background effects */
        .bg-emerald-500\/10 {
          background-color: rgba(16, 185, 129, 0.1);
        }

        .bg-emerald-500\/20 {
          background-color: rgba(16, 185, 129, 0.2);
        }

        /* Respect reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-pulse-slow,
          .animate-gradient-x {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BantuDesaPage;