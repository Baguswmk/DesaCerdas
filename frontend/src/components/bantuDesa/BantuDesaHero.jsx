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
        <section className=" relative min-h-[700px] flex items-center overflow-hidden">
            {/* Enhanced Background with Multiple Layers */}
            <div className="absolute inset-0">
                {/* Base Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{
                        backgroundImage: `url('https://readdy.ai/api/search-image?query=Beautiful%20Indonesian%20village%20landscape%20with%20traditional%20houses%2C%20green%20rice%20fields%2C%20mountains%20in%20background%2C%20community%20gathering%2C%20warm%20golden%20hour%20lighting%2C%20peaceful%20rural%20atmosphere&width=1440&height=700&seq=hero1&orientation=landscape')`
                    }}
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-purple-900/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-900/30" />
            </div>

            {/* Animated Particles Background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
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
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
                        <span className="block">Bantu</span>
                        <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                            Desa
                        </span>
                        <span className="block text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 mt-2">
                            Wujudkan Kegiatan Bersama
                        </span>
                    </h1>

                    {/* Enhanced Subtitle */}
                    <div className="mb-10 space-y-4">
                        <p className="text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed font-medium">
                            Mari bergotong royong membangun desa lebih baik
                        </p>
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                            Melalui partisipasi aktif dalam setiap kegiatan pembangunan dan pemberdayaan masyarakat
                        </p>
                    </div>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Button 
                            size="lg" 
                            onClick={scrollToKegiatan}
                            className="group !rounded-2xl px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 border-0"
                        >
                            <Eye className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                            Lihat Kegiatan
                            <ArrowRight className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            size="lg" 
                            onClick={() => navigate('/admin/dashboard')}
                            className="group !rounded-2xl px-8 py-4 text-lg font-bold bg-white/10 border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300"
                        >
                            <Plus className="h-5 w-5 mr-3 transition-transform group-hover:rotate-90" />
                            Kelola Kegiatan
                        </Button>
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
            `}</style>
        </section>
    );
};

export default BantuDesaHero;