import useThemeStore from "@/store/theme";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Kontak = () => {  
  const { isDarkMode } = useThemeStore();   

    return( 
    <div className={`min-h-screen pt-20  ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header />
      <div className="max-w-7xl mb-8 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Hubungi Kami
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Kami siap membantu Anda. Jangan ragu untuk menghubungi tim kami
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Informasi Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <i className="fas fa-envelope text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Email
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      info@desacerdas.id
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <i className="fas fa-phone text-green-600"></i>
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Telepon
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      +62 21 1234 5678
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <i className="fas fa-map-marker-alt text-orange-600"></i>
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Alamat
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Jl. Pembangunan Desa No. 123<br />
                      Jakarta Selatan, DKI Jakarta 12345
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Jam Operasional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Senin - Jumat
                    </span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      08:00 - 17:00 WIB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Sabtu
                    </span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      08:00 - 12:00 WIB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Minggu
                    </span>
                    <span className={`font-medium text-red-500`}>
                      Tutup
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Kirim Pesan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Input
                    placeholder="Nama Lengkap"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Subjek"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Pesan Anda"
                    className="min-h-32 text-sm"
                  />
                </div>
                <Button className="w-full !rounded-button whitespace-nowrap cursor-pointer">
                  <i className="fas fa-paper-plane mr-2"></i>
                  Kirim Pesan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default Kontak;