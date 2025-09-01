import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { loginSchema } from "@/utils/Validator";       
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoginError("");
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
            Masuk ke Akun
          </CardTitle>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Silakan masuk untuk mengakses layanan kami
          </p>
        </CardHeader>
        <CardContent>
          {/* Show login error */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`${
                  errors.email ? "border-red-500" : ""
                } text-sm w-full`}
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
                className={`${
                  errors.password ? "border-red-500" : ""
                } text-sm w-full`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full !rounded-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Masuk..." : "Masuk"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Belum punya akun?{" "}
              <button
                onClick={() => handlePageChange("register")}
                className="text-blue-600 hover:text-blue-500"
              >
                Daftar sekarang
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
