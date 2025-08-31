// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('beranda');
    const activities = [
        {
            id: 1,
            name: 'Perayaan HUT RI ke-79',
            date: '17 Agustus 2024',
            location: 'Lapangan Desa',
            description: 'Mari bersama-sama merayakan kemerdekaan Indonesia dengan berbagai lomba dan kegiatan menarik',
            target: 15000000,
            collected: 8500000,
            image: 'https://readdy.ai/api/search-image?query=Indonesian%20independence%20day%20celebration%20with%20red%20and%20white%20decorations%2C%20traditional%20games%2C%20and%20community%20gathering%20in%20village%20square%2C%20bright%20daylight%2C%20festive%20atmosphere%2C%20clean%20background&width=400&height=250&seq=activity1&orientation=landscape'
        },
        {
            id: 2,
            name: 'Kerja Bakti Membersihkan Sungai',
            date: '25 Agustus 2024',
            location: 'Sungai Desa Makmur',
            description: 'Gotong royong membersihkan sungai untuk lingkungan yang lebih sehat dan bersih',
            target: 5000000,
            collected: 3200000,
            image: 'https://readdy.ai/api/search-image?query=Community%20volunteers%20cleaning%20river%20with%20tools%20and%20equipment%2C%20people%20working%20together%2C%20environmental%20conservation%2C%20clean%20water%20background%2C%20bright%20natural%20lighting&width=400&height=250&seq=activity2&orientation=landscape'
        },
        {
            id: 3,
            name: 'Bantuan Renovasi Masjid',
            date: '10 September 2024',
            location: 'Masjid Al-Ikhlas',
            description: 'Renovasi dan perbaikan fasilitas masjid untuk kenyamanan ibadah bersama',
            target: 25000000,
            collected: 12800000,
            image: 'https://readdy.ai/api/search-image?query=Beautiful%20mosque%20renovation%20project%20with%20construction%20materials%20and%20workers%2C%20Islamic%20architecture%2C%20community%20development%2C%20clean%20architectural%20background&width=400&height=250&seq=activity3&orientation=landscape'
        }
    ];
    const testimonials = [
        {
            name: 'Budi Santoso',
            role: 'Ketua RT 05',
            text: 'Platform Bantu Desa sangat membantu mengorganisir kegiatan di desa kami. Partisipasi warga meningkat drastis!',
            avatar: 'https://readdy.ai/api/search-image?query=Professional%20Indonesian%20man%20in%20his%2040s%20wearing%20traditional%20batik%20shirt%2C%20friendly%20smile%2C%20clean%20studio%20background%2C%20portrait%20photography&width=80&height=80&seq=testimonial1&orientation=squarish'
        },
        {
            name: 'Siti Aminah',
            role: 'Ibu PKK',
            text: 'Dengan adanya fitur ini, kami bisa lebih mudah mengajak warga untuk berpartisipasi dalam kegiatan sosial.',
            avatar: 'https://readdy.ai/api/search-image?query=Indonesian%20woman%20wearing%20hijab%20and%20traditional%20kebaya%2C%20warm%20smile%2C%20professional%20portrait%2C%20clean%20studio%20background&width=80&height=80&seq=testimonial2&orientation=squarish'
        }
    ];
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-home text-2xl text-blue-600"></i>
                            <span className="text-xl font-bold text-gray-900">Desa Cerdas</span>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <button
                                onClick={() => setActiveTab('beranda')}
                                className={`text-sm font-medium cursor-pointer whitespace-nowrap ${activeTab === 'beranda' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                            >
                                Beranda
                            </button>
                            <button
                                onClick={() => setActiveTab('kegiatan')}
                                className={`text-sm font-medium cursor-pointer whitespace-nowrap ${activeTab === 'kegiatan' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                            >
                                Kegiatan
                            </button>
                            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer whitespace-nowrap">
                                Tentang Kami
                            </button>
                            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer whitespace-nowrap">
                                Kontak
                            </button>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap">
                                Masuk
                            </Button>
                            <Button size="sm" className="!rounded-button whitespace-nowrap">
                                Daftar
                            </Button>
                        </div>
                        <button className="md:hidden">
                            <i className="fas fa-bars text-xl text-gray-700"></i>
                        </button>
                    </div>
                </div>
            </header>
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.8), rgba(37, 99, 235, 0.6)), url('https://readdy.ai/api/search-image?query=Beautiful%20Indonesian%20village%20landscape%20with%20traditional%20houses%2C%20green%20rice%20fields%2C%20mountains%20in%20background%2C%20community%20gathering%2C%20warm%20golden%20hour%20lighting%2C%20peaceful%20rural%20atmosphere&width=1440&height=600&seq=hero1&orientation=landscape')`
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Bantu Desa, Wujudkan Kegiatan Bersama
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                            Mari bergotong royong membangun desa lebih baik melalui partisipasi aktif dalam setiap kegiatan
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="!rounded-button whitespace-nowrap text-lg px-8 py-3">
                                <i className="fas fa-eye mr-2"></i>
                                Lihat Kegiatan
                            </Button>
                            <Button variant="outline" size="lg" className="!rounded-button whitespace-nowrap text-lg px-8 py-3 bg-white/10 border-white text-white hover:bg-white hover:text-blue-600">
                                <i className="fas fa-plus mr-2"></i>
                                Ajukan Kegiatan
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            {/* Statistics Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="pt-8 pb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-calendar-alt text-2xl text-blue-600"></i>
                                </div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">24</div>
                                <div className="text-lg text-gray-600">Total Kegiatan</div>
                            </CardContent>
                        </Card>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="pt-8 pb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-money-bill-wave text-2xl text-green-600"></i>
                                </div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">2.5M</div>
                                <div className="text-lg text-gray-600">Dana Terkumpul</div>
                            </CardContent>
                        </Card>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="pt-8 pb-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-users text-2xl text-purple-600"></i>
                                </div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">156</div>
                                <div className="text-lg text-gray-600">Jumlah Partisipan</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            {/* Active Activities Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Kegiatan Aktif
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Bergabunglah dalam berbagai kegiatan desa yang sedang berlangsung dan butuh dukungan Anda
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activities.map((activity) => (
                            <Card key={activity.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={activity.image}
                                        alt={activity.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.name}</h3>
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <i className="fas fa-calendar mr-2"></i>
                                        {activity.date}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 mb-4">
                                        <i className="fas fa-map-marker-alt mr-2"></i>
                                        {activity.location}
                                    </div>
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                        {activity.description}
                                    </p>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Terkumpul: {formatCurrency(activity.collected)}</span>
                                            <span>Target: {formatCurrency(activity.target)}</span>
                                        </div>
                                        <Progress value={(activity.collected / activity.target) * 100} className="h-2" />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button className="flex-1 !rounded-button whitespace-nowrap">
                                            <i className="fas fa-heart mr-2"></i>
                                            Donasi
                                        </Button>
                                        <a href="https://readdy.ai/home/18ae7350-0e60-4e22-b603-f407b7b6888c/10ce7fe9-716f-41cf-9cac-2d643c1d0cdd" data-readdy="true">
                                            <Button variant="outline" className="flex-1 !rounded-button whitespace-nowrap">
                                                <i className="fas fa-info-circle mr-2"></i>
                                                Detail
                                            </Button>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {/* Submit New Activity Section */}
           
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <i className="fas fa-home text-2xl text-blue-400"></i>
                                <span className="text-xl font-bold">Desa Cerdas</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Platform digital untuk memfasilitasi gotong royong dan partisipasi aktif warga dalam pembangunan desa.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">Tautan Cepat</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Beranda</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Kegiatan</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Tentang Kami</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer">Kontak</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">Hubungi Kami</h4>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <i className="fas fa-map-marker-alt mr-3 text-blue-400"></i>
                                    <span className="text-gray-400">Jl. Desa Makmur No. 123, Kabupaten Sejahtera</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="fas fa-phone mr-3 text-blue-400"></i>
                                    <span className="text-gray-400">+62 812-3456-7890</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="fas fa-envelope mr-3 text-blue-400"></i>
                                    <span className="text-gray-400">info@desacerdas.id</span>
                                </div>
                            </div>
                            <div className="flex space-x-4 mt-6">
                                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                                    <i className="fab fa-facebook text-xl"></i>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                                    <i className="fab fa-instagram text-xl"></i>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                                    <i className="fab fa-twitter text-xl"></i>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                                    <i className="fab fa-whatsapp text-xl"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                © 2024 Desa Cerdas. Semua hak cipta dilindungi.
                            </p>
                            <div className="flex items-center space-x-6 mt-4 md:mt-0">
                                <span className="text-gray-400 text-sm">Didukung oleh:</span>
                                <div className="flex items-center space-x-4">
                                    <i className="fab fa-google text-xl text-gray-400"></i>
                                    <i className="fab fa-microsoft text-xl text-gray-400"></i>
                                    <i className="fas fa-university text-xl text-gray-400"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default App