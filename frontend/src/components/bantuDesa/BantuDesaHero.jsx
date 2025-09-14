import { Button } from "../ui/button";
import { ArrowRight, Eye, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useThemeStore from "@/store/theme";

const BantuDesaHero = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useThemeStore();

    const scrollToKegiatan = () => {
        const kegiatanSection = document.getElementById('kegiatan-section');
        if (kegiatanSection) {
            kegiatanSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Enhanced Background with Emerald Theme */}
            <div className="absolute inset-0">
                {/* Base Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{
                        backgroundImage: `url('https://readdy.ai/api/search-image?query=Beautiful%20Indonesian%20village%20landscape%20with%20traditional%20houses%2C%20green%20rice%20fields%2C%20mountains%20in%20background%2C%20community%20gathering%2C%20warm%20golden%20hour%20lighting%2C%20peaceful%20rural%20atmosphere&width=1440&height=700&seq=hero1&orientation=landscape')`
                    }}
                />
                
                {/* Emerald Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/70 to-green-900/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-900/30" />
            </div>

            {/* Softer Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
            </div>

            {/* Animated Particles Background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/25 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${8 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-4xl">
                    {/* Main Heading with Enhanced Typography */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight animate-fadeInUp">
                        <span className="block">Bantu</span>
                        <span className="block bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                            Desa
                        </span>
                        <span className="block text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 mt-2">
                            Wujudkan Kegiatan Bersama
                        </span>
                    </h1>

                    {/* Enhanced Subtitle */}
                    <div className="mb-10 space-y-4 animate-fadeInUp animation-delay-300">
                        <p className="text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed font-medium">
                            Mari bergotong royong membangun desa lebih baik
                        </p>
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                            Melalui partisipasi aktif dalam setiap kegiatan pembangunan dan pemberdayaan masyarakat
                        </p>
                    </div>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 animate-fadeInUp animation-delay-600">
                        <Button 
                            size="lg" 
                            onClick={scrollToKegiatan}
                            className="group cursor-pointer !rounded-2xl px-8 py-4 text-lg font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 border-0"
                        >
                            <Eye className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                            Lihat Kegiatan
                            <ArrowRight className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                        
                        {/* <Button 
                            variant="outline" 
                            size="lg" 
                            onClick={() => navigate('/admin/dashboard')}
                            className="group !rounded-2xl px-8 py-4 text-lg font-bold bg-white/10 border-2 border-white/30 text-white hover:bg-white hover:text-emerald-600 backdrop-blur-sm shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300"
                        >
                            <Plus className="h-5 w-5 mr-3 transition-transform group-hover:rotate-90" />
                            Kelola Kegiatan
                        </Button> */}
                    </div>
                </div>
            </div>

            <style jsx>{`
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

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                        opacity: 1;
                    }
                }

                .animate-float {
                    animation: float 8s ease-in-out infinite;
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

                /* Respect reduced motion for accessibility */
                @media (prefers-reduced-motion: reduce) {
                    .animate-float,
                    .animate-fadeInUp,
                    .animation-delay-300,
                    .animation-delay-600 {
                        animation: none !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default BantuDesaHero;