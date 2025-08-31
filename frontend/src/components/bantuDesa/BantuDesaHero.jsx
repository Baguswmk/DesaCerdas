// import { Button } from "../ui/button"

const BantuDesaHero = () => {
    return (
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
                                {/* <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="!rounded-button whitespace-nowrap text-lg px-8 py-3">
                                        <i className="fas fa-eye mr-2"></i>
                                        Lihat Kegiatan
                                    </Button>
                                    <Button variant="outline" size="lg" className="!rounded-button whitespace-nowrap text-lg px-8 py-3 bg-white/10 border-white text-white hover:bg-white hover:text-blue-600">
                                        <i className="fas fa-plus mr-2"></i>
                                        Ajukan Kegiatan
                                    </Button>
                                </div> */}
                            </div>
                        </div>
                    </section>
    )
}

export default BantuDesaHero;