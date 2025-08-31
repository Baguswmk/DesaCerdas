import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home"; 
import Kontak from "@/pages/Kontak";
import About from "@/pages/About";
import ScrollToTop from "@/utils/ScrollToTop";
import TanyaHukumPage from "@/pages/TanyaHukum";
import FarmSmartPage from "@/pages/FarmSmart";
import BantuDesaPage from "@/pages/BantuDesa";
import DetailKegiatanPage from "@/pages/DetailKegiatan";

const IndexRoute = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Kontak />} />
        <Route path="/about" element={<About />} />
        <Route path="/tanyahukum" element={<TanyaHukumPage />} />
        <Route path="/farmsmart" element={<FarmSmartPage />} />
        <Route path="/bantu-desa" element={<BantuDesaPage />} />
        <Route path="/bantu-desa/detail/:id" element={<DetailKegiatanPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default IndexRoute;