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
        isDarkMode ? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900" : "bg-gradient-to-br from-gray-50 via-slate-100 to-gray-100"
      }`}
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-slate-400/10 rounded-full blur-3xl animate-pulse-slow"
          style={{
            left: `${20 + mousePosition.x * 0.01}%`,
            top: `${10 + mousePosition.y * 0.01}%`,
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 bg-gray-400/10 rounded-full blur-3xl animate-pulse-slow delay-1000"
          style={{
            right: `${15 + mousePosition.x * 0.01}%`,
            bottom: `${20 + mousePosition.y * 0.01}%`,
          }}
        ></div>
        
        {/* Fewer, more subtle floating particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-slate-400/30 rounded-full animate-float"
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
        className={`w-full max-w-md relative z-10 shadow-xl backdrop-blur-xl border overflow-hidden ${
          isDarkMode ? "bg-gray-800/90 border-gray-700/50" : "bg-white/90 border-gray-200/50"
        }`}
      >
        {/* Subtle top accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`}></div>

        <div className="relative z-10">
          <CardHeader className="text-center pb-8 pt-12">
            {/* Logo/Icon */}
            <div className="mb-6 mx-auto">
              <div className={`w-20 h-20 mx-auto rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} shadow-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300`}>
                <i className={`fas fa-user-circle text-3xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}></i>
              </div>
            </div>

            <CardTitle
              className={`text-3xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Selamat Datang
            </CardTitle>
            <p
              className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Masuk untuk mengakses platform 
              <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}> DesaCerdas</span>
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Error Display */}
            {loginError && (
              <div className={`mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-700/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'} animate-shake`}>
                <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-circle"></i>
                  <span className="font-medium">{loginError}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                  <i className={`fas fa-envelope ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}></i>
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
                        : isDarkMode
                          ? "border-gray-600 focus:border-slate-500 focus:ring-slate-500/20"
                          : "border-gray-300 focus:border-slate-400 focus:ring-slate-400/20"
                    } text-base w-full pl-11 pr-4 py-3 rounded-lg transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } hover:shadow-md focus:shadow-lg`}
                  />
                  <i className={`fas fa-at absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <i className="fas fa-times-circle"></i>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                  <i className={`fas fa-lock ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}></i>
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
                        : isDarkMode
                          ? "border-gray-600 focus:border-slate-500 focus:ring-slate-500/20"
                          : "border-gray-300 focus:border-slate-400 focus:ring-slate-400/20"
                    } text-base w-full pl-11 pr-12 py-3 rounded-lg transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } hover:shadow-md focus:shadow-lg`}
                  />
                  <i className={`fas fa-key absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <i className="fas fa-times-circle"></i>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className={`w-4 h-4 rounded focus:ring-2 transition-all duration-200 ${
                      isDarkMode 
                        ? 'text-slate-500 focus:ring-slate-400 bg-gray-700 border-gray-600' 
                        : 'text-slate-600 focus:ring-slate-500 bg-white border-gray-300'
                    }`}
                  />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors duration-200`}>
                    Ingat saya
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Fitur lupa password akan segera tersedia")}
                  className={`text-sm font-medium ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'} transition-colors duration-200`}
                >
                  Lupa password?
                </button>
              </div> */}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`w-full py-3 text-base font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner animate-spin"></i>
                    <span>Masuk...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-sign-in-alt"></i>
                    <span>Masuk ke Akun</span>
                  </span>
                )}
              </Button>
            </form>


            {/* Register Link */}
            <div className="mt-8 text-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Belum punya akun?{" "}
                <button
                  onClick={() => handlePageChange("register")}
                  className={`font-semibold ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'} transition-colors duration-200`}
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