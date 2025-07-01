import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import useThemeStore from "@/store/theme";
import Fitur from "@/components/Fitur";

const Home = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Header />
      <Hero />
      <Fitur />
      <Footer />
    </div>
  );
};

export default Home;
