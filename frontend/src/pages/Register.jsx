import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { registerSchema } from "@/utils/Validator";

import useAuthStore from "@/store/auth";
import useThemeStore from "@/store/theme";
import usePageStore from "@/store/page";

const Register = () => {
  const { isDarkMode } = useThemeStore();
  const { setCurrentPage } = usePageStore();
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    if (strength <= 25) return { strength, text: "Lemah", color: "bg-red-500" };
    if (strength <= 50) return { strength, text: "Cukup", color: "bg-yellow-500" };
    if (strength <= 75) return { strength, text: "Baik", color: "bg-blue-500" };
    return { strength, text: "Kuat", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    try {
      setRegisterError("");
      setRegisterSuccess("");
      setIsLoading(true);
      
      const result = await registerUser(data);
      
      if (result.success) {
        setRegisterSuccess("Registrasi berhasil! Silakan login.");
        setTimeout(() => {
          setCurrentPage("login");
          navigate("/login");
        }, 2000);
      } else {
        setRegisterError(result.error || "Registrasi gagal");
      }
    } catch (err) {
      console.error('Register submit error:', err);
      setRegisterError("Terjadi kesalahan. Silakan coba lagi.");
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
        isDarkMode ? "bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" : "bg-gradient-to-br from-purple-50 via-white to-pink-50"
      }`}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic gradient orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse-slow"
          style={{
            left: `${25 + mousePosition.x * 0.02}%`,
            top: `${15 + mousePosition.y * 0.02}%`,
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse-slow delay-1000"
          style={{
            right: `${20 + mousePosition.x * 0.015}%`,
            bottom: `${25 + mousePosition.y * 0.015}%`,
          }}
        ></div>
        
        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-float ${
              i % 4 === 0 ? 'bg-purple-400/40' : 
              i % 4 === 1 ? 'bg-pink-400/40' : 
              i % 4 === 2 ? 'bg-blue-400/40' : 'bg-cyan-400/40'
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
        className={`w-full max-w-lg relative z-10 shadow-2xl backdrop-blur-xl border-0 overflow-hidden ${
          isDarkMode ? "bg-gray-800/80" : "bg-white/80"
        }`}
      >
        {/* Card glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur opacity-20 animate-pulse"></div>
        
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient-x"></div>

        <div className="relative z-10">
          <CardHeader className="text-center pb-8 pt-12">
            {/* Logo/Icon */}
            <div className="mb-6 mx-auto">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 shadow-2xl flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                <i className="fas fa-user-plus text-white text-3xl"></i>
              </div>
            </div>

            <CardTitle
              className={`text-4xl font-black mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}
            >
              Bergabunglah
            </CardTitle>
            <p
              className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Daftar dan jadilah bagian dari komunitas 
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> DesaCerdas</span>
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Enhanced Error Display */}
            {registerError && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl backdrop-blur-sm animate-shake">
                <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-triangle text-red-500"></i>
                  <span className="font-medium">{registerError}</span>
                </div>
              </div>
            )}
            
            {/* Enhanced Success Display */}
            {registerSuccess && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-2xl backdrop-blur-sm animate-bounce-gentle">
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="font-medium">{registerSuccess}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Enhanced Name Field */}
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                  <i className="fas fa-user text-purple-500"></i>
                  Nama Lengkap
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    {...register("name")}
                    className={`${
                      errors.name 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                    } text-base w-full pl-12 pr-4 py-4 rounded-2xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } backdrop-blur-sm hover:shadow-lg focus:shadow-xl`}
                  />
                  <i className="fas fa-id-card absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-2 animate-fadeInUp">
                    <i className="fas fa-times-circle"></i>
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  <i className="fas fa-lock text-pink-500"></i>
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Buat password yang kuat"
                    {...register("password")}
                    className={`${
                      errors.password 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20"
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
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.strength <= 25 ? 'text-red-500' :
                        passwordStrength.strength <= 50 ? 'text-yellow-500' :
                        passwordStrength.strength <= 75 ? 'text-blue-500' : 'text-green-500'
                      }`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Password harus mengandung huruf besar, kecil, angka (min. 8 karakter)
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-2 animate-fadeInUp">
                    <i className="fas fa-times-circle"></i>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Enhanced Confirm Password Field */}
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                  <i className="fas fa-lock text-cyan-500"></i>
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    {...register("confirmPassword")}
                    className={`${
                      errors.confirmPassword 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-gray-300 dark:border-gray-600 focus:border-cyan-500 focus:ring-cyan-500/20"
                    } text-base w-full pl-12 pr-16 py-4 rounded-2xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } backdrop-blur-sm hover:shadow-lg focus:shadow-xl`}
                  />
                  <i className="fas fa-check-double absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-2 animate-fadeInUp">
                    <i className="fas fa-times-circle"></i>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  required
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200 mt-0.5"
                />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  Saya menyetujui{" "}
                  <button
                    type="button"
                    onClick={() => handlePageChange("terms")}
                    className="text-purple-600 hover:text-purple-500 font-medium underline"
                  >
                    Syarat & Ketentuan
                  </button>
                  {" "}dan{" "}
                  <button
                    type="button"
                    onClick={() => handlePageChange("privacy")}
                    className="text-purple-600 hover:text-purple-500 font-medium underline"
                  >
                    Kebijakan Privasi
                  </button>
                </span>
              </div>

              {/* Enhanced Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <i className="fas fa-spinner animate-spin"></i>
                    <span>Mendaftarkan...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <i className="fas fa-user-plus"></i>
                      <span>Daftar Akun Baru</span>
                    </span>
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  </>
                )}
              </Button>
            </form>

            {/* Social Register Section */}
            <div className="mt-8">
              <div className="relative">
                <div className={`absolute inset-0 flex items-center`}>
                  <div className={`w-full border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-4 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'} font-medium`}>
                    Atau daftar dengan
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => alert("Register Google akan segera tersedia")}
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
                  onClick={() => alert("Register Facebook akan segera tersedia")}
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

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p
                className={`text-base ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Sudah punya akun?{" "}
                <button
                  onClick={() => handlePageChange("login")}
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 inline-block"
                >
                  Masuk sekarang →
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
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
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

export default Register;