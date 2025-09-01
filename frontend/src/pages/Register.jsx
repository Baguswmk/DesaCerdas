import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setRegisterError("");
      setRegisterSuccess("");
      
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
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-20 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Card
        className={`w-full max-w-md ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        }`}
      >
        <CardHeader className="text-center">
          <CardTitle
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Daftar Akun Baru
          </CardTitle>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Bergabunglah dengan komunitas DesaCerdas
          </p>
        </CardHeader>
        <CardContent>
          {/* Show register error */}
          {registerError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {registerError}
            </div>
          )}
          
          {/* Show register success */}
          {registerSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {registerSuccess}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Nama Lengkap"
                {...register("name")}
                className={`${errors.name ? "border-red-500" : ""} text-sm`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`${errors.email ? "border-red-500" : ""} text-sm`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
                className={`${errors.password ? "border-red-500" : ""} text-sm`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Konfirmasi Password"
                {...register("confirmPassword")}
                className={`${
                  errors.confirmPassword ? "border-red-500" : ""
                } text-sm`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full !rounded-button"
            >
              {isSubmitting ? "Mendaftarkan..." : "Daftar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Sudah punya akun?{" "}
              <button
                onClick={() => handlePageChange("login")}
                className="text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Masuk sekarang
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
