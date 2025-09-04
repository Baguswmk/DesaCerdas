import React, { useEffect } from "react";
import useThemeStore from "@/store/theme";
import useAuthStore from "@/store/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompleteLegalQASystem from "@/components/tanyaHukum/CompleteLegalQASystem";

const TanyaHukumPage = () => {
  const { isDarkMode } = useThemeStore();
  const { autoLogin } = useAuthStore();

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header />
      
      {/* Full screen component */}
      <div className="pt-16"> {/* Account for fixed header */}
        <CompleteLegalQASystem />
      </div>

      <Footer />
    </div>
  );
};

export default TanyaHukumPage;