import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import useThemeStore from "@/store/theme";
import Fitur from "@/components/Fitur";

const Home = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      <Header />
      <Hero />
      <Fitur />
      <Footer />
    </div>
  );
};

export default Home;