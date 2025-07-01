import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { registerSchema } from "@/utils/Validator";
import useThemeStore from "@/store/theme";
import usePageStore from "@/store/page";

const Register = () => {
  const { isDarkMode } = useThemeStore();
  const { setCurrentPage } = usePageStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mendaftar");
      }

      alert("Registrasi berhasil! Silakan masuk.");
      setCurrentPage("login");
    } catch (error) {
      alert(error.message || "Terjadi kesalahan saat registrasi.");
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
            <Button type="submit" disabled={isSubmitting} className="w-full">
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
