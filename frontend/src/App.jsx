// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as echarts from "echarts";
import "./App.css"
const App = () => {
  const [activeTab, setActiveTab] = React.useState("beranda");
  React.useEffect(() => {
    const chartDom = document.getElementById("statisticsChart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: [
            "Pertanyaan Terjawab",
            "Petani Terbantu",
            "Dana Terkumpul (Juta Rp)",
          ],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Pertanyaan Terjawab",
            type: "bar",
            data: [120, 132, 101, 134, 90, 230],
            color: "#10b981",
          },
          {
            name: "Petani Terbantu",
            type: "bar",
            data: [220, 182, 191, 234, 290, 330],
            color: "#3b82f6",
          },
          {
            name: "Dana Terkumpul (Juta Rp)",
            type: "bar",
            data: [150, 232, 201, 154, 190, 330],
            color: "#f59e0b",
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      return () => {
        myChart.dispose();
        window.removeEventListener("resize", () => {
          myChart.resize();
        });
      };
    }
  }, [activeTab]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-green-600">
              <span className="text-blue-600">Desa</span>Cerdas
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => setActiveTab("beranda")}
              className={`font-medium transition-colors hover:text-green-600 ${
                activeTab === "beranda" ? "text-green-600" : "text-gray-700"
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => setActiveTab("tanyahukum")}
              className={`font-medium transition-colors hover:text-green-600 ${
                activeTab === "tanyahukum" ? "text-green-600" : "text-gray-700"
              }`}
            >
              TanyaHukum
            </button>
            <button
              onClick={() => setActiveTab("farmsmart")}
              className={`font-medium transition-colors hover:text-green-600 ${
                activeTab === "farmsmart" ? "text-green-600" : "text-gray-700"
              }`}
            >
              FarmSmart
            </button>
            <button
              onClick={() => setActiveTab("bantudesa")}
              className={`font-medium transition-colors hover:text-green-600 ${
                activeTab === "bantudesa" ? "text-green-600" : "text-gray-700"
              }`}
            >
              BantuDesa
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="!rounded-button whitespace-nowrap"
            >
              Masuk
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 !rounded-button whitespace-nowrap">
              Daftar
            </Button>
          </div>
        </div>
      </header>
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage:
                "url('https://readdy.ai/api/search-image?query=Beautiful%20Indonesian%20village%20scene%20with%20modern%20technology%20integration%2C%20lush%20green%20rice%20fields%20with%20farmers%20using%20tablets%2C%20community%20center%20with%20solar%20panels%2C%20clean%20vibrant%20village%20atmosphere%2C%20soft%20natural%20lighting%2C%20realistic%20photographic%20style%2C%20no%20people&width=1440&height=600&seq=hero1&orientation=landscape')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.7)",
            }}
          ></div>
          <div className="container mx-auto px-4 py-24 relative z-10">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">
                Platform Digital untuk Pemberdayaan Desa
              </h1>
              <p className="text-xl mb-8">
                Solusi terpadu untuk kemajuan desa di era digital. Akses bantuan
                hukum, pertanian cerdas, dan penggalangan dana dalam satu
                platform.
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 !rounded-button whitespace-nowrap">
                Mulai Sekarang
              </Button>
            </div>
          </div>
        </section>
        {/* Feature Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Fitur Utama</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                DesaCerdas menyediakan tiga layanan utama untuk membantu
                pemberdayaan masyarakat desa di Indonesia
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Indonesian%20legal%20consultation%20scene%20with%20modern%20AI%20assistant%2C%20clean%20office%20environment%2C%20legal%20books%20and%20documents%2C%20professional%20setting%2C%20soft%20lighting%2C%20realistic%20photographic%20style&width=400&height=200&seq=feature1&orientation=landscape"
                    alt="TanyaHukum"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-balance-scale text-blue-600 mr-2"></i>
                    TanyaHukum
                  </CardTitle>
                  <CardDescription>Asisten Hukum berbasis AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Dapatkan jawaban instan untuk pertanyaan hukum Anda. Sistem
                    AI kami akan memberikan informasi hukum yang relevan dan
                    mudah dipahami.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap">
                    Pelajari Lebih Lanjut
                  </Button>
                </CardFooter>
              </Card>
              <Card className="overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Indonesian%20smart%20farming%20technology%2C%20farmers%20using%20tablets%20in%20rice%20fields%2C%20weather%20monitoring%20stations%2C%20agricultural%20sensors%20in%20fields%2C%20beautiful%20green%20farm%20landscape%2C%20realistic%20photographic%20style&width=400&height=200&seq=feature2&orientation=landscape"
                    alt="FarmSmart"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-seedling text-green-600 mr-2"></i>
                    FarmSmart
                  </CardTitle>
                  <CardDescription>Pertanian Cerdas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Rekomendasi pertanian berbasis AI dan data cuaca. Dapatkan
                    saran tentang waktu tanam, panen, dan perawatan tanaman yang
                    optimal.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700 !rounded-button whitespace-nowrap">
                    Pelajari Lebih Lanjut
                  </Button>
                </CardFooter>
              </Card>
              <Card className="overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Indonesian%20village%20community%20fundraising%20event%2C%20people%20gathering%20around%20digital%20donation%20board%2C%20traditional%20village%20meeting%20hall%20with%20modern%20technology%2C%20warm%20community%20atmosphere%2C%20realistic%20photographic%20style&width=400&height=200&seq=feature3&orientation=landscape"
                    alt="BantuDesa"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-hand-holding-heart text-red-600 mr-2"></i>
                    BantuDesa
                  </CardTitle>
                  <CardDescription>Platform Donasi Desa</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Platform penggalangan dana transparan untuk proyek dan acara
                    desa. Dukung pembangunan dan kegiatan di desa dengan mudah
                    dan aman.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-red-600 hover:bg-red-700 !rounded-button whitespace-nowrap">
                    Pelajari Lebih Lanjut
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        {/* How It Works */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Cara Kerja</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tiga langkah sederhana untuk mendapatkan manfaat dari platform
                DesaCerdas
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-mouse-pointer text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Langkah 1</h3>
                <p className="text-gray-700">
                  Pilih layanan yang Anda butuhkan: TanyaHukum, FarmSmart, atau
                  BantuDesa
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-edit text-2xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Langkah 2</h3>
                <p className="text-gray-700">
                  Isi informasi yang diperlukan sesuai dengan layanan yang Anda
                  pilih
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-check-circle text-2xl text-red-600"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Langkah 3</h3>
                <p className="text-gray-700">
                  Dapatkan solusi atau bantuan yang Anda butuhkan secara instan
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Statistics Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Statistik dan Pencapaian
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Dampak nyata yang telah kami berikan untuk masyarakat desa di
                Indonesia
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              <div className="bg-blue-50 p-8 rounded-lg text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  5,280+
                </div>
                <p className="text-gray-700">Pertanyaan Hukum Terjawab</p>
              </div>
              <div className="bg-green-50 p-8 rounded-lg text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  3,750+
                </div>
                <p className="text-gray-700">Petani Terbantu</p>
              </div>
              <div className="bg-red-50 p-8 rounded-lg text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  Rp 1.2M+
                </div>
                <p className="text-gray-700">Total Dana Terkumpul</p>
              </div>
              <div className="bg-purple-50 p-8 rounded-lg text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  120+
                </div>
                <p className="text-gray-700">Desa Tergabung</p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-center">
                Perkembangan Bulanan
              </h3>
              <div id="statisticsChart" className="w-full h-80"></div>
            </div>
          </div>
        </section>
        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Testimoni Pengguna</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Apa kata pengguna tentang platform DesaCerdas
              </p>
            </div>
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                <CarouselItem className="md:basis-1/2">
                  <div className="bg-white p-8 rounded-lg shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-user text-blue-600"></i>
                      </div>
                      <div>
                        <h4 className="font-bold">Budi Santoso</h4>
                        <p className="text-sm text-gray-600">
                          Petani, Desa Sukamaju
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">
                      "Berkat FarmSmart, saya bisa menentukan waktu tanam yang
                      tepat. Hasil panen saya meningkat 30% dibanding musim
                      sebelumnya!"
                    </p>
                    <div className="mt-4 flex">
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2">
                  <div className="bg-white p-8 rounded-lg shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-user text-green-600"></i>
                      </div>
                      <div>
                        <h4 className="font-bold">Siti Rahayu</h4>
                        <p className="text-sm text-gray-600">
                          Kepala Desa, Desa Sejahtera
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">
                      "Platform BantuDesa sangat membantu kami dalam
                      mengumpulkan dana untuk pembangunan balai desa. Prosesnya
                      transparan dan warga jadi lebih percaya."
                    </p>
                    <div className="mt-4 flex">
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star-half-alt text-yellow-500"></i>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2">
                  <div className="bg-white p-8 rounded-lg shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-user text-red-600"></i>
                      </div>
                      <div>
                        <h4 className="font-bold">Ahmad Wijaya</h4>
                        <p className="text-sm text-gray-600">
                          Warga, Desa Makmur
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">
                      "TanyaHukum membantu saya menyelesaikan masalah sertifikat
                      tanah. Informasinya jelas dan mudah dipahami. Terima kasih
                      DesaCerdas!"
                    </p>
                    <div className="mt-4 flex">
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Bergabung Sekarang</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Jadilah bagian dari revolusi digital untuk desa di Indonesia.
              Daftarkan desa Anda dan nikmati semua fitur DesaCerdas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6 !rounded-button whitespace-nowrap">
                Daftar Gratis
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-6 !rounded-button whitespace-nowrap"
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </section>
        {/* Featured On */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-4">Didukung Oleh</h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <div className="flex items-center text-gray-500">
                <i className="fas fa-university text-4xl mr-2"></i>
                <span className="text-lg font-semibold">Kementerian Desa</span>
              </div>
              <div className="flex items-center text-gray-500">
                <i className="fas fa-laptop-code text-4xl mr-2"></i>
                <span className="text-lg font-semibold">Digital Indonesia</span>
              </div>
              <div className="flex items-center text-gray-500">
                <i className="fas fa-seedling text-4xl mr-2"></i>
                <span className="text-lg font-semibold">Tani Maju</span>
              </div>
              <div className="flex items-center text-gray-500">
                <i className="fas fa-graduation-cap text-4xl mr-2"></i>
                <span className="text-lg font-semibold">
                  Universitas Indonesia
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-blue-400">Desa</span>
                <span className="text-green-400">Cerdas</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Platform digital terpadu untuk memberdayakan masyarakat desa di
                era digital.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Layanan</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://readdy.ai/home/6ed5bad4-b9b9-47bb-b2b6-28f3dd168ee0/4452ec4f-2f9c-4af9-a986-e3e4f2f7f818"
                    data-readdy="true"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    TanyaHukum
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FarmSmart
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    BantuDesa
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Statistik Desa
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Perusahaan</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Tim
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Karir
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Bantuan</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pusat Bantuan
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 DesaCerdas. Hak Cipta Dilindungi.</p>
            <div className="flex justify-center mt-4 space-x-4">
              <i className="fab fa-cc-visa text-2xl"></i>
              <i className="fab fa-cc-mastercard text-2xl"></i>
              <i className="fab fa-paypal text-2xl"></i>
              <i className="fas fa-money-bill-wave text-2xl"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
