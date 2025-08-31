// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('deskripsi');
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };
    const donorList = [
        {
            name: 'Ahmad Wijaya',
            amount: 500000,
            avatar: 'https://readdy.ai/api/search-image?query=Indonesian%20businessman%20in%20formal%20shirt%20smiling%20warmly%2C%20professional%20portrait%20photography%2C%20clean%20studio%20background%2C%20confident%20expression&width=60&height=60&seq=donor1&orientation=squarish'
        },
        {
            name: 'Siti Nurhaliza',
            amount: 300000,
            avatar: 'https://readdy.ai/api/search-image?query=Indonesian%20woman%20wearing%20hijab%20and%20professional%20attire%2C%20friendly%20smile%2C%20portrait%20photography%2C%20clean%20studio%20background&width=60&height=60&seq=donor2&orientation=squarish'
        },
        {
            name: 'Budi Santoso',
            amount: 250000,
            avatar: 'https://readdy.ai/api/search-image?query=Middle%20aged%20Indonesian%20man%20wearing%20batik%20shirt%2C%20warm%20smile%2C%20traditional%20yet%20modern%20look%2C%20clean%20studio%20background&width=60&height=60&seq=donor3&orientation=squarish'
        },
        {
            name: 'Dewi Kartika',
            amount: 200000,
            avatar: 'https://readdy.ai/api/search-image?query=Young%20Indonesian%20woman%20with%20professional%20appearance%2C%20bright%20smile%2C%20modern%20clothing%2C%20clean%20studio%20background&width=60&height=60&seq=donor4&orientation=squarish'
        },
        {
            name: 'Rudi Hermawan',
            amount: 150000,
            avatar: 'https://readdy.ai/api/search-image?query=Indonesian%20man%20in%20casual%20shirt%2C%20friendly%20expression%2C%20approachable%20demeanor%2C%20clean%20studio%20background&width=60&height=60&seq=donor5&orientation=squarish'
        }
    ];
    const galleryImages = [
        'https://readdy.ai/api/search-image?query=Indonesian%20independence%20day%20celebration%20with%20traditional%20games%20like%20panjat%20pinang%2C%20community%20gathering%2C%20red%20and%20white%20decorations%2C%20festive%20atmosphere%2C%20village%20setting&width=300&height=200&seq=gallery1&orientation=landscape',
        'https://readdy.ai/api/search-image?query=Indonesian%20flag%20ceremony%20with%20people%20in%20traditional%20clothing%2C%20patriotic%20celebration%2C%20community%20participation%2C%20morning%20sunlight%2C%20respectful%20atmosphere&width=300&height=200&seq=gallery2&orientation=landscape',
        'https://readdy.ai/api/search-image?query=Traditional%20Indonesian%20cultural%20performance%20during%20independence%20day%2C%20dancers%20in%20colorful%20costumes%2C%20community%20watching%2C%20outdoor%20stage%2C%20celebratory%20mood&width=300&height=200&seq=gallery3&orientation=landscape',
        'https://readdy.ai/api/search-image?query=Indonesian%20community%20cooking%20traditional%20food%20together%2C%20gotong%20royong%20spirit%2C%20preparation%20for%20independence%20day%2C%20communal%20kitchen%2C%20warm%20atmosphere&width=300&height=200&seq=gallery4&orientation=landscape'
    ];
    const relatedActivities = [
        {
            name: 'Kerja Bakti Membersihkan Sungai',
            date: '25 Agustus 2024',
            image: 'https://readdy.ai/api/search-image?query=Community%20volunteers%20cleaning%20river%20with%20tools%20and%20equipment%2C%20people%20working%20together%2C%20environmental%20conservation%2C%20clean%20water%20background%2C%20bright%20natural%20lighting&width=250&height=150&seq=related1&orientation=landscape'
        },
        {
            name: 'Bantuan Renovasi Masjid',
            date: '10 September 2024',
            image: 'https://readdy.ai/api/search-image?query=Beautiful%20mosque%20renovation%20project%20with%20construction%20materials%20and%20workers%2C%20Islamic%20architecture%2C%20community%20development%2C%20clean%20architectural%20background&width=250&height=150&seq=related2&orientation=landscape'
        }
    ];
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <a href="https://readdy.ai/home/18ae7350-0e60-4e22-b603-f407b7b6888c/cc515f43-ab17-4277-9cc7-a515b9e67c9e" data-readdy="true">
                                <Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-arrow-left mr-2"></i>
                                    Kembali
                                </Button>
                            </a>
                        </div>
                        <h1 className="text-lg font-semibold text-gray-900">Detail Kegiatan</h1>
                        <Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                            <i className="fas fa-share-alt"></i>
                        </Button>
                    </div>
                </div>
            </header>
            {/* Hero Section */}
            <section className="relative">
                <div className="h-80 overflow-hidden">
                    <img
                        src="https://readdy.ai/api/search-image?query=Indonesian%20independence%20day%20celebration%20banner%20with%20red%20and%20white%20decorations%2C%20traditional%20games%2C%20community%20gathering%20in%20village%20square%2C%20bright%20daylight%2C%20festive%20patriotic%20atmosphere%2C%20Indonesian%20flag%20prominent&width=1440&height=320&seq=hero-detail&orientation=landscape"
                        alt="Perayaan HUT RI ke-79"
                        className="w-full h-full object-cover object-top"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Kegiatan Nasional</Badge>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Perayaan HUT RI ke-79
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                        <div className="flex items-center">
                            <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
                            <span>17 Agustus 2024</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                            <span>Lapangan Desa Makmur, Kecamatan Sejahtera</span>
                        </div>
                    </div>
                </div>
            </section>
            {/* Progress Donasi */}
            <section className="py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="shadow-lg border-0">
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Donasi</h3>
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Terkumpul: {formatCurrency(8500000)}</span>
                                        <span>Target: {formatCurrency(15000000)}</span>
                                    </div>
                                    <Progress value={(8500000 / 15000000) * 100} className="h-3 mb-4" />
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            <i className="fas fa-clock mr-1"></i>
                                            Sisa waktu: 12 hari
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <i className="fas fa-users mr-1"></i>
                                            89 donatur
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <a href="https://readdy.ai/home/18ae7350-0e60-4e22-b603-f407b7b6888c/0de8d694-5ec3-45b9-bd68-bd2455fce7cf" data-readdy="true">
                                        <Button size="lg" className="!rounded-button whitespace-nowrap w-full cursor-pointer">
                                            <i className="fas fa-heart mr-2"></i>
                                            Donasi Sekarang
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
            {/* Detail Informasi dengan Tabs */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-8">
                            <TabsTrigger value="deskripsi" className="cursor-pointer">Deskripsi</TabsTrigger>
                            <TabsTrigger value="jadwal" className="cursor-pointer">Jadwal Acara</TabsTrigger>
                            <TabsTrigger value="persyaratan" className="cursor-pointer">Persyaratan</TabsTrigger>
                            <TabsTrigger value="galeri" className="cursor-pointer">Galeri Foto</TabsTrigger>
                        </TabsList>
                        <TabsContent value="deskripsi" className="space-y-6">
                            <Card>
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Tentang Kegiatan</h3>
                                    <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                                        <p>
                                            Perayaan HUT RI ke-79 merupakan momentum penting bagi seluruh warga Desa Makmur untuk bersatu merayakan kemerdekaan Indonesia. Kegiatan ini akan diselenggarakan dengan penuh semangat nasionalisme dan gotong royong.
                                        </p>
                                        <p>
                                            Acara ini akan menampilkan berbagai lomba tradisional seperti panjat pinang, balap karung, makan kerupuk, dan lomba merdeka lainnya yang melibatkan seluruh lapisan masyarakat dari anak-anak hingga dewasa.
                                        </p>
                                        <p>
                                            Selain lomba, akan ada juga pentas seni budaya yang menampilkan tarian tradisional, musik daerah, dan pertunjukan yang mencerminkan kekayaan budaya Indonesia. Kegiatan ini bertujuan untuk mempererat tali silaturahmi antar warga dan melestarikan nilai-nilai luhur bangsa.
                                        </p>
                                        <p>
                                            Dana yang terkumpul akan digunakan untuk pengadaan doorprize, konsumsi peserta, dekorasi, sound system, dan berbagai keperluan penyelenggaraan acara agar dapat berjalan dengan meriah dan berkesan.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="jadwal" className="space-y-6">
                            <Card>
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Jadwal Acara</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-20 text-sm font-medium text-gray-600">06:00</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Persiapan dan Dekorasi</h4>
                                                <p className="text-gray-600">Pemasangan bendera dan dekorasi merah putih</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-20 text-sm font-medium text-gray-600">08:00</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Upacara Bendera</h4>
                                                <p className="text-gray-600">Upacara pengibaran bendera merah putih</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-20 text-sm font-medium text-gray-600">09:00</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Lomba Anak-anak</h4>
                                                <p className="text-gray-600">Balap karung, lomba makan kerupuk, dan permainan tradisional</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-20 text-sm font-medium text-gray-600">11:00</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Lomba Dewasa</h4>
                                                <p className="text-gray-600">Panjat pinang, tarik tambang, dan lomba masak</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-20 text-sm font-medium text-gray-600">13:00</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Istirahat dan Makan Siang</h4>
                                                <p className="text-gray-600">Makan siang bersama dan istirahat</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-20 text-sm font-medium text-gray-600">14:30</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Pentas Seni Budaya</h4>
                                                <p className="text-gray-600">Pertunjukan tarian tradisional dan musik daerah</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-20 text-sm font-medium text-gray-600">16:00</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Pembagian Hadiah</h4>
                                                <p className="text-gray-600">Pengumuman pemenang dan pembagian doorprize</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-20 text-sm font-medium text-gray-600">17:00</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Penutupan</h4>
                                                <p className="text-gray-600">Doa bersama dan foto bersama</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="persyaratan" className="space-y-6">
                            <Card>
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Persyaratan Partisipasi</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Persyaratan Umum</h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Warga Desa Makmur atau sekitarnya
                                                </li>
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Membawa identitas diri (KTP/Kartu Pelajar)
                                                </li>
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Mendaftar melalui panitia atau online
                                                </li>
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Mengikuti protokol kesehatan yang berlaku
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Persyaratan Lomba</h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Lomba anak-anak: usia 5-12 tahun
                                                </li>
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Lomba remaja: usia 13-17 tahun
                                                </li>
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Lomba dewasa: usia 18 tahun ke atas
                                                </li>
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Setiap peserta maksimal mengikuti 3 lomba
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Yang Perlu Dibawa</h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Pakaian olahraga atau casual
                                                </li>
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Botol minum pribadi
                                                </li>
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Topi atau pelindung matahari
                                                </li>
                                                <li className="flex items-start">
                                                    <i className="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                                                    Semangat dan antusiasme tinggi!
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="galeri" className="space-y-6">
                            <Card>
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Galeri Foto Kegiatan Sebelumnya</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {galleryImages.map((image, index) => (
                                            <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                                                <img
                                                    src={image}
                                                    alt={`Galeri ${index + 1}`}
                                                    className="w-full h-48 object-cover object-top hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
            {/* Daftar Donatur */}
        
            {/* Informasi Kontak */}
         
            {/* Related Activities */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Kegiatan Terkait</h2>
                        <p className="text-lg text-gray-600">Kegiatan lain yang mungkin menarik untuk Anda</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {relatedActivities.map((activity, index) => (
                            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                                <div className="h-40 overflow-hidden">
                                    <img
                                        src={activity.image}
                                        alt={activity.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.name}</h3>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <i className="fas fa-calendar mr-2"></i>
                                        {activity.date}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {/* Floating CTA Button */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                <Button size="lg" className="!rounded-button whitespace-nowrap shadow-xl cursor-pointer px-8 py-3">
                    <i className="fas fa-user-plus mr-2"></i>
                    Daftar Sebagai Peserta
                </Button>
            </div>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 pb-24">
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