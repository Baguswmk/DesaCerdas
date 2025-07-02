import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useThemeStore from "@/store/theme";
import useAuthStore from "@/store/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/tanyaHukum/Sidebar";
import RoomChat from "@/components/tanyaHukum/RoomChat";

const TanyaHukumPage = () => {
  const { isDarkMode } = useThemeStore();
  const { isLoggedIn, autoLogin, user } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div
      className={`min-h-screen pt-20 pb-10 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header />

      {/* Layout utama */}
      <div className="max-w-7xl mx-auto flex flex-1">
        {/* Sidebar kiri */}

        <Sidebar />

        {/* Room chat kanan */}
        <RoomChat />
      </div>

      <Footer />
    </div>
  );
};

export default TanyaHukumPage;
