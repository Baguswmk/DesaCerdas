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

    if (strength <= 25) return { strength, text: "Lemah", color: "bg-gradient-to-r from-red-500 to-red-600" };
    if (strength <= 50) return { strength, text: "Cukup", color: "bg-gradient-to-r from-orange-500 to-orange-600" };
    if (strength <= 75) return { strength, text: "Baik", color: "bg-gradient-to-r from-blue-500 to-blue-600" };
    return { strength, text: "Kuat", color: "bg-gradient-to-r from-emerald-500 to-emerald-600" };
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
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20"
      }`}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-400/10 via-green-500/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse-slow"
          style={{
            left: `${25 + mousePosition.x * 0.01}%`,
            top: `${15 + mousePosition.y * 0.01}%`,
          }}
        ></div>
        <div
          className="absolute w-80 h-80 bg-gradient-to-r from-green-400/10 via-emerald-500/10 to-green-600/10 rounded-full blur-3xl animate-pulse-slow delay-1000"
          style={{
            right: `${20 + mousePosition.x * 0.01}%`,
            bottom: `${25 + mousePosition.y * 0.01}%`,
          }}
        ></div>

        {/* Enhanced floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-float"
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
        className={`w-full max-w-lg relative z-10 shadow-2xl backdrop-blur-xl border overflow-hidden ${
          isDarkMode 
            ? "bg-gray-800/90 border-gray-700/50" 
            : "bg-white/90 border-emerald-200/50"
        } rounded-3xl`}
      >
        {/* Enhanced top accent with emerald gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-gradient-x"></div>

        <div className="relative z-10">
          <CardHeader className="text-center pb-8 pt-12">
            {/* Enhanced Logo/Icon */}
            <div className="mb-8 mx-auto">
              <div className={`w-24 h-24 mx-auto rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 relative overflow-hidden group`}>
                <i className="fas fa-user-plus text-4xl text-white relative z-10"></i>
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-300"></div>
              </div>
            </div>

            <CardTitle
              className={`text-4xl font-black mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Bergabunglah
            </CardTitle>
            <p
              className={`text-lg font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Daftar dan jadilah bagian dari komunitas
              <span className="font-black bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent"> DesaCerdas</span>
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Enhanced Error Display */}
            {registerError && (
              <div className={`mb-6 p-4 rounded-2xl border shadow-lg backdrop-blur-sm animate-shake ${
                isDarkMode 
                  ? 'bg-red-900/20 border-red-700/50 text-red-400' 
                  : 'bg-red-50 border-red-200 text-red-600'
              } relative overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2 flex items-center bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                    <i className="fas fa-exclamation-triangle text-white text-sm"></i>
                  </div>
                  <span className="font-semibold">{registerError}</span>
                </div>
              </div>
            )}

            {/* Enhanced Success Display */}
            {registerSuccess && (
              <div className={`mb-6 p-4 rounded-2xl border shadow-lg backdrop-blur-sm animate-bounce-gentle ${
                isDarkMode 
                  ? 'bg-emerald-900/20 border-emerald-700/50 text-emerald-400' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              } relative overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2 flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                    <i className="fas fa-check-circle text-white text-sm"></i>
                  </div>
                  <span className="font-semibold">{registerSuccess}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Enhanced Name Field */}
              <div className="space-y-3">
                <label className={`text-sm font-bold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } flex items-center gap-3`}>
                  <div className="p-2 flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                    <i className="fas fa-user text-white text-xs"></i>
                  </div>
                  Nama Lengkap
                </label>
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    {...register("name")}
                    className={`${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : isDarkMode
                          ? "border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                    } text-base w-full pl-12 pr-4 py-4 rounded-2xl transition-all duration-300 shadow-lg focus:shadow-2xl backdrop-blur-sm font-medium ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white/80 text-gray-900 placeholder-gray-500'
                    } hover:shadow-xl group-hover:scale-102`}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className={`p-2 flex items-center rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-emerald-100'
                    } group-focus-within:bg-emerald-500 transition-all duration-300`}>
                      <i className={`fas fa-id-card text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-emerald-600'
                      } group-focus-within:text-white transition-colors duration-300`}></i>
                    </div>
                  </div>
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm font-bold flex items-center gap-2 animate-fadeInUp">
                    <div className="p-1 bg-red-500 rounded-full">
                      <i className="fas fa-times text-white text-xs"></i>
                    </div>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Enhanced Email Field */}
              <div className="space-y-3">
                <label className={`text-sm font-bold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } flex items-center gap-3`}>
                  <div className="p-2 flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                    <i className="fas fa-envelope text-white text-xs"></i>
                  </div>
                  Email Address
                </label>
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    {...register("email")}
                    className={`${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : isDarkMode
                          ? "border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                    } text-base w-full pl-12 pr-4 py-4 rounded-2xl transition-all duration-300 shadow-lg focus:shadow-2xl backdrop-blur-sm font-medium ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white/80 text-gray-900 placeholder-gray-500'
                    } hover:shadow-xl group-hover:scale-102`}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className={`p-2 flex items-center rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-emerald-100'
                    } group-focus-within:bg-emerald-500 transition-all duration-300`}>
                      <i className={`fas fa-at text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-emerald-600'
                      } group-focus-within:text-white transition-colors duration-300`}></i>
                    </div>
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm font-bold flex items-center gap-2 animate-fadeInUp">
                    <div className="p-1 bg-red-500 rounded-full">
                      <i className="fas fa-times text-white text-xs"></i>
                    </div>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Enhanced Password Field */}
              <div className="space-y-3">
                <label className={`text-sm font-bold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } flex items-center gap-3`}>
                  <div className="p-2 flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                    <i className="fas fa-lock text-white text-xs"></i>
                  </div>
                  Password
                </label>
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Buat password yang kuat"
                    {...register("password")}
                    className={`${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : isDarkMode
                          ? "border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                    } text-base w-full pl-12 pr-14 py-4 rounded-2xl transition-all duration-300 shadow-lg focus:shadow-2xl backdrop-blur-sm font-medium ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white/80 text-gray-900 placeholder-gray-500'
                    } hover:shadow-xl group-hover:scale-102`}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className={`p-2 flex items-center rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-emerald-100'
                    } group-focus-within:bg-emerald-500 transition-all duration-300`}>
                      <i className={`fas fa-key text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-emerald-600'
                      } group-focus-within:text-white transition-colors duration-300`}></i>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                        : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
                    } hover:scale-110`}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>

                {/* Enhanced Password Strength Indicator */}
                {password && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className={`flex-1 rounded-full h-3 overflow-hidden shadow-inner ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div
                          className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-black px-3 py-1 rounded-full shadow-lg ${
                        passwordStrength.strength <= 25 ? 'bg-red-100 text-red-700' :
                        passwordStrength.strength <= 50 ? 'bg-orange-100 text-orange-700' :
                        passwordStrength.strength <= 75 ? 'bg-blue-100 text-blue-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className={`text-xs font-medium p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-emerald-50/50 text-gray-600'
                    } backdrop-blur-sm border ${
                      isDarkMode ? 'border-gray-600/30' : 'border-emerald-200/50'
                    }`}>
                      Password harus mengandung huruf besar, kecil, angka (min. 8 karakter)
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm font-bold flex items-center gap-2 animate-fadeInUp">
                    <div className="p-1 bg-red-500 rounded-full">
                      <i className="fas fa-times text-white text-xs"></i>
                    </div>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Enhanced Confirm Password Field */}
              <div className="space-y-3">
                <label className={`text-sm font-bold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } flex items-center gap-3`}>
                  <div className="p-2 flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                    <i className="fas fa-lock text-white text-xs"></i>
                  </div>
                  Konfirmasi Password
                </label>
                <div className="relative group">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    {...register("confirmPassword")}
                    className={`${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : isDarkMode
                          ? "border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                    } text-base w-full pl-12 pr-14 py-4 rounded-2xl transition-all duration-300 shadow-lg focus:shadow-2xl backdrop-blur-sm font-medium ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white/80 text-gray-900 placeholder-gray-500'
                    } hover:shadow-xl group-hover:scale-102`}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className={`p-2 flex items-center rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-emerald-100'
                    } group-focus-within:bg-emerald-500 transition-all duration-300`}>
                      <i className={`fas fa-check-double text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-emerald-600'
                      } group-focus-within:text-white transition-colors duration-300`}></i>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                        : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
                    } hover:scale-110`}
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm font-bold flex items-center gap-2 animate-fadeInUp">
                    <div className="p-1 bg-red-500 rounded-full">
                      <i className="fas fa-times text-white text-xs"></i>
                    </div>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Enhanced Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`w-full py-4 text-lg font-black rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white' 
                    : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white'
                } border border-emerald-500/30 hover:border-emerald-400/50`}
              >
                {/* Enhanced shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                
                {isSubmitting || isLoading ? (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Mendaftarkan...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <i className="fas fa-user-plus"></i>
                    <span>Daftar Akun Baru</span>
                  </span>
                )}
              </Button>
            </form>

            {/* Enhanced Login Link */}
            <div className="mt-8 text-center">
              <p
                className={`text-base font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Sudah punya akun?{" "}
                <button
                  onClick={() => handlePageChange("login")}
                  className="font-black bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-emerald-500 hover:via-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  Masuk sekarang →
                </button>
              </p>
            </div>

            {/* Enhanced Back to Home */}
            <div className="mt-8 text-center">
              <button
                onClick={() => handlePageChange("home")}
                className={`text-sm font-bold ${
                  isDarkMode ? "text-gray-400 hover:text-emerald-400" : "text-gray-500 hover:text-emerald-600"
                } transition-all duration-300 flex items-center justify-center gap-2 mx-auto hover:scale-105 p-3 rounded-2xl hover:bg-emerald-50/10 backdrop-blur-sm`}
              >
                <div className={`p-2 flex items-center rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-emerald-100'
                } group-hover:bg-emerald-500 transition-all duration-300`}>
                  <i className="fas fa-home text-xs"></i>
                </div>
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </CardContent>
        </div>
      </Card>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          33% { transform: translateY(-8px) rotate(2deg); opacity: 1; }
          66% { transform: translateY(-4px) rotate(-2deg); opacity: 0.8; }
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
        .hover\\:scale-102:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
};

export default Register;