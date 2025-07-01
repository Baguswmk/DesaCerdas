import { Button } from "./ui/button";
import usePageStore from "@/store/page";
import useAuthStore from "@/store/auth";

const Hero = () => {
  const { setCurrentPage } = usePageStore();
  const { isLoggedIn } = useAuthStore();

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://readdy.ai/api/search-image?query=beautiful%20Indonesian%20village%20landscape%20with%20modern%20technology%20integration%20showing%20traditional%20houses%20surrounded%20by%20green%20rice%20terraces%20and%20mountains%20in%20background%20with%20digital%20elements%20overlay&width=1440&height=800&seq=hero1&orientation=landscape')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Platform Website untuk
          <br />
          <span className="text-green-400">Memberdayakan Masyarakat Desa</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Solusi digital terpadu untuk konsultasi hukum, pertanian cerdas, dan
          pemberdayaan ekonomi desa
        </p>
        <Button
          onClick={() => setCurrentPage(isLoggedIn ? "tanyahukum" : "login")}
          size="lg"
          className="!rounded-button whitespace-nowrap text-lg px-8 py-4 bg-green-600 hover:bg-green-700 cursor-pointer items-center"
        >
          Mulai Sekarang
          <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>
    </div>
  );
};

export default Hero;
