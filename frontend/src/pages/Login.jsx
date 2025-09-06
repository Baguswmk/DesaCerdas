import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { loginSchema } from "@/utils/Validator";       
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import useAuthStore from "@/store/auth";
import usePageStore from "@/store/page";
import useThemeStore from "@/store/theme";

const LoginPage = () => {
  const { login } = useAuthStore();
  const { setCurrentPage } = usePageStore();             
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoginError("");
      setIsLoading(true);
      const result = await login(data); 
      
      if (result.success) {
        setCurrentPage("home");
        navigate("/");
      } else {
        setLoginError(result.error || "Login gagal");
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setLoginError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden ${
        isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic gradient orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse-slow"
          style={{
            left: `${20 + mousePosition.x * 0.02}%`,
            top: `${10 + mousePosition.y * 0.02}%`,
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slow delay-1000"
          style={{
            right: `${15 + mousePosition.x * 0.015}%`,
            bottom: `${20 + mousePosition.y * 0.015}%`,
          }}
        ></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-float ${
              i % 3 === 0 ? 'bg-blue-400/40' : i % 3 === 1 ? 'bg-cyan-400/40' : 'bg-purple-400/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <Card
        className={`w-full max-w-md relative z-10 shadow-2xl backdrop-blur-xl border-0 overflow-hidden ${
          isDarkMode ? "bg-gray-800/80" : "bg-white/80"
        }`}
      >
        {/* Card glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-3xl blur opacity-20 animate-pulse"></div>
        
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-gradient-x"></div>

        <div className="relative z-10">
          <CardHeader className="text-center pb-8 pt-12">
            {/* Logo/Icon */}
            <div className="mb-6 mx-auto">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 shadow-2xl flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                <i className="fas fa-user-circle text-white text-3xl"></i>
              </div>
            </div>

            <CardTitle
              className={`text-4xl font-black mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
            >
              Selamat Datang
            </CardTitle>
            <p
              className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Masuk untuk mengakses platform 
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> DesaCerdas</span>
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Enhanced Error Display */}
            {loginError && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl backdrop-blur-sm animate-shake">
                <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-triangle text-red-500"></i>
                  <span className="font-medium">{loginError}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Enhanced Email Field */}
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                  <i className="fas fa-envelope text-blue-500"></i>
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    {...register("email")}
                    className={`${
                      errors.email 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                    } text-base w-full pl-12 pr-4 py-4 rounded-2xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } backdrop-blur-sm hover:shadow-lg focus:shadow-xl`}
                  />
                  <i className="fas fa-at absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-2 animate-fadeInUp">
                    <i className="fas fa-times-circle"></i>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Enhanced Password Field */}
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                  <i className="fas fa-lock text-purple-500"></i>
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    {...register("password")}
                    className={`${
                      errors.password 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                    } text-base w-full pl-12 pr-16 py-4 rounded-2xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } backdrop-blur-sm hover:shadow-lg focus:shadow-xl`}
                  />
                  <i className="fas fa-key absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-2 animate-fadeInUp">
                    <i className="fas fa-times-circle"></i>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors duration-200`}>
                    Ingat saya
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Fitur lupa password akan segera tersedia")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Lupa password?
                </button>
              </div>

              {/* Enhanced Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 text-white shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <i className="fas fa-spinner animate-spin"></i>
                    <span>Masuk...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <i className="fas fa-sign-in-alt"></i>
                      <span>Masuk ke Akun</span>
                    </span>
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  </>
                )}
              </Button>
            </form>

            {/* Social Login Section */}
            <div className="mt-8">
              <div className="relative">
                <div className={`absolute inset-0 flex items-center`}>
                  <div className={`w-full border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-4 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'} font-medium`}>
                    Atau masuk dengan
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => alert("Login Google akan segera tersedia")}
                  className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600/50' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } backdrop-blur-sm shadow-lg hover:shadow-xl`}
                >
                  <i className="fab fa-google text-red-500"></i>
                  <span className="font-medium">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("Login Facebook akan segera tersedia")}
                  className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600/50' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } backdrop-blur-sm shadow-lg hover:shadow-xl`}
                >
                  <i className="fab fa-facebook text-blue-500"></i>
                  <span className="font-medium">Facebook</span>
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p
                className={`text-base ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Belum punya akun?{" "}
                <button
                  onClick={() => handlePageChange("register")}
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 inline-block"
                >
                  Daftar sekarang →
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <button
                onClick={() => handlePageChange("home")}
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                } transition-colors duration-200 flex items-center justify-center gap-2 mx-auto`}
              >
                <i className="fas fa-home"></i>
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </CardContent>
        </div>
      </Card>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          33% { transform: translateY(-10px) rotate(5deg); opacity: 1; }
          66% { transform: translateY(-5px) rotate(-5deg); opacity: 0.8; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float { animation: float linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-gradient-x { 
          background-size: 200% 200%; 
          animation: gradient-x 3s ease infinite; 
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-fadeInUp { animation: fadeInUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default LoginPage;