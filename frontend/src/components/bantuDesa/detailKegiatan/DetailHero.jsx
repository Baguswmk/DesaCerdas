import useThemeStore from "@/store/theme";

const DetailHero = ({ title, image }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transform scale-110 transition-transform duration-1000 hover:scale-105"
          onError={(e) => {
            e.target.src = `https://readdy.ai/api/search-image?query=Indonesian%20village%20beautiful%20landscape&width=1440&height=600&seq=detail-hero`;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? "bg-gradient-to-t from-gray-900/90 via-gray-800/50 to-transparent" 
            : "bg-gradient-to-t from-emerald-900/80 via-emerald-800/40 to-transparent"
        }`}></div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-emerald-200/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-emerald-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-emerald-100/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end justify-start p-4 sm:p-6 lg:p-8 z-10">
        <div className="space-y-2 sm:space-y-4 max-w-full sm:max-w-2xl lg:max-w-4xl">
          {/* Title with gradient text */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight animate-fade-in-up">
            <span className={`text-transparent bg-clip-text ${
              isDarkMode 
                ? "bg-gradient-to-r from-emerald-200 via-white to-emerald-200" 
                : "bg-gradient-to-r from-emerald-100 via-white to-emerald-100"
            }`}>
              {title}
            </span>
          </h1>
          
          {/* Decorative line */}
          <div 
            className="h-0.5 sm:h-1 w-12 sm:w-16 lg:w-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-fade-in-up" 
            style={{ animationDelay: '0.3s' }}
          />

          {/* Subtitle */}
          <p 
            className={`text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed animate-fade-in-up ${
              isDarkMode ? 'text-emerald-100' : 'text-emerald-50'
            }`} 
            style={{ animationDelay: '0.6s' }}
          >
            Informasi lengkap dan terpercaya untuk kegiatan desa
          </p>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6;
          }
          33% { 
            transform: translateY(-8px) rotate(1deg); 
            opacity: 1;
          }
          66% { 
            transform: translateY(-4px) rotate(-1deg); 
            opacity: 0.8;
          }
        }
        
        @keyframes fade-in-up {
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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-fade-in-up {
            animation: none !important;
          }
          
          img {
            transform: none !important;
          }
        }

        /* Improve text readability on smaller screens */
        @media (max-width: 640px) {
          .text-transparent {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default DetailHero;