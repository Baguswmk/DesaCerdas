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
      <div className="flex px-4 gap-4 max-w-7xl mx-auto">
        {/* Sidebar kiri */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Sidebar />
        </div>

        {/* Room chat kanan */}
        <div className={`flex-1 p-6 overflow-hidden`}>
          <RoomChat />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TanyaHukumPage;
