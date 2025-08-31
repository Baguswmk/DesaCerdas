import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useThemeStore from "@/store/theme";
import BantuDesaHero from "@/components/bantuDesa/BantuDesaHero";
import BantuDesaKegiatan from "@/components/bantuDesa/BantuDesaKegiatan";
const BantuDesaPage = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Header />
      <BantuDesaHero/>
      <BantuDesaKegiatan/>
      <Footer />
    </div>
  );
};

export default BantuDesaPage;
