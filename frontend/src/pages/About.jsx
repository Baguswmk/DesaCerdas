import useThemeStore from "@/store/theme";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const About = () => {

    const { isDarkMode } = useThemeStore();
  return (
   <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
    <Header />
      <div className="max-w-7xl mb-8 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Tentang DesaCerdas Platform
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Platform digital terpadu yang menghubungkan teknologi modern dengan kebutuhan masyarakat desa untuk menciptakan pemberdayaan yang berkelanjutan
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Visi & Misi Kami
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Visi
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Menjadi platform digital terdepan yang memberdayakan masyarakat desa Indonesia melalui teknologi inovatif dan solusi terintegrasi.
                </p>
              </div>
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Misi
                </h3>
                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                    Menyediakan akses konsultasi hukum gratis untuk masyarakat desa
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                    Membantu petani dengan teknologi pertanian cerdas
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                    Memfasilitasi donasi untuk pembangunan infrastruktur desa
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <img 
              src="https://readdy.ai/api/search-image?query=Indonesian%20village%20community%20meeting%20with%20diverse%20people%20discussing%20development%20plans%20in%20traditional%20meeting%20hall%20with%20modern%20technology%20integration&width=500&height=500&seq=about1&orientation=squarish"
              alt="Tentang Kami"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className={`text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="fas fa-users text-2xl text-blue-600"></i>
              </div>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Komunitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Membangun komunitas yang kuat dan saling mendukung antar desa di seluruh Indonesia
              </p>
            </CardContent>
          </Card>

          <Card className={`text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <i className="fas fa-leaf text-2xl text-green-600"></i>
              </div>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Berkelanjutan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Solusi yang ramah lingkungan dan berkelanjutan untuk generasi mendatang
              </p>
            </CardContent>
          </Card>

          <Card className={`text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <i className="fas fa-rocket text-2xl text-orange-600"></i>
              </div>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Inovasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Menghadirkan teknologi terdepan yang mudah diakses dan digunakan oleh semua kalangan
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
        <Footer />
    </div>
  );
};
export default About;
